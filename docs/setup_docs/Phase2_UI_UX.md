# Kingtavo UI Framework & Design System

_This document outlines the UI framework, component library, and design patterns for the Kingtavo platform, incorporating Flowbite Pro components and design system._

---

## 1. UI Framework Selection

**Primary Framework:** Flowbite Pro with Tailwind CSS

**Rationale:**
- Comprehensive set of pre-built, production-ready UI components
- Deep integration with Tailwind CSS for customization flexibility
- Pre-built admin dashboard templates and layout patterns
- Robust component system with interactive elements (modals, dropdowns, etc.)
- Well-documented with strong community support
- Dark mode support built-in
- Framework-agnostic with specific integrations for Next.js, React, Vue, etc.

### 1.1 Flowbite Pro Licensing

Kingtavo will use the Flowbite Pro Team License ($199/year), which includes:
- Full access to all premium components
- Admin dashboard templates (including advanced components)
- React/TypeScript versions of all components
- Figma design system with variants and components
- Advanced sections and templates

---

## 2. Key UI Components & Patterns

### 2.1 Orders Dashboard Wireframe

**Location:** `src/app/dashboard/orders/page.tsx`

```ascii
+---------------------------------------------------------+
| KINGTAVO Logo    Orders    Search [   ]    Profile ⌵   |
+---------------------------------------------------------+
| [Filter: Status ▼]  [Date Range ▼]  [Export CSV]  [+ New]|
+---------------------------------------------------------+
| Order ID  | Customer Name | Status       | Date       |   |
|-----------|---------------|--------------|------------|---|
| #A123     | Acme Corp     | Approved     | 04/15/2025 | > |
| #A122     | Beta Inc      | In Progress  | 04/14/2025 | > |
| ...                                                       |
+---------------------------------------------------------+
| [<] Previous   Page 2   Next [>]                         |
+---------------------------------------------------------+
```

**Implementation Notes:**
- Use Flowbite Pro's DataTable component with sorting, filtering, and pagination
- Implement Flowbite Pro's Dropdown for filters and actions
- Use Flowbite's Badge component for status indicators with appropriate colors

### 2.2 Quote Creation Flow

**Flow Overview:** Step-by-step UI screens to create and submit a quote.

1. **Select Customer**
   - Use Flowbite Pro's ComboBox component for searchable dropdown
   - Implement quick-add customer option
2. **Add Items**
   - Grid layout using Flowbite's Card components
   - Add to Quote buttons using Flowbite's Button component with hover states
3. **Configure Items**
   - Form inputs using Flowbite's form components
   - Quantity stepper using Flowbite's Number Input
   - Logo placement selector using Flowbite's Radio Cards
4. **Review & Submit**
   - Pricing summary using Flowbite's Card and Table
   - AI-generated suggestions panel using Flowbite's Alert component
   - "Create Quote" button using Flowbite's Button (primary variant)

### 2.3 Production Task Board

**Visual Concept:** Kanban board for production tasks.

```ascii
+----------------------------------------------------------+
| Tasks Board             Filter: Today   [+ New Task]     |
+-------------------+------------------+-------------------+
| **To Do**         | **In Progress**  | **Done**          |
|-------------------|------------------|-------------------|
| Order #A123       | Order #A120      | Order #A115       |
| - Screen Print    | - Embroidery     | - Completed       |
| - Due: 04/18/2025 | - Due: 04/17/2025| - Done: 04/14/2025|
+----------------------------------------------------------+
```

**Implementation Notes:**
- Implement using Flowbite's Kanban Board component from the Pro Admin Dashboard template
- Task cards using Flowbite's Card component with custom styling
- Use Flowbite's Badge component for order status indicators
- Implement drag-and-drop functionality using the built-in Kanban Board functionality

### 2.4 Mobile Order Detail View

**Location:** Mobile responsive screen for order details.

