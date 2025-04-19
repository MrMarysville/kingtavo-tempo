# Kingtavo UI Framework & Design System

_This document outlines the UI framework, component library, and design patterns for the Kingtavo platform, incorporating Shadcn/UI components and design system._

---

## 1. UI Framework Selection

**Primary Framework:** Shadcn/UI with Tailwind CSS

**Rationale:**
- High-quality, accessible, and customizable UI components
- Built on Radix UI primitives for robust accessibility
- Deep integration with Tailwind CSS for customization flexibility
- Component-first approach with copy-paste implementation
- Well-documented with strong community support
- Dark mode support built-in
- Designed specifically for Next.js and React applications
- No vendor lock-in - components are added to your project directly

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

- Use Shadcn/UI's DataTable component with sorting, filtering, and pagination
- Implement Shadcn/UI's Dropdown for filters and actions
- Use Shadcn/UI's Badge component for status indicators with appropriate colors

### 2.2 Quote Creation Flow

**Flow Overview:** Step-by-step UI screens to create and submit a quote.

1. **Select Customer**
   - Use Shadcn/UI's Combobox component for searchable dropdown
   - Implement quick-add customer option
2. **Add Items**
   - Grid layout using Shadcn/UI's Card components
   - Add to Quote buttons using Shadcn/UI's Button component with hover states
3. **Configure Items**
   - Form inputs using Shadcn/UI's form components
   - Quantity stepper using Shadcn/UI's Input with custom number controls
   - Logo placement selector using Shadcn/UI's RadioGroup
4. **Review & Submit**
   - Pricing summary using Shadcn/UI's Card and Table
   - AI-generated suggestions panel using Shadcn/UI's Alert component
   - "Create Quote" button using Shadcn/UI's Button (primary variant)

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

- Implement using a custom Kanban Board built with Shadcn/UI components
- Task cards using Shadcn/UI's Card component with custom styling
- Use Shadcn/UI's Badge component for order status indicators
- Implement drag-and-drop functionality using react-beautiful-dnd or dnd-kit

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

- Use Tailwind CSS responsive breakpoints and mobile-first approach
- Implement Shadcn/UI's List component for items
- Use Shadcn/UI's ButtonGroup for action buttons
- Fixed-bottom action button using Tailwind's sticky positioning

---

## 3. Responsive Design Strategy

### 3.1 Breakpoints

Following Tailwind CSS defaults with Shadcn/UI responsive components:

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

### 3.2 Component Adaptations

- Tables collapse to cards on mobile using Shadcn/UI's responsive table pattern
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

Using Tailwind CSS's predefined shadow system with Shadcn/UI configuration:

- **Low:** `shadow-sm` (subtle element separation)
- **Medium:** `shadow` (cards, dropdowns)
- **High:** `shadow-lg` (modals, popovers)

---

## 5. Design-to-Development Workflow

### 5.1 Figma Integration

- Utilize Shadcn/UI's design principles in Figma
- Custom components will extend the Shadcn/UI component patterns
- Developers can inspect and extract Tailwind CSS directly from Figma designs

### 5.2 Component Usage

All common UI elements will be implemented using Shadcn/UI components:

- **Data Display:** Tables, Cards, Stats, Charts
- **Navigation:** Sidebar, Navbar, Breadcrumbs, Tabs, Pagination
- **Inputs:** Form elements, Selectors, Date pickers, Uploads
- **Feedback:** Alerts, Toasts, Modals, Popovers
- **Layout:** Container, Grid, Flex layouts

### 5.3 Custom Components

Any custom components not available in Shadcn/UI will be built using consistent patterns:

- Extend existing Shadcn/UI component styles where possible
- Follow Shadcn/UI's component structure and naming conventions
- Document in a dedicated "Custom Components" section

---

## 6. Accessibility Standards

- All components will maintain WCAG 2.1 AA compliance
- Leverage Shadcn/UI's built-in accessibility features:
  - Keyboard navigation
  - ARIA attributes
  - Focus management
  - Screen reader support
- Implement additional testing with screen readers and keyboard-only navigation

---

## 7. Implementation Resources

- **Shadcn/UI Documentation:** [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs)
- **Radix UI Primitives:** [https://www.radix-ui.com/primitives](https://www.radix-ui.com/primitives)
- **Tailwind CSS Documentation:** [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)

---

_This document serves as the central reference for UI implementation, ensuring consistency across the Kingtavo platform while leveraging the efficiency of the Shadcn/UI component system._
