# DevOps & Operations

_This document outlines the deployment processes, environment configurations, and operational best practices for the Kingtavo platform._

---

## Environment Overview

- **Development:**  
  - Feature branches in GitHub  
  - Local Supabase emulator for integration testing
  - Admin dashboards using Flowbite Pro templates
  - **Secrets:** Managed via `.env.local` (not committed)

- **Staging:**  
  - Mirrors production environment  
  - Used for final smoke and end-to-end validation
  - **Secrets:** Managed via Vercel Environment Variables (Preview) & Supabase Vault

- **Production:**  
  - Customer-facing cluster with high availability  
  - Blue-green deployment strategy
  - **Secrets:** Managed via Vercel Environment Variables (Production) & Supabase Vault

---

## Infrastructure & Configuration

- **Infrastructure as Code (IaC):**  
  - Terraform modules for Kubernetes clusters, VPCs, managed databases (if applicable beyond Supabase/Vercel)

- **CI/CD Pipelines** (GitHub Actions):  
  - `ci.yml` – Lint, unit tests, and builds on pull requests  
  - `deploy-staging.yml` – Automatic deployment to Vercel (Preview) on `main` merge, runs Supabase migrations against staging DB.
  - `deploy-production.yml` – Manual approval gate, blue-green rollout to Vercel (Production), runs Supabase migrations against production DB.

- **Secrets Management:**
  - **Strategy:** Minimize exposure; use dedicated secrets management tools.
  - **Local Development (`.env.local`):**
    - Store local Supabase keys, third-party test API keys.
    - **Crucially, add `.env*.local` to `.gitignore`.**
    - Maintain a `.env.example` file (committed) listing required variables with placeholder values.
  - **Vercel Environment Variables:**
    - Store frontend-accessible Supabase keys (`NEXT_PUBLIC_...`).
    - Store server-side API keys needed by Next.js API routes or Server Components.
    - Differentiate between Preview (Staging) and Production environments.
  - **Supabase Vault / Edge Function Secrets:**
    - Store secrets needed exclusively by Supabase Edge Functions or backend database functions (e.g., third-party API keys for ETL/webhooks, database credentials if needed).
    - Access via Supabase client libraries or environment variables within Edge Functions.
  - **ETL Service (if separate):**
    - If running as a separate service (e.g., Node.js on Fly.io, Render), use the hosting provider's secret management.
  - **Access Control:** Limit access to production secrets on Vercel/Supabase to authorized personnel.
  - **Rotation:** Implement a policy for rotating sensitive keys regularly. Admin interface for key rotation using Flowbite's Form and Alert components can assist.

---

## Deployment Procedure

1. **Prepare Release**  
   - Merge feature branch into `main`  
   - Tag the release (e.g., `v1.2.3`)

2. **Continuous Integration**  
   - GitHub Actions runs `ci.yml`  
   - Execute linting, unit, and integration tests  
   - Build Docker images (if applicable, e.g., for separate ETL service) and push to container registry

3. **Deploy to Staging**  
   - Trigger `deploy-staging.yml` automatically on merge to `main`.
   - Deploys frontend to Vercel Preview environment.
   - Runs Supabase migrations against the staging database (`supabase migration up --linked`).
   - Run smoke tests and E2E tests (Playwright) against the Vercel Preview URL.

4. **Approve & Deploy to Production**  
   - Manually approve the `deploy-production.yml` job in GitHub Actions (triggered by tag push or manually).
   - Promotes the tested Vercel Preview deployment to Production.
   - Runs Supabase migrations against the production database (`supabase migration up --linked` - ensure correct project linking).
   - Consider database backup before running production migrations.

5. **Post-Deployment Verification**  
   - Confirm key endpoints respond successfully on production URL.
   - Validate database migrations applied correctly in production DB.
   - Check logs (Vercel, Supabase Functions, Sentry) for errors or warnings.
   - Review deployment status in admin dashboard built with Flowbite Pro components.

---

## Database Migrations & Backups

- **Schema Migrations:**  
  - Use Supabase CLI (`supabase db push` locally, `supabase migration up --linked` in CI/CD).
  - Versioned SQL files stored under `/supabase/migrations/`.
  - Migration history interface using Flowbite's Timeline component.

- **Backups:**  
  - Automated daily snapshots of PostgreSQL via Supabase backups.
  - Configure Point-in-Time Recovery (PITR) for production.
  - Retention policy: Adjust based on business needs (e.g., 7 daily, 4 weekly, 6 monthly).
  - Backup status dashboard with Flowbite's Card and Badge components.

- **Restore Drill:**  
  - Monthly practice restore on staging environment.
  - Validate data integrity and application connectivity.
  - Restoration interface using Flowbite's Modal and Progress components.

---

## Monitoring & Alerting

- **Metrics Collection:**  
  - Vercel Analytics for frontend performance.
  - Supabase built-in monitoring for database performance.
  - Custom metrics via Prometheus/Grafana if needed for separate services.

- **Dashboards:**  
  - Admin dashboards built with Flowbite Pro's dashboard templates.
  - Real-time metrics display using Flowbite's Chart components.
  - System health indicators using Flowbite's Badge and Progress components.

- **Logging:**
  - Vercel Functions logs.
  - Supabase Edge Function logs.
  - Supabase Database query logs (enable if needed for debugging).
  - **Error Tracking:** Sentry for frontend and backend error aggregation.

- **Alerting** (PagerDuty Integration or similar):
  - Sentry alerts for critical errors.
  - Supabase database alerts (e.g., high CPU, low disk space).
  - ETL failure alerts (custom monitoring if separate service, or via Supabase Function logs).
  - HTTP 5xx rate > 5% over 5 minutes (via Vercel monitoring or Sentry).
  - Backup failures or missed snapshots.
  - Alert history and acknowledgment interface using Flowbite's DataTable and Modal components.

---

## Incident Response

1. **Detection**  
   - Automated alerts notify Slack and PagerDuty channels.
   - Admin notification UI using Flowbite's Toast and Alert components.

2. **Triage**  
   - On-call engineer reviews the runbook and incident severity.
   - Notify broader team if escalation is required.
   - Incident management dashboard using Flowbite Pro templates.

3. **Mitigation**  
   - Roll back Vercel deployment to the previous stable version.
   - Investigate Supabase issues (check status, logs, scale resources if needed).
   - Action buttons using Flowbite's Button and ButtonGroup components.

4. **Resolution & Recovery**  
   - Confirm system health and restore normal traffic routing.
   - Re-run failed jobs or migrations if necessary (with caution).
   - Recovery checklist interface using Flowbite's Checkbox components.

5. **Post-Incident Review**  
   - Document root cause analysis (RCA)  
   - Define preventive measures and update the runbook.
   - Share findings with stakeholders.
   - Post-mortem documentation using Flowbite's Card and Timeline components.

---

## Cross References

- See [Phase3_Integration_ETL.md](./Phase3_Integration_ETL.md) for ETL monitoring details.
- See [Phase3_Administration_Maintenance.md](./Phase3_Administration_Maintenance.md) for admin interface documentation.
- See [Phase1_Database.md](./Phase1_Database.md) for database schema information.

*Document polished for clarity, consistency, and proper grammar.*