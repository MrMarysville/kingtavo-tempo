# Phase 1: Foundation

This document outlines the implementation steps for Phase 1 of the Kingtavo platform, focusing on establishing the core infrastructure, database schema, authentication, and multi-tenancy.

## 1.1 Core Schema & Database Setup

### 1.1.1 Multi-tenant Database Schema (✅ Completed)

Implement the core database schema with multi-tenancy support:

```sql
-- Create company table (tenant)
CREATE TABLE public.company (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create users table with company_id foreign key
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  company_id UUID REFERENCES public.company(id),
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Additional core tables (products, orders, etc.)
-- See database migration files for complete schema
```

### 1.1.2 Supabase Tables with RLS Policies (✅ Completed)

Set up Row Level Security (RLS) policies to enforce multi-tenant isolation:

```sql
-- Enable RLS on all tables
ALTER TABLE public.company ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- Enable RLS on all other tables

-- Create RLS policies for company table
CREATE POLICY "Users can view their own company" ON public.company
  FOR SELECT USING (id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Only admins can update company" ON public.company
  FOR UPDATE USING (id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create similar policies for other tables
```

### 1.1.3 Database Migrations (✅ Completed)

Set up a migration system using Supabase CLI:

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase project
supabase init

# Create a new migration
supabase migration new initial_schema

# Apply migrations
supabase db push
```

### 1.1.4 Data Validation for Decoration-Specific Fields (🟡 In Progress)

Implement validation schemas for decoration-specific fields using Zod:

```typescript
// src/lib/validations/decoration-schemas.ts
import { z } from 'zod';

// Screen Printing validation schema
export const screenPrintingSchema = z.object({
  ink_type: z.enum(['plastisol', 'water-based', 'discharge', 'specialty']),
  ink_color: z.string().optional(),
  mesh_count: z.number().int().positive().optional(),
  colors_count: z.number().int().min(1).default(1),
  flash_required: z.boolean().default(false),
  // Additional fields
});

// Embroidery validation schema
export const embroiderySchema = z.object({
  thread_type: z.enum(['polyester', 'rayon', 'metallic', 'wool', 'cotton']),
  thread_color: z.string().optional(),
  stitch_count: z.number().int().positive().optional(),
  backing_type: z.enum(['cut-away', 'tear-away', 'water-soluble']).optional(),
  // Additional fields
});

// DTG validation schema
export const dtgSchema = z.object({
  pretreatment_required: z.boolean().default(false),
  resolution: z.number().int().min(300).optional(),
  white_underbase: z.boolean().default(false),
  // Additional fields
});

// Vinyl validation schema
export const vinylSchema = z.object({
  material_type: z.enum(['standard', 'glitter', 'reflective', 'flock', 'sublimation']),
  material_color: z.string().optional(),
  application_temperature: z.number().positive().optional(),
  application_time: z.number().int().positive().optional(),
  // Additional fields
});
```

### 1.1.5 Decoration Techniques Schema (❌ Not Started)

Create database schema for decoration techniques:

#### Screen Printing Schema
- Ink types (plastisol, water-based, discharge, specialty inks)
- Mesh counts (86, 110, 156, 180, 200, 230, 305)
- Frame sizes and types (wood, aluminum, roller frames)
- Print specifications (colors per design, flash requirements)
- Squeegee durometer and type tracking

#### Embroidery Schema
- Thread specifications (polyester, rayon, metallic, wool, cotton)
- Thread weight and brand-specific color charts
- Stitch types (satin, fill, running, tatami)
- Backing/stabilizer types (cut-away, tear-away, water-soluble)
- Density settings by fabric type

#### DTG Schema
- Pretreatment specifications by garment color
- Resolution options (600dpi, 1200dpi)
- Color profiles by machine type
- White underbase settings
- Curing requirements (temperature, dwell time)

#### Vinyl/Heat Transfer Schema
- Material types (HTV categories, sublimation)
- Cutting equipment specifications
- Application parameters (temperature, pressure, dwell time)
- Multi-layer application tracking
- Weeding requirements

### 1.1.6 Artwork File Storage and Metadata (❌ Not Started)

Set up artwork file storage and metadata tracking:

#### File Format Requirements
- Vector formats for screen printing (.ai, .eps, .svg)
- Raster formats with resolution requirements
- Embroidery formats (.emb, .dst, .exp)
- Color separation files

#### Metadata Tracking
- Screen printing metadata (colors, mesh recommendations)
- Embroidery metadata (stitch count, thread colors)
- DTG/Vinyl metadata (color profile, cut lines)
- Production specifications by decoration type

#### Version Control and Workflow
- Revision tracking with change logs
- Approval workflow status tracking
- Digital signature capture for approvals
- Production-ready verification checklists

## 1.2 Authentication & User Management

### 1.2.1 Email/Password Authentication (✅ Completed)

Implement email/password authentication using Supabase Auth:

```typescript
// src/lib/auth.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}
```

### 1.2.2 Password Reset Flow (✅ Completed)

Implement password reset flow:

```typescript
// src/lib/auth.ts
export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  return { data, error };
}
```

### 1.2.3 User Profile Management (✅ Completed)

Implement user profile management:

```typescript
// src/lib/user.ts
export async function updateProfile(userId: string, profile: {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}) {
  const { data, error } = await supabase
    .from('users')
    .update(profile)
    .eq('id', userId);
  return { data, error };
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}
```

### 1.2.4 Role-Based Permissions (🟡 In Progress)

Implement role-based permissions for different user types:

#### Specialized Production Roles
- Screen printer
- Embroiderer
- DTG operator
- Heat press operator
- Quality control

#### Art Department Sub-Roles
- Digitizer
- Separator
- Designer
- Art director

#### Shop Floor Management Permissions
- Equipment assignment
- Material allocation
- Production scheduling
- Quality control checkpoints

#### Customer-Facing Role Limitations
- Order viewing
- Artwork approval
- Quote requests
- Reorder capabilities

### 1.2.5 Customer Portal Access (❌ Not Started)

Create a customer portal with limited permissions:
- Order history viewing
- Artwork approval workflow
- Quote requests and approvals
- Reorder functionality
- Payment management

### 1.2.6 Vendor/Supplier Access (❌ Not Started)

Set up vendor/supplier access roles:
- Product catalog management
- Inventory level viewing
- Order fulfillment status
- Invoice management

## 1.3 Tenant Management

### 1.3.1 Company Creation and Management (✅ Completed)

Implement company creation and management:

```typescript
// src/lib/company.ts
export async function createCompany(company: {
  name: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
}) {
  const { data, error } = await supabase
    .from('company')
    .insert([company])
    .select();
  return { data, error };
}

