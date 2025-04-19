# Architecture

_This document outlines the high-level architecture of the Kingtavo platform, including the technology stack, component interactions, and implementation phases._

---

## 1. Technology Stack

### 1.1 Core Technologies

*   **Frontend:** Next.js 15.3.1+ with React 19.1.0+ and TypeScript 5.8.3+
*   **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
*   **ETL Service:** Node.js 23.11.0+ microservice (or Supabase Edge Functions)
*   **Styling:** Tailwind CSS 4.1.4+ with Flowbite 3.1.2+ and Flowbite-React 0.11.7+
*   **State Management:** Server Components + @tanstack/react-query 5.74.4+
*   **API Layer:** tRPC for type-safe API endpoints
*   **Deployment:** Vercel (Frontend), Supabase Cloud (Backend)

### 1.2 AI Integration

*   **AI Integration:** GPT-4o (or similar) for quoting, scheduling, potentially image analysis

### 1.3 Major Components

*   **Database (Supabase PostgreSQL):**
    *   Core tables: `company`, `users`, `roles`, `store`, `products`, `product_variants`, `inventory`, `orders`, `line_items`, `tasks`, `customer`, `logo`, `decoration_technique`, etc. (See `Database.md` for full schema details)
    *   Row-Level Security (RLS) enforced for multi-tenancy and role-based access.
*   **Authentication & Authorization (Supabase Auth):**
    *   Email/Password, potentially SSO (Google, etc.).
    *   Role-based access control (RBAC) implemented via database roles/claims and RLS policies (e.g., admin, production, sales, store, customer).
*   **Data Synchronization (ETL Service / Edge Functions):**
    *   Service/functions to periodically or trigger-based import/sync data from external sources like Printavo and KingClothing (Strapi Store).
    *   Requires mapping tables or fields to link external IDs (e.g., `printavo_account_id` on `company`).
*   **API Layer (Supabase / Custom):**
    *   Leverage Supabase's auto-generated RESTful API (PostgREST) and GraphQL API (pg_graphql).
    *   Potentially custom API endpoints (Supabase Edge Functions or separate service) for complex business logic or orchestration.
*   **Realtime (Supabase Realtime):**
    *   Used for pushing updates to relevant clients (e.g., production dashboard updates when tasks change, order status updates).
*   **AI Services:**
    *   Integrations with external AI APIs (e.g., OpenAI) via backend services/functions for features like automated quoting, production scheduling optimization, or potentially analyzing uploaded artwork.

### 1.4 Phase-Based Implementation

This outlines a potential staged rollout:

1.  **Phase 1: Foundation & Sync Framework**
    *   Environment setup (Supabase, Next.js project).
    *   Core database schema design & migrations (`Database.md`).
    *   Supabase Authentication setup (email/pass, basic roles).
    *   Initial ETL pipeline/functions for syncing Companies/Tenants from Printavo.
2.  **Phase 2: Product & Order System**
    *   Product catalog management UI/API.
    *   Customer management UI/API.
    *   Basic quoting engine.
    *   Order creation and management (linking products, customers).
    *   Line item handling.
3.  **Phase 3: Production & Workflow**
    *   Task generation based on orders/line items.
    *   Task management UI (Production Dashboard).
    *   Real-time updates for task status changes.
    *   Mobile-friendly interface for shop floor interaction.
4.  **Phase 4: E-commerce Integration**
    *   Connection to external storefronts (e.g., Strapi Store).
    *   Syncing products/inventory to the storefront.
    *   Receiving orders from the storefront.
    *   Basic customer portal for order tracking.
5.  **Phase 5: Advanced Features & Optimization**
    *   AI-assisted quoting & scheduling features.
    *   Reporting & analytics dashboard.
    *   Third-party integrations (Shipping, Accounting).
6.  **Phase 6: Testing & Rollout**
    *   Comprehensive QA (Unit, Integration, E2E tests).
    *   Load testing.
    *   User documentation & training materials.
    *   Staged rollout and production launch.

### 1.5 Key Interactions

