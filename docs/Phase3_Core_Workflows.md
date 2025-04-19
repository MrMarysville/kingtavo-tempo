# Core Workflows (Phases 2-3)

## Table of Contents
- [Executive Summary](#executive-summary)
- [Phase 2: Quote & Invoice Management System](#phase-2-quote--invoice-management-system)
  - [Purpose](#purpose)
  - [Key Components](#key-components)
- [Phase 3: Production Management System](#phase-3-production-management-system)
  - [Purpose](#purpose-1)
  - [Core Components](#core-components)

## Executive Summary

This document consolidates the documentation for Quote & Invoice Management (Phase 2) and Production Management (Phase 3), providing a cohesive view of business-critical workflows from quoting through production tracking.

## Phase 2: Quote & Invoice Management System

### Purpose

Implement a flexible quoting engine, invoice conversion, and customer management.

### Key Components

- Customer Management  
  - Create, read, update, delete customer records using Flowbite Pro's DataTable component  
  - Search, filter, pagination, duplicate detection with Flowbite's filtering controls  
- Quote Editor  
  - Grouped line items with drag-and-drop reordering using Flowbite's DragDrop  
  - Multi-step Add Item modal using Flowbite Pro's Modal and Stepper components  
  - Imprint management per line item group with Flowbite's expandable Card components  
  - Actions: Save draft, send for approval, duplicate, convert to invoice using Flowbite's Button Group  
- Multi-Imprint Editor  
  - Support multiple decoration methods (screen print, embroidery, DTG, etc.) with Flowbite's Tabs interface  
  - Artwork upload and preview, imprint location selection, color count using Flowbite's FileInput and RadioCard  
- Pricing Engine  
  - Base markup, imprint fees, quantity and order-level discounts  
  - Configurable pricing rules (priority, tiers) stored in database  
- Quote & Invoice List  
  - Listing, filtering, sorting of quotes and invoices using Flowbite Pro's DataTable  
  - PDF generation and email sharing via Resend integration with Flowbite's Button and Dropdown components  

## Phase 3: Production Management System

### Purpose

Manage production workflows, track job progress, and support shop floor operations.

### Core Components

- Workflow Builder  
  - Define custom workflow steps via drag-and-drop UI using Flowbite Pro's KanbanBoard component  
  - Assign default or manual workflows to production jobs with Flowbite's Select component  
- Production Kanban  
  - Visual board with draggable job cards across workflow steps using Flowbite Pro's KanbanBoard  
  - Optimistic UI updates on status changes with tRPC mutations and Flowbite's Badge component for status indicators  
- Production Calendar  
  - Calendar view of jobs based on due date using Flowbite Pro's Calendar component  
  - Drag-and-drop event rescheduling with date update mutations  
- Offline PWA Functionality  
  - Service Worker and IndexedDB for offline asset and data caching  
  - Mutation queueing and background sync on reconnect with Flowbite's Toast for offline status indicators  
- Production Analytics  
  - Dashboards for throughput, cycle time, WIP per step using Flowbite Pro's Chart components  
  - Staff performance and quality control reporting with Flowbite's Card and Table components