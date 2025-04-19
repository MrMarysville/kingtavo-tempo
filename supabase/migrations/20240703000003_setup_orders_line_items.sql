-- Customers table (if not already created)
CREATE TABLE IF NOT EXISTS public.customer (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.company(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.customer IS 'Customer accounts associated with a company.';

-- Orders table
CREATE TABLE IF NOT EXISTS public.order (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.company(id),
  store_id UUID REFERENCES public.store(id), -- Optional: link to specific store
  customer_id UUID NOT NULL REFERENCES public.customer(id),
  order_number TEXT UNIQUE NOT NULL, -- Human-readable unique order identifier
  status TEXT NOT NULL, -- e.g., 'pending', 'processing', 'shipped', 'completed', 'cancelled'
  order_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date TIMESTAMPTZ,
  total NUMERIC(12,2) NOT NULL,
  shipping_address JSONB,
  billing_address JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.order IS 'Represents customer orders placed within a company or store.';

-- Line Items table
CREATE TABLE IF NOT EXISTS public.line_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.order(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES public.product_variants(id),
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12,2) NOT NULL, -- Price at the time of order
  total NUMERIC(12,2) NOT NULL, -- quantity * unit_price
  -- Add fields for decoration details if applicable per line item
  decoration_details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.line_item IS 'Individual items included in an order.';

-- Tasks table
CREATE TABLE IF NOT EXISTS public.task (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.company(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.order(id), -- Can be linked to an order or standalone
  assigned_to_user_id UUID REFERENCES public.users(id),
  type TEXT NOT NULL, -- e.g., 'Artwork Approval', 'Screen Printing', 'Shipping'
  status TEXT NOT NULL, -- e.g., 'pending', 'in_progress', 'completed', 'blocked'
  priority INTEGER DEFAULT 3, -- Lower number means higher priority
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.task IS 'Represents work items, often related to fulfilling orders.';

-- Messages table (for Task communication)
CREATE TABLE IF NOT EXISTS public.message (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.task(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.message IS 'Communication log associated with specific tasks.';

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_company_id ON public.customer (company_id);
CREATE INDEX IF NOT EXISTS idx_order_company_id ON public.order (company_id);
CREATE INDEX IF NOT EXISTS idx_order_store_id ON public.order (store_id);
CREATE INDEX IF NOT EXISTS idx_order_customer_id ON public.order (customer_id);
CREATE INDEX IF NOT EXISTS idx_line_item_order_id ON public.line_item (order_id);
CREATE INDEX IF NOT EXISTS idx_line_item_variant_id ON public.line_item (product_variant_id);
CREATE INDEX IF NOT EXISTS idx_task_company_id ON public.task (company_id);
CREATE INDEX IF NOT EXISTS idx_task_order_id ON public.task (order_id);
CREATE INDEX IF NOT EXISTS idx_task_assigned_to ON public.task (assigned_to_user_id);
CREATE INDEX IF NOT EXISTS idx_message_task_id ON public.message (task_id);
CREATE INDEX IF NOT EXISTS idx_message_user_id ON public.message (user_id);

-- Additional indexes on frequently filtered/sorted columns
CREATE INDEX IF NOT EXISTS idx_order_status ON public.order (status);
CREATE INDEX IF NOT EXISTS idx_order_order_date ON public.order (order_date DESC);
CREATE INDEX IF NOT EXISTS idx_task_status ON public.task (status);
CREATE INDEX IF NOT EXISTS idx_task_priority_due ON public.task (priority ASC, due_at ASC);

-- Create the get_my_company_id function if it doesn't exist
CREATE OR REPLACE FUNCTION public.get_my_company_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  company_id UUID;
BEGIN
  SELECT c.id INTO company_id
  FROM public.company c
  JOIN public.users u ON u.company_id = c.id
  WHERE u.id = auth.uid();
  
  RETURN company_id;
END;
$$;

-- Enable Row Level Security
ALTER TABLE public.customer ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.line_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer table
DROP POLICY IF EXISTS select_own_company_customer ON public.customer;
CREATE POLICY select_own_company_customer ON public.customer FOR SELECT
USING (company_id = get_my_company_id());

DROP POLICY IF EXISTS insert_own_company_customer ON public.customer;
CREATE POLICY insert_own_company_customer ON public.customer FOR INSERT
WITH CHECK (company_id = get_my_company_id());

DROP POLICY IF EXISTS update_own_company_customer ON public.customer;
CREATE POLICY update_own_company_customer ON public.customer FOR UPDATE
USING (company_id = get_my_company_id());

DROP POLICY IF EXISTS delete_own_company_customer ON public.customer;
CREATE POLICY delete_own_company_customer ON public.customer FOR DELETE
USING (company_id = get_my_company_id());

-- RLS Policies for order table
DROP POLICY IF EXISTS select_own_company_order ON public.order;
CREATE POLICY select_own_company_order ON public.order FOR SELECT
USING (company_id = get_my_company_id());

DROP POLICY IF EXISTS insert_own_company_order ON public.order;
CREATE POLICY insert_own_company_order ON public.order FOR INSERT
WITH CHECK (company_id = get_my_company_id());

DROP POLICY IF EXISTS update_own_company_order ON public.order;
CREATE POLICY update_own_company_order ON public.order FOR UPDATE
USING (company_id = get_my_company_id());

DROP POLICY IF EXISTS delete_own_company_order ON public.order;
CREATE POLICY delete_own_company_order ON public.order FOR DELETE
USING (company_id = get_my_company_id());

-- RLS Policies for line_item table (through order relationship)
DROP POLICY IF EXISTS select_own_company_line_item ON public.line_item;
CREATE POLICY select_own_company_line_item ON public.line_item FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.order o 
    WHERE o.id = line_item.order_id AND o.company_id = get_my_company_id()
  )
);

DROP POLICY IF EXISTS insert_own_company_line_item ON public.line_item;
CREATE POLICY insert_own_company_line_item ON public.line_item FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.order o 
    WHERE o.id = line_item.order_id AND o.company_id = get_my_company_id()
  )
);

DROP POLICY IF EXISTS update_own_company_line_item ON public.line_item;
CREATE POLICY update_own_company_line_item ON public.line_item FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.order o 
    WHERE o.id = line_item.order_id AND o.company_id = get_my_company_id()
  )
);

DROP POLICY IF EXISTS delete_own_company_line_item ON public.line_item;
CREATE POLICY delete_own_company_line_item ON public.line_item FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.order o 
    WHERE o.id = line_item.order_id AND o.company_id = get_my_company_id()
  )
);

