# Phase 2: Core Modules

This document outlines the implementation steps for Phase 2 of the Kingtavo platform, focusing on the core modules including product catalog, order management, and decoration techniques.

## 2.1 Product Catalog

### 2.1.1 Product Management (✅ Completed)

Implement basic product management functionality:

```typescript
// src/lib/products.ts
export async function createProduct(product: {
  name: string;
  description?: string;
  sku?: string;
  company_id: string;
  category_id?: string;
  base_price: number;
  is_active?: boolean;
}) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();
  return { data, error };
}

export async function updateProduct(productId: string, product: {
  name?: string;
  description?: string;
  sku?: string;
  category_id?: string;
  base_price?: number;
  is_active?: boolean;
}) {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', productId)
    .select();
  return { data, error };
}

export async function getProducts(companyId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', companyId);
  return { data, error };
}
```

### 2.1.2 Product Variant System (✅ Completed)

Create a product variant system for sizes, colors, etc.:

```typescript
// src/lib/product-variants.ts
export async function createProductVariant(variant: {
  product_id: string;
  size?: string;
  color?: string;
  sku?: string;
  price_adjustment?: number;
  inventory_quantity?: number;
  is_active?: boolean;
}) {
  const { data, error } = await supabase
    .from('product_variants')
    .insert([variant])
    .select();
  return { data, error };
}

export async function updateProductVariant(variantId: string, variant: {
  size?: string;
  color?: string;
  sku?: string;
  price_adjustment?: number;
  inventory_quantity?: number;
  is_active?: boolean;
}) {
  const { data, error } = await supabase
    .from('product_variants')
    .update(variant)
    .eq('id', variantId)
    .select();
  return { data, error };
}

export async function getProductVariants(productId: string) {
  const { data, error } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId);
  return { data, error };
}
```

### 2.1.3 Pricing Rules (🟡 In Progress)

Set up pricing rules based on quantity breaks:

#### Tiered Pricing by Decoration Technique
- Screen printing quantity breaks (12-24, 25-49, 50-99, 100+)
- Embroidery stitch count tiers
- DTG pricing for light vs. dark garments
- Vinyl pricing by material type and size

#### Volume Discount Structures
- Percentage-based discounts
- Fixed amount discounts
- Tiered discount levels
- Customer-specific discount rules

#### Mixed Product Order Pricing
- Combined quantity discounts
- Package deals
- Bundle pricing
- Add-on discounts

#### Decoration-Specific Minimum Quantities
- Screen printing minimums (typically 12+)
- Embroidery minimums (typically 6+)
- DTG minimums (can be as low as 1)
- Vinyl minimums (typically 1-6 depending on complexity)

#### Reorder Discount Structures
- Reduced setup fees for reorders
- Loyalty discounts for repeat customers
- Time-limited reorder specials
- Volume-based reorder incentives

### 2.1.4 Inventory Tracking (🟡 In Progress)

Implement inventory tracking:

#### Blank Goods Inventory
- Size/color matrix tracking
- Low stock alerts
- Reorder thresholds
- Inventory valuation
- Inventory history

#### Consumables Tracking
- Ink inventory by color
- Thread inventory by color and type
- Vinyl/transfer material inventory
- Screen inventory
- Backing/stabilizer inventory

#### Work-in-Progress Inventory
- Allocated inventory for scheduled orders
- Partially completed goods tracking
- Production stage tracking
- Expected completion dates
- Quality hold inventory

#### Inventory Allocation
- Reserved inventory for scheduled orders
- Backorder management
- Allocation priority rules
- Just-in-time ordering
- Vendor lead time tracking

### 2.1.5 Decoration Placement Options (❌ Not Started)

Create decoration placement options:

