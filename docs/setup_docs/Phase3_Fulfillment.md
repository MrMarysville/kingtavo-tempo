# Fulfillment & Shipping (Phase 7)

## Table of Contents
- [Executive Summary](#executive-summary)
- [Picking & Packing Workflow](#picking--packing-workflow)
- [Label Generation & Carrier Integration](#label-generation--carrier-integration)
- [Tracking & Customer Notifications](#tracking--customer-notifications)
- [Returns & Exchanges](#returns--exchanges)

## Executive Summary

This document consolidates Order Fulfillment & Shipping documentation, covering picking/packing, label generation, shipping integrations, tracking, returns, bulk processing, and external WMS integration.

## Picking & Packing

- **Status Transition:** Production Complete → Ready to Ship
- **API Routes:** `orders/[id]/fulfillment/start`, `orders/[id]/fulfillment/complete`
- **UI Components:**
  - Order Selection Queue using Flowbite Pro's DataTable with priority indicators
  - Picking List using Flowbite's List component with checkable items
  - Task Timer using Flowbite's Progress component

## Label Generation & Carrier Integration

- **Core Carriers:**
  - USPS, UPS, FedEx via Shippo and EasyPost APIs
  - Custom carrier option with manual tracking entry
- **UI Components:**
  - Carrier & Service Selector using Flowbite's RadioGroup component
  - Weight & Dimensions Input using Flowbite's InputGroup component
  - Label Preview using Flowbite's Modal with embedded PDF
- **API Routes:** `shipping/label/create`, `shipping/validate-address`
- **Label Storage:** Supabase Storage (PDF, ZPL format)
- **Printer Integration:** Direct browser-to-printer via @thebluetitan/react-to-print
- **Webhook Handling:** via Supabase Edge Functions to receive carrier updates

## Tracking & Status Updates

- **Status Tracking Flow:**
  - Automatic tracking number assignment to order
  - Periodic carrier API polling for shipment status
  - Webhook processing for real-time updates
- **UI:** Shipment history tab on OrderDetailPage using Flowbite's Timeline component
- **API Routes:** `orders/[id]/shipments`, `orders/[id]/tracking`
- **Customer Communications:** Triggered emails on status changes using Resend
- **Status Displays:** Using Flowbite's Badge component with status-based colors

## Returns & RMA Processing

- **Status Transition:** Delivered → Return Requested → Return Received
- **API Routes:** `orders/[id]/return/request`, `orders/[id]/return/receive`
- **UI Components:** 
  - Return Request Form using Flowbite's Form components
  - Return Label Generation using Flowbite's Modal and Button components
  - Return Item Inspection using Flowbite's Checkbox and Dropdown components

## Bulk Shipping & Batch Processing

- **Features:**
  - Multi-order selection
  - Batch label printing
  - Bulk status updates
- **API Routes:** `shipping/bulk/labels`, `shipping/bulk/update`
- **UI Components:** 
  - Batch selection interface using Flowbite's DataTable with checkboxes
  - Bulk actions menu using Flowbite's Dropdown component
  - Progress indicators using Flowbite's Progress component

## External WMS Integration

- **Integration Options:**
  - Basic CSV order export/import
  - REST API endpoints with authentication
  - Polling & webhook architecture
- **UI Components:** 
  - Integration configuration screen using Flowbite's Card and Form components
  - Manual sync controls using Flowbite's Button Group
  - Sync history logs using Flowbite's Table component

## Cross References
- [Phase1_Database.md](./Phase1_Database.md)
- [Phase3_Core_Workflows.md](./Phase3_Core_Workflows.md)
- [Phase3_Storefront_Inventory.md](./Phase3_Storefront_Inventory.md)