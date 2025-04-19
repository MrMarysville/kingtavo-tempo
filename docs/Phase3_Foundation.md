# Foundation (Phase 1)

## Table of Contents
- [Executive Summary](#executive-summary)
- [System Architecture](#system-architecture)
- [Data Models](#data-models)
- [Core Functionality](#core-functionality)
- [Cross References](#cross-references)
- [Attribution](#attribution)

## Executive Summary

This document consolidates the core technical foundation of the Kingtavo platform, covering system architecture, data models, and core functionality. It draws on initial documentation to establish the base for all subsequent phases.

## System Architecture

- **Framework:** Next.js 15.3.1+ with App Router  
- **Language:** TypeScript 5.8.3+  
- **Styling:** Tailwind CSS 4.1.4+ with Flowbite 3.1.2+ and Flowbite-React 0.11.7+ components  
- **State Management:** React 19.1.0+ Server Components + @tanstack/react-query 5.74.4+
- **Linting:** ESLint  
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)  
- **ETL Service:** Node.js 23.11.0+ microservice
- **UI Components:** Flowbite Pro component library
- **Architectural diagram:** See architecture documentation in [Phase1_Architecture.md](./Phase1_Architecture.md)

## Data Models

- Customer  
- Quote  
- Order  
- ProductionJob  
- InventoryItem  
- AnalyticsRecord  
- **Relationships:** Refer to ERD in [Phase1_Database.md](./Phase1_Database.md)

## Core Functionality

- Project setup and configuration with Flowbite Pro integration  
- Authentication and authorization using Supabase Auth with Flowbite's auth components  
- API layer (tRPC)  
- Database migrations and schema management  
- CI/CD baseline
- Responsive layouts using Flowbite's grid system

## Cross References

- See [Phase3_Core_Workflows.md](./Phase3_Core_Workflows.md) for workflow documentation  
- See [Phase3_Analytics_AI.md](./Phase3_Analytics_AI.md) for analytics integration

## Attribution

- Source: [docs/initial_docs/Phase_1.md](docs/initial_docs/Phase_1.md)  
- Source: [Phase1_Architecture.md](./Phase1_Architecture.md)