#### Standard Placement Locations
- Upper garment locations with industry-standard measurements
  - Left chest (4" x 4" standard, coordinates: 7-9" down from shoulder seam, 4-5" from center)
  - Full front (12" x 14" max, centered)
  - Full back (12" x 14" max, 5-7" down from collar)
  - Right chest (4" x 4" standard)
  - Left/right sleeve (3.5" x 3.5" standard)
- Lower garment locations with standard dimensions
  - Left/right hip (4" x 4" standard)
  - Left/right thigh (4" x 4" standard)
  - Back pocket (3.5" x 3.5" max)
- Headwear locations with size constraints
  - Front center (4" x 2.5" max)
  - Side (2" x 2" max)
  - Back (3" x 1.5" max)

#### Placement Specifications
- Measurement system with reference points
- Garment-specific adjustments by size
- Multi-location coordination guidelines
- Seam avoidance requirements
- Template system for consistent placement

#### Technical Constraints
- Maximum size charts by location and method
- Special placement considerations for difficult areas
- Placement visualization tools
- Over-seam printing requirements
- Unusual garment construction handling

### 2.1.6 Print Method Constraints (❌ Not Started)

Set up print method constraints per product:

#### Fabric Compatibility Matrix
- Material type compatibility by decoration method
  - Cotton (screen print, DTG, embroidery, vinyl - all compatible)
  - Polyester (screen print with limitations, sublimation, embroidery, limited DTG)
  - Poly/cotton blends (compatibility percentages by decoration type)
  - Performance/moisture-wicking (special ink requirements, embroidery limitations)
- Fabric weight considerations
  - Lightweight (special backing for embroidery, ink bleed control)
  - Midweight (standard parameters)
  - Heavyweight (increased pressure/heat requirements)
- Texture impact on decoration quality
  - Ribbed texture limitations
  - Piqué/knit surface considerations
  - Fleece/terry surface preparation

#### Color Limitations
- Garment color impact on decoration options
  - Dark garment requirements (underbase, brightness limitations)
  - Light garment options (expanded color possibilities)
  - Heathered/marled fabric considerations
- Decoration color constraints by method
  - Maximum colors by decoration method
  - Color trapping requirements for screen printing
  - Thread color limitations for embroidery
  - DTG color gamut restrictions
- Special process requirements
  - Dye sublimation (polyester content minimum: 60%+)
  - Discharge printing (natural fiber requirement)
  - Water-based ink requirements (fabric absorbency)

#### Production Parameters
- Minimum order quantities by decoration type
  - Screen print: 12+
  - DTG: 1+
  - Embroidery: 6+
  - Vinyl: 1-6 depending on complexity
- Production time implications by method
- Equipment-specific constraints
- Setup cost amortization calculations
- Alternative decoration suggestions for small runs

### 2.1.7 Blank Goods Vendor Integration (❌ Not Started)

Implement blank goods vendor integration:
- SanMar API integration
- S&S Activewear API integration
- Alphabroder API integration
- Custom vendor integration
- Inventory sync with vendors

### 2.1.8 Decoration Upcharge System (❌ Not Started)

Create decoration upcharge system:

#### Screen Printing Upcharges
- Oversized prints with tiered pricing
- Specialty ink upcharges (metallic, glow, puff)
- Process upcharges (simulated process, discharge)
- Flash requirements additional fees
- Custom ink matching services

#### Embroidery Upcharges
- Stitch count pricing tiers
- Thread specification upcharges
- Technical upcharges (3D foam, appliqué)
- Digitizing complexity fees
- Special backing requirements

#### DTG/Vinyl Upcharges
- Dark garment surcharges
- Oversized print area fees
- Specialty vinyl upcharges
- Multi-color/layer design fees
- Personalization pricing structure

#### Setup and Digitizing Fees
- Screen fees per color
- Art separation charges
- Digitizing fees by complexity
- Rush service upcharges
- File format conversion fees

## 2.2 Quote Builder

### 2.2.1 Quote Builder UI (❌ Not Started)

Design quote builder UI with decoration options:
- Product selection interface
- Quantity selection with price breaks
- Decoration technique selection
- Placement selection
- Color selection
- Artwork upload

### 2.2.2 Ink/Thread Color Selection (❌ Not Started)

Implement ink/thread color selection:
- Pantone color picker for screen printing
- Thread color charts by brand
- DTG color management
- Vinyl color selection
- Custom color matching options

### 2.2.3 Artwork Upload and Annotation (❌ Not Started)

Create artwork upload and annotation system:
- Drag-and-drop file upload
- Format validation
- Resolution checking
- Color separation preview
- Placement visualization
- Annotation tools for revisions

### 2.2.4 Decoration Technique Selection (❌ Not Started)

Set up decoration technique selection with pricing:
- Technique comparison view
- Technique-specific options
- Real-time pricing updates
- Technique limitations by product
- Recommended techniques by product type

### 2.2.5 Quantity Break Pricing Calculator (❌ Not Started)

Implement quantity break pricing calculator:
- Dynamic price calculation
- Volume discount visualization
- Setup fee amortization
- Additional options pricing
- Total cost breakdown

### 2.2.6 Quick-Quote Templates (❌ Not Started)

Create quick-quote templates for common jobs:
- Standard t-shirt orders
- Corporate apparel packages
- Team uniform packages
- Event merchandise packages
- Promotional product bundles

### 2.2.7 Quote Approval Workflow (❌ Not Started)

Set up quote approval workflow with customer proofing:
- Quote generation
- Digital mockup creation
- Customer review interface
- Approval/revision process
- Quote to order conversion

### 2.2.8 Quote Expiration and Follow-up (❌ Not Started)

Implement quote expiration and follow-up system:
- Expiration date setting
- Automatic follow-up emails
- Quote revival process
- Conversion tracking
- Sales pipeline integration

## 2.3 Order Management

### 2.3.1 Order Creation and Tracking (✅ Completed)

Implement order creation and tracking:

```typescript
// src/lib/orders.ts
export async function createOrder(order: {
  company_id: string;
  customer_id: string;
  status?: string;
  due_date?: string;
  total_amount?: number;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select();
  return { data, error };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select();
  return { data, error };
}

export async function getOrders(companyId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customer:customer_id(*)')
    .eq('company_id', companyId);
  return { data, error };
}
```

### 2.3.2 Order Status Updates (🟡 In Progress)

Implement order status updates:

#### Decoration-Specific Status Workflows
- Screen printing workflow (art approval, screens burned, printing, curing, QC)
- Embroidery workflow (digitizing, hooping, sewing, trimming, QC)
- DTG workflow (art prep, pretreatment, printing, curing, QC)
- Vinyl workflow (design prep, cutting, weeding, application, QC)

#### Artwork Approval Status Tracking
- Pending submission
- In review
- Revisions requested
- Approved for production
- Final approval

#### Production Stage Tracking
- Pre-production
- In production
- Quality control
- Packaging
- Ready for pickup/shipping

#### Quality Control Checkpoints
- Pre-production sample approval
- In-process quality checks
- Final product inspection
- Packaging verification
- Customer acceptance

#### Shipping/Fulfillment Status Updates
- Order picked
- Order packed
- Shipping label created
- Shipped
- Delivered

### 2.3.3 Order Details and Line Items (🟡 In Progress)

Implement order details and line items:

#### Decoration Specifications per Line Item
- Technique details
- Color specifications
- Size and placement
- Special instructions
- Production requirements

#### Placement Details
- Location on garment
- Size dimensions
- Position coordinates
- Orientation
- Special placement notes

#### Color Specifications
- Ink colors with Pantone codes
- Thread colors with brand-specific codes
- Vinyl colors with material types
- Color matching requirements
- Special effect details

#### Production Notes
- Special handling instructions
- Material preparation notes
- Machine settings
- Quality control focus areas
- Packaging instructions

#### Mockup/Proof Attachments
- Digital mockups
- Physical sample photos
- Placement guides
- Color references
- Approval documentation

### 2.3.4 Production Specification Sheets (❌ Not Started)

Create production specification sheets:
- Comprehensive job details
- Artwork files and placement
- Material requirements
- Production steps
- Quality control checkpoints
- Packaging instructions

### 2.3.5 Artwork Approval Workflow (❌ Not Started)

Implement artwork approval workflow:
- Initial artwork submission
- Internal review process
- Customer review interface
- Revision tracking
- Final approval and sign-off
- Production-ready file generation

### 2.3.6 Production File Generation (❌ Not Started)

Set up production file generation:
- Screen printing separations
- Embroidery DST files
- DTG print files
- Vinyl cut files
- Production-ready file storage
- File versioning and tracking

### 2.3.7 Reorder Functionality (❌ Not Started)

Create reorder functionality with previous artwork:
- Order history lookup
- Quick reorder process
- Artwork retrieval
- Quantity/size adjustments
- Pricing updates
- Expedited production options

### 2.3.8 Rush Order Flagging (❌ Not Started)

Implement rush order flagging and scheduling:
- Rush order identification
- Production schedule impact
- Rush fee calculation
- Capacity checking
- Priority production routing
- Expedited shipping options

## 2.4 Checkout System

### 2.4.1 Corporate Store Checkout (❌ Not Started)

Design checkout flow for corporate stores:
- User authentication
- Department/cost center selection
- Approval routing
- Payment method selection
- Shipping options
- Order confirmation

### 2.4.2 Cart Functionality (❌ Not Started)

Implement cart functionality with decoration options:
- Add to cart with decoration details
- Cart item editing
- Quantity adjustments
- Remove items
- Save for later
- Cart summary with pricing breakdown

### 2.4.3 Employee Purchase Portal (❌ Not Started)

Create employee purchase portal:
- Employee authentication
- Employee pricing
- Payment options
- Delivery/pickup options
- Order history
- Reorder functionality

### 2.4.4 Group Order Collection (❌ Not Started)

Set up group order collection:
- Group order creation
- Participant invitation
- Individual size/style selection
- Order consolidation
- Group pricing
- Individual payment options

### 2.4.5 Deposit/Balance Payment System (❌ Not Started)

Implement deposit/balance payment system:
- Deposit calculation
- Deposit invoice generation
- Balance due tracking
- Final payment notification
- Payment status tracking
- Payment receipt generation

### 2.4.6 Payment Terms for Established Customers (❌ Not Started)

Create payment terms for established customers:
- Net 15/30/60 terms
- Credit limit management
- Invoice generation
- Payment tracking
- Late payment handling
- Early payment discounts

### 2.4.7 Order Confirmation with Production Timeline (❌ Not Started)

Set up order confirmation with production timeline:
- Order summary
- Production timeline visualization
- Key milestone dates
- Status update subscription
- Contact information
- Modification options
