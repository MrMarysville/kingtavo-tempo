import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Create Supabase client for auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map(({ name, value }) => ({
            name,
            value,
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Auth session error:", error);
  }

  // Handle tenant-specific routing
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    // Admin routes require authentication
    if (!session) {
      // Redirect to sign-in page if not authenticated
      const redirectUrl = new URL("/sign-in", req.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check for company-specific resource access
    // Example: /admin/companies/[companyId] or /admin/customers/[customerId]
    // This is a basic pattern check - more detailed checks are in the layout components
    const companyResourcePattern =
      /\/(companies|customers|products|orders|invoices|tasks)\/([^/]+)$/;
    const match = pathname.match(companyResourcePattern);

    if (match && match[2] && !match[2].includes("new")) {
      // This is a company-specific resource - detailed access check will be in the page component
      // We can't do detailed DB checks here efficiently, so we'll let the page component handle it
      // Just adding the pattern detection for future expansion
    }

    // Role-based access control is handled in the layout component
    // This allows for more detailed checks with database queries
    // which aren't easily done in middleware
  }

  // Handle legacy dashboard routes - redirect to admin
  if (pathname.startsWith("/dashboard")) {
    const newPath = pathname.replace("/dashboard", "/admin");
    return NextResponse.redirect(new URL(newPath, req.url));
  }

  return res;
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
