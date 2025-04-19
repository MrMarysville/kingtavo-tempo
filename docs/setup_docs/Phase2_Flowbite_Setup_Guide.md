# Flowbite Pro Setup & Integration Guide

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)
- [Component Usage](#component-usage)
- [Customization](#customization)
- [Migration From Other UI Libraries](#migration-from-other-ui-libraries)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Introduction

This guide provides detailed instructions for setting up, configuring, and using Flowbite Pro in the Kingtavo platform. Flowbite Pro is our chosen UI component library that extends Tailwind CSS with pre-built, accessible components that maintain consistent styling throughout the application.

## Installation

### 1. Installing Base Dependencies

First, ensure you have the core dependencies installed with their latest versions:

```bash
npm install flowbite@3.1.2 flowbite-react@0.11.7 tailwindcss@4.1.4
```

### 2. Acquiring Flowbite Pro License

Purchase the Flowbite Pro Team License ($199/year) from the [Flowbite website](https://flowbite.com/pro/). This license provides:

- Full access to all premium components
- Admin dashboard templates
- React/TypeScript versions of all components
- Figma design system with variants

### 3. Installing Flowbite Pro

After purchasing, you'll receive credentials to access the private npm package:

```bash
npm config set @flowbite-pro:registry https://flowbite.com/pro/npm/
npm config set //flowbite.com/pro/npm/:_authToken="YOUR_AUTH_TOKEN"
npm install @flowbite-pro/react
```

## Configuration

### 1. Tailwind CSS Configuration

Update your `tailwind.config.js` file to include Flowbite:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@flowbite-pro/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#f0f9ff",
          "100": "#e0f2fe",
          "200": "#bae6fd",
          "300": "#7dd3fc",
          "400": "#38bdf8",
          "500": "#0ea5e9",
          "600": "#0284c7",
          "700": "#0369a1",
          "800": "#075985",
          "900": "#0c4a6e",
          "950": "#082f49"
        }
      }
    }
  },
  plugins: [
    require('flowbite/plugin')
  ]
}
```

### 2. CSS Import

In your main CSS file (usually `globals.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Flowbite specific custom properties */
:root {
  --sidebar-width: 16rem;
}
```

### 3. Provider Setup

In your application's root component (likely `_app.tsx` or similar) with Next.js 15.3.1+ and React 19.1.0+:

```tsx
import { FlowbiteProvider } from 'flowbite-react';
import { flowbiteTheme } from '@/lib/flowbiteTheme';

function MyApp({ Component, pageProps }) {
  return (
    <FlowbiteProvider theme={flowbiteTheme}>
      <Component {...pageProps} />
    </FlowbiteProvider>
  );
}

export default MyApp;
```

## Component Usage

### Basic Component Import

Import components directly from the packages:

```tsx
// Standard components
import { Button, Card } from 'flowbite-react';

// Pro components
import { KanbanBoard, Calendar } from '@flowbite-pro/react';
```

### Common Components Examples

1. **DataTable (Pro)**

```tsx
import { DataTable } from '@flowbite-pro/react';

export function OrdersTable({ data }) {
  const columns = [
    { name: 'Order ID', selector: row => row.id },
    { name: 'Customer', selector: row => row.customer.name },
    { name: 'Status', selector: row => row.status },
    { name: 'Total', selector: row => `$${row.total.toFixed(2)}` },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      pagination
      paginationPerPage={10}
      paginationComponentOptions={{
        rowsPerPageText: 'Orders per page:',
        rangeSeparatorText: 'of',
      }}
    />
  );
}
```

2. **Form Components**

```tsx
import { Label, TextInput, Select, Checkbox, Button } from 'flowbite-react';

export function CustomerForm({ onSubmit, initialData = {} }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <TextInput id="name" defaultValue={initialData.name || ''} required />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <TextInput id="email" type="email" defaultValue={initialData.email || ''} required />
      </div>
      
      <div>
        <Label htmlFor="type">Customer Type</Label>
        <Select id="type" defaultValue={initialData.type || 'retail'}>
          <option value="retail">Retail</option>
          <option value="wholesale">Wholesale</option>
          <option value="distributor">Distributor</option>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox id="active" defaultChecked={initialData.active !== false} />
        <Label htmlFor="active">Active</Label>
      </div>
      
      <Button type="submit">Save Customer</Button>
    </form>
  );
}
```

3. **Dashboard Components (Pro)**

```tsx
import { DashboardLayout, Sidebar, StatisticsCard } from '@flowbite-pro/react';
import { HomeIcon, UsersIcon, ShoppingCartIcon } from 'your-preferred-icon-library';

