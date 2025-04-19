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

-- Enable row level security
ALTER TABLE company ENABLE ROW LEVEL SECURITY;

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

-- Enable realtime
alter publication supabase_realtime add table company;