*   **Frontend (Next.js) <=> Supabase:** Primarily interacts via Supabase client libraries for data fetching/mutation (REST/GraphQL), authentication, and subscribing to realtime updates.
*   **ETL Service <=> External APIs (Printavo, Strapi) & Supabase:** Pulls data from external sources, transforms it, and pushes it to the Supabase database.
*   **Backend Services/Functions <=> AI Services (GPT-4o):** Sends relevant data (quote details, production schedule) to AI models and processes the responses.
*   **Backend Services/Functions <=> External Integrations (Shipping, Payments):** Interacts with third-party APIs.

---

## 2. Architecture Diagrams

_Visual guides illustrating the core components, integrations, and data flows._

### 2.1 System Component Diagram

This diagram outlines the major frontend, backend, ETL, and integration components, and how they interact.

```mermaid
flowchart LR
  subgraph "User Interfaces"
    A[Next.js Web App]
    P[Production Dashboard]
    M[Mobile Interface (Web)]
  end

  subgraph "Backend Services (Supabase & Custom)"
    S[Supabase Platform]
      S_Auth[Auth]
      S_DB[PostgreSQL DB w/ RLS]
      S_RT[Realtime]
      S_Store[Storage]
      S_Edge[Edge Functions]
      S_API[REST/GraphQL APIs]
    end
    G[AI Services (External)]
    ETL[ETL Service / Functions]
  end

  subgraph "External Systems"
    Ext_P[Printavo API]
    Ext_S[Strapi Store API]
    Ext_Pay[Payment Gateway]
    Ext_Ship[Shipping Carrier]
    Ext_Acct[Accounting System]
  end

  A --> S_API
  P --> S_API
  M --> S_API

  A --> S_Auth
  P --> S_Auth
  M --> S_Auth

  A --> S_RT
  P --> S_RT
  M --> S_RT

  S_Edge --> S_DB
  S_Edge --> G
  S_Edge --> Ext_Pay
  S_Edge --> Ext_Ship
  S_Edge --> Ext_Acct

  ETL --> Ext_P
  ETL --> Ext_S
  ETL --> S_DB

  S_DB -- Triggers/CDC --> S_RT

  style S fill:#ece,stroke:#333,stroke-width:2px
```

### 2.2 Data Flow Sequence: Order Lifecycle Example

This sequence diagram illustrates a simplified lifecycle of an order.

```mermaid
sequenceDiagram
  participant User as User (e.g., Sales)
  participant UI as Frontend UI (Next.js)
  participant API as Backend API (Supabase/Edge Fn)
  participant DB as Supabase DB (Postgres)
  participant RT as Supabase Realtime
  participant ProdDash as Production Dashboard

  User->>UI: Create Quote Request
  UI->>API: mutation createQuote(input)
  API->>DB: INSERT INTO quotes, line_items...
  DB-->>API: quoteId
  API-->>UI: return quoteId, details

  User->>UI: Approve Quote / Create Order
  UI->>API: mutation convertQuoteToOrder(quoteId) / createOrder(input)
  API->>DB: UPDATE quotes SET status='Approved'; INSERT INTO orders, tasks...
  DB-->>API: orderId, taskIds
  API-->>UI: return orderId
  API->>RT: publish(channel: 'orders', event: 'order_created', payload: {orderId})
  API->>RT: publish(channel: 'tasks', event: 'tasks_created', payload: {taskIds})


  RT-->>ProdDash: Receive 'tasks_created' event
  ProdDash->>ProdDash: Update task board view

  Note over ProdDash: Staff works on tasks

  ProdDash->>UI: Mark Task Complete
  UI->>API: mutation completeTask(taskId)
  API->>DB: UPDATE tasks SET status='completed', completed_at=now() WHERE id=taskId
  DB-->>API: Success/Failure
  API->>RT: publish(channel: 'tasks', event: 'task_updated', payload: {taskId, status: 'completed'})

  RT-->>ProdDash: Receive 'task_updated' event
  ProdDash->>ProdDash: Update task status display

  Note over UI,API,DB: Similar flows for other actions (updates, queries)
```

---

*This consolidated document combines the architectural plan and visual diagrams.* 