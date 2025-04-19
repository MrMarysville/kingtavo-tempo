-- Create customers table if it doesn't exist
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable row level security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their company's customers" ON customers;
CREATE POLICY "Users can view their company's customers"
  ON customers FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert their company's customers" ON customers;
CREATE POLICY "Users can insert their company's customers"
  ON customers FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update their company's customers" ON customers;
CREATE POLICY "Users can update their company's customers"
  ON customers FOR UPDATE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete their company's customers" ON customers;
CREATE POLICY "Users can delete their company's customers"
  ON customers FOR DELETE
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE customers;

-- Create indexes
CREATE INDEX IF NOT EXISTS customers_company_id_idx ON customers(company_id);
CREATE INDEX IF NOT EXISTS customers_email_idx ON customers(email);
