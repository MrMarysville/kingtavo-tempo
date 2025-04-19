-- Create line_items table
CREATE TABLE IF NOT EXISTS line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL,
  product_variant_id UUID NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT
);

-- Add comment to the table
COMMENT ON TABLE line_items IS 'Stores individual items within an order';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS line_items_order_id_idx ON line_items(order_id);
CREATE INDEX IF NOT EXISTS line_items_product_variant_id_idx ON line_items(product_variant_id);

-- Enable Row Level Security
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;

-- Create policies for line_items table
-- Allow users to select line_items related to orders from their company
DROP POLICY IF EXISTS "Users can view line_items from their company orders" ON line_items;
CREATE POLICY "Users can view line_items from their company orders"
  ON line_items FOR SELECT
  USING (order_id IN (
    SELECT id FROM orders WHERE company_id IN (
      SELECT company_id FROM users_roles WHERE user_id = auth.uid()
    )
  ));

-- Allow users to insert line_items for orders from their company
DROP POLICY IF EXISTS "Users can insert line_items for their company orders" ON line_items;
CREATE POLICY "Users can insert line_items for their company orders"
  ON line_items FOR INSERT
  WITH CHECK (order_id IN (
    SELECT id FROM orders WHERE company_id IN (
      SELECT company_id FROM users_roles WHERE user_id = auth.uid()
    )
  ));

-- Allow users to update line_items for orders from their company
DROP POLICY IF EXISTS "Users can update line_items for their company orders" ON line_items;
CREATE POLICY "Users can update line_items for their company orders"
  ON line_items FOR UPDATE
  USING (order_id IN (
    SELECT id FROM orders WHERE company_id IN (
      SELECT company_id FROM users_roles WHERE user_id = auth.uid()
    )
  ));

-- Allow users to delete line_items for orders from their company
DROP POLICY IF EXISTS "Users can delete line_items for their company orders" ON line_items;
CREATE POLICY "Users can delete line_items for their company orders"
  ON line_items FOR DELETE
  USING (order_id IN (
    SELECT id FROM orders WHERE company_id IN (
      SELECT company_id FROM users_roles WHERE user_id = auth.uid()
    )
  ));

-- Add to realtime publication
alter publication supabase_realtime add table line_items;