```ascii
+------------------------------+
| ‹ Back     Order #A123       |
+------------------------------+
| Customer: Acme Corp          |
| Status:    Production        |
| Ordered:   04/15/2025        |
+------------------------------+
| **Items:**                   |
| - T-Shirt (Blue, M) × 50     |
| - Hoodie (Black, L) × 20     |
+------------------------------+
| [View Artwork] [Send Message]|
+------------------------------+
| [Mark as Complete]           |
+------------------------------+
```

**Implementation Notes:**
- Use Flowbite's responsive breakpoints and mobile-first approach
- Implement Flowbite's List Group component for items
- Use Flowbite's Button Group for action buttons
- Fixed-bottom action button using Flowbite's sticky footer pattern

---

## 3. Responsive Design Strategy

### 3.1 Breakpoints
Following Tailwind CSS defaults with Flowbite responsive components:
- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### 3.2 Component Adaptations
- Tables collapse to cards on mobile using Flowbite's responsive table pattern
- Sidebar collapses to dropdown menu on mobile
- Form layouts stack vertically on mobile

---

## 4. Theme & Branding

### 4.1 Color Palette
- **Primary:** `#0f5cad` (brand blue)
- **Secondary:** `#6366f1` (indigo)
- **Accent:** `#10b981` (green for success states)
- **Warning:** `#f59e0b` (amber)
- **Danger:** `#ef4444` (red)
- **Surface:** `#ffffff` / `#f3f4f6` (light mode)
- **Surface Dark:** `#1f2937` / `#111827` (dark mode)

### 4.2 Typography
- **Primary Font:** Inter (sans-serif)
- **Headings:** Inter Semi-Bold
- **Body:** Inter Regular
- Implemented via Tailwind CSS's font family settings

### 4.3 Shadows & Elevation
Using Flowbite's predefined shadow system with custom configuration:
- **Low:** `shadow-sm` (subtle element separation)
- **Medium:** `shadow` (cards, dropdowns)
- **High:** `shadow-lg` (modals, popovers)

---

## 5. Design-to-Development Workflow

### 5.1 Figma Integration
- Utilize Flowbite Pro's Figma Design System
- Custom components will extend the Flowbite Figma library
- Developers can inspect and extract Tailwind CSS directly from Figma designs

### 5.2 Component Usage

All common UI elements will be implemented using Flowbite components:

- **Data Display:** Tables, Cards, Stats, Charts (from Flowbite Pro dashboard)
- **Navigation:** Sidebar, Navbar, Breadcrumbs, Tabs, Pagination
- **Inputs:** Form elements, Selectors, Date pickers, Uploads
- **Feedback:** Alerts, Toasts, Modals, Popovers
- **Layout:** Container, Grid, Stack from Flowbite layout system

### 5.3 Custom Components

Any custom components not available in Flowbite will be built using consistent patterns:
- Extend existing Flowbite component styles where possible
- Follow Flowbite's HTML structure and class naming conventions
- Document in a dedicated "Custom Components" section

---

## 6. Accessibility Standards

- All components will maintain WCAG 2.1 AA compliance
- Leverage Flowbite's built-in accessibility features:
  - Keyboard navigation
  - ARIA attributes
  - Focus management
  - Screen reader support
- Implement additional testing with screen readers and keyboard-only navigation

---

## 7. Implementation Resources

- **Flowbite Documentation:** [https://flowbite.com/docs/](https://flowbite.com/docs/)
- **Flowbite Pro Dashboard:** [https://flowbite-admin-dashboard.vercel.app/](https://flowbite-admin-dashboard.vercel.app/)
- **Tailwind CSS Documentation:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Next.js Integration:** [https://flowbite.com/docs/getting-started/next-js/](https://flowbite.com/docs/getting-started/next-js/)

---

*This document serves as the central reference for UI implementation, ensuring consistency across the Kingtavo platform while leveraging the efficiency of the Flowbite Pro component system.*