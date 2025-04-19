# API Reference: tRPC & Integrations

_This reference provides specifications for Kingtavo\'s internal tRPC API and external integrations (e.g., Webhooks, third-party APIs)._

---

## 1. Internal API: tRPC

The primary internal API for communication between the Next.js frontend and backend logic is built using tRPC. This provides end-to-end type safety.

### 1.1 tRPC Setup & Configuration

Setting up tRPC involves initializing the server, defining context, and creating routers.

**Required Packages:**

```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query zod @supabase/supabase-js
```

**Core Files Structure (example):**

```
src/
├── app/
│   └── api/
│       └── trpc/
│           └── [trpc]/           # Catch-all route handler
│               └── route.ts
├── lib/
│   └── trpc/
│       ├── client.ts             # Frontend client setup
│       ├── server.ts             # Backend tRPC server setup (entry point)
│       ├── context.ts            # Context creation logic
│       ├── trpc.ts               # tRPC initialization, middleware, procedures
│       └── routers/
│           ├── _app.ts           # Main app router (merges sub-routers)
│           ├── customer.ts       # Example: Customer-related procedures
│           └── quote.ts          # Example: Quote-related procedures
└── types/
    └── index.ts              # Shared types, Zod schemas
```

**tRPC Initialization (`src/lib/trpc/trpc.ts`):**

```typescript
import { initTRPC, TRPCError } from \'@trpc/server\';
import superjson from \'superjson\';
import { type Context } from \'./context\';

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson, // Use superjson for Date, Map, Set serialization
  errorFormatter({ shape }) {
    return shape;
  },
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Middleware for protecting procedures
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user || !ctx.userProfile) {
    throw new TRPCError({ code: \'UNAUTHORIZED\' });
  }
  return next({
    ctx: {
      // Infers session and userProfile are non-null
      session: { ...ctx.session, user: ctx.session.user },
      userProfile: ctx.userProfile,
    },
  });
});

// Protected procedure (requires user to be logged in)
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

// Optional: Role-based procedure
// export const adminProcedure = protectedProcedure.use(...)
```

**Context Creation (`src/lib/trpc/context.ts`):**

The context provides data available to all tRPC procedures (e.g., database client, user session).

```typescript
import { type FetchCreateContextFnOptions } from \'@trpc/server/adapters/fetch\';
import { createServerClient } from \'@supabase/ssr\';
import { cookies } from \'next/headers\';
import { Database } from \'@/types/supabase\'; // Your generated Supabase types

interface UserProfile {
  company_id: string;
  role: string;
  // Add other relevant profile fields
}

// Define the shape of the context
export interface Context {
  supabase: ReturnType<typeof createServerClient<Database>>;
  session: Awaited<ReturnType<Context[\'supabase\'][\'auth\'][\'getSession\']>>[\'data\'][\'session\'];
  userProfile: UserProfile | null;
}

// Create context function - runs for every request
export const createContext = async (opts?: FetchCreateContextFnOptions): Promise<Context> => {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const { data: { session } } = await supabase.auth.getSession();

  let userProfile: UserProfile | null = null;
  if (session?.user?.id) {
    // Fetch user profile details including company_id and role
    const { data: profileData, error } = await supabase
      .from(\'users\') // Assuming a \'users\' table linked to auth.users
      .select(\'company_id, role\') // Adjust fields as needed
      .eq(\'id\', session.user.id)
      .single();

    if (error) {
      console.error(\'Error fetching user profile:\', error);
      // Handle error appropriately - maybe throw or return null profile
    } else if (profileData) {
      userProfile = profileData as UserProfile; // Adjust type assertion if necessary
    }
  }

  return {
    supabase,
    session,
    userProfile,
  };
};
```

**App Router (`src/lib/trpc/routers/_app.ts`):**

Merges all sub-routers into the main application router.

```typescript
import { createTRPCRouter } from \'@/lib/trpc/trpc\';
import { customerRouter } from \'./customer\';
import { quoteRouter } from \'./quote\';
// Import other routers...

export const appRouter = createTRPCRouter({
  customer: customerRouter,
  quote: quoteRouter,
  // Add other routers here...
});

// Export type definition of API
export type AppRouter = typeof appRouter;
```

**Route Handler (`src/app/api/trpc/[trpc]/route.ts`):**

Connects the tRPC server to Next.js API routes.

```typescript
import { fetchRequestHandler } from \'@trpc/server/adapters/fetch\';
import { type NextRequest } from \'next/server\';

import { appRouter } from \'@/lib/trpc/server\'; // Ensure correct path
import { createContext } from \'@/lib/trpc/context\'; // Ensure correct path

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: \'/api/trpc\',
    req,
    router: appRouter,
    createContext: () => createContext(),
    onError:
      process.env.NODE_ENV === \'development\'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? \'<no-path>\'}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
```

**Client Setup (`src/lib/trpc/client.ts`):**

Configures the tRPC client for frontend usage with React Query.

```typescript
import { createTRPCReact } from \'@trpc/react-query\';
import { type AppRouter } from \'@/lib/trpc/server\'; // Ensure correct path

export const trpc = createTRPCReact<AppRouter>({});
```

**(Ensure to wrap your `_app.tsx` or `layout.tsx` with the necessary tRPC and React Query providers)**

### 1.2 Example Router & Procedures

**Validation:** Uses Zod for robust input validation.