export function AdminDashboard() {
  return (
    <DashboardLayout
      sidebar={
        <Sidebar>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/dashboard" icon={HomeIcon}>Dashboard</Sidebar.Item>
              <Sidebar.Item href="/dashboard/customers" icon={UsersIcon}>Customers</Sidebar.Item>
              <Sidebar.Item href="/dashboard/orders" icon={ShoppingCartIcon}>Orders</Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticsCard
          title="Orders"
          value="152"
          description="+12% from last month"
          trend="up"
        />
        <StatisticsCard
          title="Revenue"
          value="$12,426"
          description="+8.2% from last month"
          trend="up"
        />
        {/* More cards... */}
      </div>
    </DashboardLayout>
  );
}
```

## Customization

### 1. Theme Customization

Create a theme file (`lib/flowbiteTheme.ts`) to customize component styling:

```typescript
import type { CustomFlowbiteTheme } from 'flowbite-react';

export const flowbiteTheme: CustomFlowbiteTheme = {
  button: {
    color: {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white',
      // Add other button variants...
    },
    size: {
      md: 'py-2.5 px-5 text-sm',
      // Add other sizes...
    }
  },
  card: {
    root: {
      base: 'flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800',
    }
  },
  // Customize other components...
};
```

### 2. Custom CSS Extensions

For more complex customizations, extend the components with Tailwind CSS 4.1.4+ classes:

```tsx
// In your component
<Button className="custom-button-class relative overflow-hidden">
  Submit
</Button>

// In your CSS
.custom-button-class::after {
  content: '';
  @apply absolute inset-0 bg-white opacity-0 transition-opacity duration-300;
}
.custom-button-class:active::after {
  @apply opacity-20;
}
```

## Migration From Other UI Libraries

If you're migrating from other UI libraries to Flowbite, here's a quick reference:

| Component Type | Material UI | Chakra UI | Flowbite Equivalent |
|----------------|-------------|-----------|---------------------|
| Button         | `<Button>` | `<Button>` | `<Button>` |
| Text field     | `<TextField>` | `<Input>` | `<TextInput>` |
| Dropdown       | `<Select>` | `<Select>` | `<Select>` |
| Checkbox       | `<Checkbox>` | `<Checkbox>` | `<Checkbox>` |
| Modal          | `<Modal>` | `<Modal>` | `<Modal>` |
| Card           | `<Card>` | `<Box>` | `<Card>` |
| Table          | `<Table>` | `<Table>` | `<Table>` or `<DataTable>` (Pro) |

## Best Practices

1. **Component Organization**
   - Keep component imports organized by feature or page
   - Create wrapper components for commonly used Flowbite components with custom styling

2. **Performance Optimization**
   - Use dynamic imports for larger Pro components with Next.js 15.3.1+ and React 19.1.0+
   - Implement virtualization for large lists/tables

3. **Accessibility**
   - Leverage Flowbite's built-in accessibility features
   - Always include proper labels, descriptions, and ARIA attributes
   - Test with keyboard navigation and screen readers

4. **Dark Mode**
   - Utilize Flowbite's built-in dark mode support
   - Test both light and dark themes

## Troubleshooting

### Common Issues and Solutions

1. **Components Not Styled Correctly**
   - Ensure Flowbite is correctly added to the Tailwind CSS 4.1.4+ content array
   - Verify the FlowbiteProvider is wrapping your application

2. **Type Errors with TypeScript 5.8.3+**
   - Make sure you're importing from the correct package
   - Check types and props against the documentation

3. **Pro Components Not Available**
   - Verify your authentication token is configured correctly
   - Ensure you're importing from `@flowbite-pro/react`

4. **Custom Styling Not Applied**
   - Check that your theme customizations are properly configured
   - Use browser devtools to inspect the component hierarchy

For additional help, refer to the [Flowbite documentation](https://flowbite.com/docs/getting-started/introduction/) or the [Pro Components documentation](https://flowbite.com/pro/docs/components/introduction/). 