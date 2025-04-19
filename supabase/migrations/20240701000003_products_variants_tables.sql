-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES company(id),
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  printavo_product_id TEXT,
  base_price DECIMAL(10, 2),
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id),
  name TEXT NOT NULL,
  sku TEXT,
  color TEXT,
  size TEXT,
  price_adjustment DECIMAL(10, 2) DEFAULT 0,
  inventory_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
DROP POLICY IF EXISTS "Users can view products in their company" ON products;
CREATE POLICY "Users can view products in their company"
  ON products FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE auth.uid() = user_id
  ));

DROP POLICY IF EXISTS "Admin and sales can manage products" ON products;
CREATE POLICY "Admin and sales can manage products"
  ON products FOR ALL
  USING (company_id IN (
    SELECT company_id FROM users WHERE auth.uid() = user_id AND role IN ('admin', 'sales')
  ));

-- Create policies for product variants table
DROP POLICY IF EXISTS "Users can view product variants in their company" ON product_variants;
CREATE POLICY "Users can view product variants in their company"
  ON product_variants FOR SELECT
  USING (product_id IN (
    SELECT id FROM products WHERE company_id IN (
      SELECT company_id FROM users WHERE auth.uid() = user_id
    )
  ));

DROP POLICY IF EXISTS "Admin and sales can manage product variants" ON product_variants;
CREATE POLICY "Admin and sales can manage product variants"
  ON product_variants FOR ALL
  USING (product_id IN (
    SELECT id FROM products WHERE company_id IN (
      SELECT company_id FROM users WHERE auth.uid() = user_id AND role IN ('admin', 'sales')
    )
  ));

-- Enable realtime
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table product_variants;