-- RLS Policies for task table
DROP POLICY IF EXISTS select_own_company_task ON public.task;
CREATE POLICY select_own_company_task ON public.task FOR SELECT
USING (company_id = get_my_company_id());

DROP POLICY IF EXISTS insert_own_company_task ON public.task;
CREATE POLICY insert_own_company_task ON public.task FOR INSERT
WITH CHECK (company_id = get_my_company_id());

DROP POLICY IF EXISTS update_own_company_task ON public.task;
CREATE POLICY update_own_company_task ON public.task FOR UPDATE
USING (company_id = get_my_company_id());

DROP POLICY IF EXISTS delete_own_company_task ON public.task;
CREATE POLICY delete_own_company_task ON public.task FOR DELETE
USING (company_id = get_my_company_id());

-- RLS Policies for message table (through task relationship)
DROP POLICY IF EXISTS select_own_company_message ON public.message;
CREATE POLICY select_own_company_message ON public.message FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.task t 
    WHERE t.id = message.task_id AND t.company_id = get_my_company_id()
  )
);

DROP POLICY IF EXISTS insert_own_company_message ON public.message;
CREATE POLICY insert_own_company_message ON public.message FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.task t 
    WHERE t.id = message.task_id AND t.company_id = get_my_company_id()
  )
);

DROP POLICY IF EXISTS update_own_company_message ON public.message;
CREATE POLICY update_own_company_message ON public.message FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.task t 
    WHERE t.id = message.task_id AND t.company_id = get_my_company_id()
  )
);

DROP POLICY IF EXISTS delete_own_company_message ON public.message;
CREATE POLICY delete_own_company_message ON public.message FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.task t 
    WHERE t.id = message.task_id AND t.company_id = get_my_company_id()
  )
);

-- Enable realtime for these tables
alter publication supabase_realtime add table public.customer;
alter publication supabase_realtime add table public.order;
alter publication supabase_realtime add table public.line_item;
alter publication supabase_realtime add table public.task;
alter publication supabase_realtime add table public.message;