**Example Customer Router (`src/lib/trpc/routers/customer.ts`):**

```typescript
import { z } from \'zod\';
import { createTRPCRouter, protectedProcedure, publicProcedure } from \'@/lib/trpc/trpc\';
import { TRPCError } from \'@trpc/server\';

// Example Zod schema for customer input
const customerInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().nullable(),
  phone: z.string().optional().nullable(),
  // Add other fields as needed
});

export const customerRouter = createTRPCRouter({
  // Get a single customer by ID (Protected)
  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(\'customer\') // Use your actual table name
        .select(\'*\')
        .eq(\'id\', input.id)
        .eq(\'company_id\', ctx.userProfile.company_id) // Enforce multi-tenancy
        .single();

      if (error || !data) {
        throw new TRPCError({ code: \'NOT_FOUND\', message: \'Customer not found.\' });
      }
      return data;
    }),

  // List customers with pagination (Protected)
  list: protectedProcedure
    .input(z.object({
      // Add pagination/filtering inputs if needed (e.g., cursor, limit, searchTerm)
      limit: z.number().min(1).max(50).optional().default(10),
      cursor: z.string().uuid().optional(), // Example: UUID cursor
    }))
    .query(async ({ ctx, input }) => {
      let query = ctx.supabase
        .from(\'customer\')
        .select(\'id, name, email\', { count: \'exact\' }) // Select needed fields + count
        .eq(\'company_id\', ctx.userProfile.company_id)
        .limit(input.limit);

      // Example cursor implementation (adjust based on your chosen field)
      if (input.cursor) {
         // query = query.gt('id', input.cursor); // Or lt depending on sort order
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching customers:", error);
        throw new TRPCError({ code: \'INTERNAL_SERVER_ERROR\', message: \'Failed to fetch customers.\' });
      }

      // Add logic to determine next cursor based on the data returned
      let nextCursor: typeof input.cursor | undefined = undefined;
      // ...

      return {
        items: data,
        totalCount: count ?? 0,
        nextCursor,
      };
    }),

  // Create a new customer (Protected)
  create: protectedProcedure
    .input(customerInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from(\'customer\')
        .insert({
          ...input,
          company_id: ctx.userProfile.company_id, // Associate with user's company
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating customer:", error);
        // Check for specific errors, e.g., duplicate email
        if (error.code === \'23505\') { // Unique constraint violation
           throw new TRPCError({ code: \'CONFLICT\', message: \'Customer email already exists.\' });
        }
        throw new TRPCError({ code: \'INTERNAL_SERVER_ERROR\', message: \'Failed to create customer.\' });
      }
      return data;
    }),

  // Update a customer (Protected)
  update: protectedProcedure
    .input(customerInputSchema.extend({ id: z.string().uuid() })) // Add ID for update
    .mutation(async ({ ctx, input }) => {
       const { id, ...updateData } = input;
       const { data, error } = await ctx.supabase
         .from(\'customer\')
         .update(updateData)
         .eq(\'id\', id)
         .eq(\'company_id\', ctx.userProfile.company_id) // Ensure user can only update their company's customer
         .select()
         .single();

       if (error) {
         console.error("Error updating customer:", error);
         throw new TRPCError({ code: \'INTERNAL_SERVER_ERROR\', message: \'Failed to update customer.\' });
       }
       if (!data) {
         throw new TRPCError({ code: \'NOT_FOUND\', message: \'Customer not found or access denied.\' });
       }
       return data;
    }),
});
```

### 1.3 Conventions

- **Routers:** Group procedures by domain/resource (e.g., `customer.ts`, `order.ts`).
- **Procedures:** Use `query` for read operations, `mutation` for write operations. Use `protectedProcedure` for endpoints requiring authentication.
- **Inputs:** Define explicit Zod schemas for all inputs.
- **Context:** Access shared resources like the Supabase client (`ctx.supabase`) and user session/profile (`ctx.session`, `ctx.userProfile`).
- **Error Handling:** Throw `TRPCError` for expected errors (e.g., `NOT_FOUND`, `UNAUTHORIZED`, `BAD_REQUEST`). Log unexpected errors.
- **Multi-Tenancy:** **Always** filter database queries by the `company_id` from the authenticated user's profile (`ctx.userProfile.company_id`).

---

## 2. External Integrations & Webhooks

Specifications for integrating with external systems.

### 2.1 Webhook System

*(Refer to `Phase3_Integration_ETL.md` for detailed Webhook System Specification, including Registration API, Storage Schema, Dispatcher Flow, and Security)*

### 2.2 Third-Party APIs (Examples)

- **Printavo API:** Primarily used by the ETL service for data synchronization. Likely GraphQL-based. (Specific endpoint details would reside in ETL documentation or connector code).
- **Stripe API:** Used for payment processing during checkout. Requires secure handling of API keys (server-side or Edge Functions).
- **Shipping APIs (Shippo, EasyPost):** Used for fetching rates and generating labels. Requires API key management.
- **AI APIs (OpenAI/GPT):** Used for features like quoting assistance. Requires API key management and careful prompt engineering.

**Convention:** Interactions with third-party APIs should generally happen server-side (within tRPC mutations or Supabase Edge Functions) to protect API keys and manage complex logic.

---

*Document updated to reflect tRPC as the primary internal API, removing GraphQL examples and adding tRPC setup/usage details.*
