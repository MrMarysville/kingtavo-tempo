# Storefront & Inventory (Phases 5-6)

## Table of Contents
- [Executive Summary](#executive-summary)
- [Phase 5: E-Commerce & Customizer](#phase-5-e-commerce--customizer)
  - [Purpose](#purpose)
  - [Storefront Infrastructure](#storefront-infrastructure)
  - [Product Catalog](#product-catalog)
  - [Cart & Checkout](#cart--checkout)
  - [Canvas Customizer](#canvas-customizer)
  - [Proof Generation & Approval](#proof-generation--approval)
  - [Customer Portal](#customer-portal)
- [Phase 6: Warehouse & Inventory Management](#phase-6-warehouse--inventory-management)
  - [Purpose](#purpose-1)
  - [Inventory Tracking Core](#inventory-tracking-core)
  - [Purchase Orders](#purchase-orders)
  - [Receiving & Put-away](#receiving--put-away)
  - [Stock Transfers & Adjustments](#stock-transfers--adjustments)
- [Cross References](#cross-references)
- [Attribution](#attribution)

## Executive Summary

This document consolidates E-Commerce & Customizer (Phase 5) and Warehouse & Inventory Management (Phase 6) documentation, highlighting integrations between the customer-facing storefront and backend inventory systems.

## Phase 5: E-Commerce & Customizer

### Purpose

Build a customer-facing storefront with a powerful product customizer, enabling browsing, design, and ordering workflows.

### Storefront Infrastructure

- Multi-store support via Next.js route groups and Supabase RLS  
- Dynamic theming, hostname-based tenant lookup, and isolated data contexts  
- Responsive layouts using Flowbite's grid system and breakpoints

### Product Catalog

- Public product listing, filtering, pagination via tRPC  
- Detailed product pages with variant selectors using Flowbite's Card, Tabs, and Dropdown components  
- Product grid display with Flowbite's responsive Card grid

### Cart & Checkout

- Client-side cart with persistence, localStorage, and order/quote submission  
- Stripe integration for direct orders and tRPC-based quote requests  
- Cart drawer using Flowbite's Drawer component with item list and checkout button
- Multi-step checkout process using Flowbite's Stepper component

### Canvas Customizer

- Interactive Fabric.js canvas wrapper for apparel design  
- Text, image, shape tools, templates, zoom/pan, and design area constraints  
- Tools panel using Flowbite's Sidebar, Button Groups, and ColorPicker components

### Proof Generation & Approval

- High-resolution image/PDF export via Fabric.js and pdfmake/Puppeteer  
- Design approval workflow integrated with tenant dashboard  
- Proof preview using Flowbite's Modal and Alert components for status notifications

### Customer Portal

- Storefront authentication, profile management, order history, and saved designs  
- Account dashboard using Flowbite's Tab and Card layout
- Order history table using Flowbite's DataTable component with status badges

## Phase 6: Warehouse & Inventory Management

### Purpose

Implement robust inventory tracking, purchase order management, and warehouse workflows.

### Inventory Tracking Core

- Database schema for locations, bins, levels, and movement ledger  
- Inventory viewing UI with variant-level summaries and detail modals using Flowbite Pro's DataTable and Modal components  
- Atomic adjustment logic with tRPC helper functions and audit trail  
- Inventory status indicators using Flowbite's Badge and Progress components

### Purchase Orders

- Suppliers, orders, and line items schema with snapshot fields  
- PO management UI for list, detail, creation, submission, and cancellation using Flowbite's Form, DataTable, and Card components  
- Low stock reports and reorder suggestions with bulk PO creation using Flowbite's Alert and Button components

### Receiving & Put-away

- Receiving interface for recording deliveries, quantity validation, and inventory updates using Flowbite's Form and Stepper components  
- Optional bin management and put-away workflows with Flowbite's Select and Modal components

### Stock Transfers & Adjustments

- Manual adjustment UI, transfer workflows, and cycle counts using Flowbite's Form and Card components  
- Inventory movement history with Flowbite's Timeline component
- Adjustments approval flows with Flowbite's Dialog confirmations

## Cross References

- [Phase3_Foundation.md](./Phase3_Foundation.md)  
- [Phase3_Core_Workflows.md](./Phase3_Core_Workflows.md)  
- [Phase3_Fulfillment.md](./Phase3_Fulfillment.md)  

## Attribution

- Source: [docs/initial_docs/Phase_5.md](docs/initial_docs/Phase_5.md)