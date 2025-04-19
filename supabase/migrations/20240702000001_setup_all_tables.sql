-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create company/tenant table
CREATE TABLE IF NOT EXISTS company (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  printavo_account_id TEXT,
  logo_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Administrator with full access'),
  ('production', 'Production staff with access to production features'),
  ('sales', 'Sales staff with access to sales features'),
  ('store', 'Store manager with access to store features'),
  ('customer', 'Customer with limited access')
ON CONFLICT (name) DO NOTHING;

-- Create users table (basic structure)
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  role TEXT DEFAULT 'customer',
  company_id UUID REFERENCES company(id),
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
ALTER TABLE company ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policy for company table
DROP POLICY IF EXISTS "Users can view their own company" ON company;
CREATE POLICY "Users can view their own company"
  ON company FOR SELECT
  USING (id IN (
    SELECT company_id FROM users WHERE auth.uid() = user_id
  ));

DROP POLICY IF EXISTS "Company admins can update their own company" ON company;
CREATE POLICY "Company admins can update their own company"
  ON company FOR UPDATE
  USING (id IN (
    SELECT company_id FROM users WHERE auth.uid() = user_id AND role = 'admin'
  ));

-- Create policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Company admins can view users in their company" ON users;
CREATE POLICY "Company admins can view users in their company"
  ON users FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE auth.uid() = user_id AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Company admins can update users in their company" ON users;
CREATE POLICY "Company admins can update users in their company"
  ON users FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users WHERE auth.uid() = user_id AND role = 'admin'
  ));

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
alter publication supabase_realtime add table company;
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table product_variants;