export async function updateCompany(companyId: string, company: {
  name?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
}) {
  const { data, error } = await supabase
    .from('company')
    .update(company)
    .eq('id', companyId)
    .select();
  return { data, error };
}
```

### 1.3.2 Company Settings and Branding (✅ Completed)

Implement company settings and branding:

```typescript
// src/lib/company.ts
export async function updateCompanyBranding(companyId: string, branding: {
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
}) {
  const { data, error } = await supabase
    .from('company')
    .update(branding)
    .eq('id', companyId)
    .select();
  return { data, error };
}
```

### 1.3.3 Multi-Tenant Isolation (🟡 In Progress)

Create multi-tenant isolation for decoration businesses:

#### Decoration-Specific Tenant Settings
- Available decoration techniques
- Default pricing models
- Equipment profiles
- Production capacity

#### Artwork Library Isolation
- Company-specific artwork storage
- Access control for artwork files
- Sharing capabilities between tenants

#### Tenant-Specific Pricing Models
- Custom pricing rules per tenant
- Volume discount structures
- Special customer pricing
- Seasonal promotions

#### Decoration Technique Availability
- Enable/disable techniques per tenant
- Technique-specific settings
- Custom upcharges

#### Tenant-Specific Workflow Templates
- Custom production workflows
- Approval processes
- Quality control checkpoints
- Notification preferences

### 1.3.4 Equipment Profiles (❌ Not Started)

Implement equipment profiles per tenant:

#### Screen Printing Equipment
- Press configurations (manual, automatic, number of stations/colors)
- Maximum print area dimensions
- Dryer specifications (conveyor, flash, overhead)
- Screen room equipment details
- Special capabilities (oversized, sleeve printing)

#### Embroidery Equipment
- Machine specifications (brand, heads, needles)
- Maximum speed and hoop size
- Specialty attachments (sequin, cording)
- Digitizing equipment and software
- Peripheral equipment inventory

#### DTG Equipment
- Printer specifications (brand, print area, resolution)
- Pretreatment equipment details
- Heat setting equipment specifications
- Maintenance schedule tracking
- Production speed capabilities

#### Vinyl/Heat Transfer Equipment
- Cutter specifications (type, width, force capabilities)
- Heat press details (type, size, temperature range)
- Specialty equipment (cap presses, mug presses)
- Software compatibility tracking
- Material handling capabilities

### 1.3.5 Decoration Technique Availability (❌ Not Started)

Set up decoration technique availability per tenant:
- Enable/disable techniques
- Technique-specific pricing
- Production capacity per technique
- Lead time settings
- Minimum order quantities

### 1.3.6 Business-Specific Configuration (❌ Not Started)

Create business-specific configuration:
- Production capacity planning
- Shift scheduling
- Working hours
- Holiday calendar
- Overtime rules

## 1.4 ETL Sync Framework

### 1.4.1 ETL Architecture (❌ Not Started)

Design ETL architecture for importing existing customer data:
- Data source connectors
- Transformation pipelines
- Loading strategies
- Error handling
- Logging and monitoring

### 1.4.2 Product Import Tools (❌ Not Started)

Create product import tools for apparel catalogs:
- SanMar catalog integration
- S&S Activewear integration
- Alphabroder integration
- Custom product import
- Product mapping and categorization

### 1.4.3 Artwork Library Migration (❌ Not Started)

Implement artwork library migration utilities:
- Bulk artwork import
- Metadata extraction
- Automatic categorization
- Thumbnail generation
- Version history preservation

### 1.4.4 Vendor Product Updates (❌ Not Started)

Set up recurring sync for vendor product updates:
- Price updates
- Inventory level sync
- New product detection
- Discontinued product handling
- Catalog version tracking
