# Analytics & AI (Phases 4 & 8)

## Table of Contents
- [Executive Summary](#executive-summary)
- [Phase 4: AI-First Features & Integrations](#phase-4-ai-first-features--integrations)
  - [Purpose](#purpose)
  - [AI Chatbot Core](#ai-chatbot-core)
  - [Advanced AI Features](#advanced-ai-features)
  - [Supplier & External Integrations](#supplier--external-integrations)
  - [Additional Integrations](#additional-integrations)
  - [Digitizing Integration](#digitizing-integration)
- [Phase 8: Analytics & Reporting](#phase-8-analytics--reporting)
  - [Purpose](#purpose-1)
  - [Data Warehouse & ETL](#data-warehouse--etl)
  - [Operational Dashboards](#operational-dashboards)
  - [Financial & Profitability Reports](#financial--profitability-reports)

## Executive Summary

This document consolidates AI-First Features & Integrations (Phase 4) and Analytics & Reporting (Phase 8), highlighting how AI-driven capabilities and data insights synergize to optimize workflows and business decisions.

## Phase 4: AI-First Features & Integrations

### Purpose

Infuse the platform with AI capabilities to enhance user workflows and integrate external systems.

### AI Chatbot Core

- Chat interface components: ChatWidget, ChatWindow, ChatMessageList, ChatInput using Flowbite's Card and form components  
- Intent recognition and context management via OpenAI function calling and Zod validation  
- Core intents mapped to tRPC procedures (createQuote, getOrderStatus, getCustomer, createCustomer)  
- Chat UI powered by Flowbite's avatar, message bubbles, and input components

### Advanced AI Features

- Logo cleanup tools (background removal, vectorization, color adjustment) with Flowbite Pro's image editing widgets  
- OCR and document processing for quote extraction and business card scanning using Flowbite's FileUpload and preview cards  
- Reorder intelligence using embeddings for similarity search with Flowbite's product recommendation UI patterns  

### Supplier & External Integrations

- SanMar SOAP API for product sync, inventory, and PO submission  
- SS Activewear REST API for live catalog and pricing  
- Printavo GraphQL import for customer and invoice data  
- Integration status dashboards with Flowbite's Alert and Badge components

### Additional Integrations

- Shipping & fulfillment APIs (Shippo, EasyPost, etc.)  
- Payment processing (Stripe Elements, webhooks)  
- Tax calculation (TaxJar, Avalara)  
- Integration settings UI built with Flowbite's Form and Card components

### Digitizing Integration

- Gunold API for embroidery digitizing quotes and file retrieval  
- Integration UI with Flowbite's file upload and preview components

## Phase 8: Analytics & Reporting

### Purpose

Surface key business metrics across quoting, production, inventory, orders, and financial performance.

### Data Warehouse & ETL

- Reporting schema and nightly snapshot ETL via Supabase Edge Functions  
- tRPC procedures (analytics.syncSnapshots)  
- ETL monitoring dashboard using Flowbite Pro's statistics and status cards

### Operational Dashboards

- tRPC queries: getQuoteMetrics, getProductionMetrics, getInventoryMetrics, getOrderMetrics  
- UI: widgets (Chart.js, Recharts) integrated with Flowbite's Card components and layout system
- Date-range pickers using Flowbite's DatePicker component
- Stats display using Flowbite Pro's StatisticWidget components

### Financial & Profitability Reports

- ETL for revenue, COGS, and margin calculations  
- tRPC query getP&L and interactive trend charts
- Report views using Flowbite Pro's advanced DataTable and Chart components
- Export functionality with Flowbite's Button and Dropdown menus