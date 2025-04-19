-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(10, 2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (company_id) REFERENCES company(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add comment to the table
COMMENT ON TABLE orders IS 'Stores customer orders';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS orders_company_id_idx ON orders(company_id);
CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders(customer_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
-- Allow users to select orders from their company
DROP POLICY IF EXISTS "Users can view orders from their company" ON orders;
CREATE POLICY "Users can view orders from their company"
  ON orders FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users_roles WHERE user_id = auth.uid()
  ));

-- Allow users to insert orders for their company
DROP POLICY IF EXISTS "Users can insert orders for their company" ON orders;
CREATE POLICY "Users can insert orders for their company"
  ON orders FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM users_roles WHERE user_id = auth.uid()
  ));

-- Allow users to update orders from their company
DROP POLICY IF EXISTS "Users can update orders from their company" ON orders;
CREATE POLICY "Users can update orders from their company"
  ON orders FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users_roles WHERE user_id = auth.uid()
  ));

-- Allow users to delete orders from their company
DROP POLICY IF EXISTS "Users can delete orders from their company" ON orders;
CREATE POLICY "Users can delete orders from their company"
  ON orders FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM users_roles WHERE user_id = auth.uid()
  ));

-- Add to realtime publication
alter publication supabase_realtime add table orders;