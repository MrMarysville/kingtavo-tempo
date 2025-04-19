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
ON CONFLICT (id) DO NOTHING;

-- Enable row level security for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

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

-- Enable realtime
alter publication supabase_realtime add table users;
