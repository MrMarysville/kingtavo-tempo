-- Migration: Create decoration techniques schema
-- Description: This migration adds tables for decoration techniques including screen printing, embroidery, DTG, and vinyl

-- Create decoration_techniques table (parent table for all decoration methods)
CREATE TABLE IF NOT EXISTS public.decoration_techniques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.company(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  setup_fee NUMERIC(12,2) DEFAULT 0,
  minimum_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.decoration_techniques IS 'Master table for all decoration techniques offered by a company';

-- Create screen_printing table
CREATE TABLE IF NOT EXISTS public.screen_printing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technique_id UUID NOT NULL REFERENCES public.decoration_techniques(id) ON DELETE CASCADE,
  -- Ink Types
  ink_type TEXT NOT NULL, -- 'plastisol', 'water-based', 'discharge', 'specialty'
  ink_color TEXT, -- Can be Pantone code or name
  ink_opacity TEXT, -- 'low', 'medium', 'high'
  cure_temperature INTEGER, -- in degrees Fahrenheit
  flash_required BOOLEAN DEFAULT FALSE,
  -- Screen Parameters
  mesh_count INTEGER, -- e.g., 110, 156, 230
  frame_type TEXT, -- 'wood', 'aluminum', 'roller'
  frame_size TEXT, -- dimensions in inches
  -- Print Specifications
  max_colors INTEGER DEFAULT 1,
  print_order INTEGER, -- sequence in multi-color prints
  squeegee_type TEXT,
  squeegee_durometer INTEGER, -- hardness rating
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.screen_printing IS 'Screen printing specific parameters and settings';

-- Create embroidery table
CREATE TABLE IF NOT EXISTS public.embroidery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technique_id UUID NOT NULL REFERENCES public.decoration_techniques(id) ON DELETE CASCADE,
  -- Thread Specifications
  thread_type TEXT NOT NULL, -- 'polyester', 'rayon', 'metallic', 'wool', 'cotton'
  thread_weight TEXT, -- '40wt', '60wt', etc.
  thread_brand TEXT, -- 'Madeira', 'Isacord', 'Robison-Anton'
  thread_color TEXT, -- Brand-specific color code or name
  -- Stitch Parameters
  stitch_type TEXT, -- 'satin', 'fill', 'running', 'tatami'
  stitch_density NUMERIC(8,2), -- stitches per inch
  stitch_count INTEGER, -- total number of stitches
  underlay_type TEXT,
  -- Backing/Stabilizer
  backing_type TEXT, -- 'cut-away', 'tear-away', 'water-soluble'
  backing_weight TEXT, -- 'light', 'medium', 'heavy'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.embroidery IS 'Embroidery specific parameters and settings';

-- Create dtg table (Direct to Garment)
CREATE TABLE IF NOT EXISTS public.dtg (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technique_id UUID NOT NULL REFERENCES public.decoration_techniques(id) ON DELETE CASCADE,
  -- Pretreatment Specifications
  pretreatment_required BOOLEAN DEFAULT FALSE,
  pretreatment_type TEXT,
  pretreatment_method TEXT, -- 'spray', 'dip', 'roller'
  -- Print Settings
  resolution INTEGER, -- in DPI (600, 1200)
  color_profile TEXT,
  white_underbase BOOLEAN DEFAULT FALSE,
  white_highlight BOOLEAN DEFAULT FALSE,
  -- Curing Requirements
  cure_temperature INTEGER, -- in degrees Fahrenheit
  cure_time INTEGER, -- in seconds
  cure_method TEXT, -- 'heat press', 'tunnel dryer'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.dtg IS 'Direct to Garment printing specific parameters and settings';

-- Create vinyl table (Heat Transfer Vinyl)
CREATE TABLE IF NOT EXISTS public.vinyl (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  technique_id UUID NOT NULL REFERENCES public.decoration_techniques(id) ON DELETE CASCADE,
  -- Material Types
  material_type TEXT NOT NULL, -- 'standard', 'glitter', 'reflective', 'flock', 'sublimation'
  material_color TEXT,
  material_brand TEXT,
  -- Equipment Settings
  cutting_force INTEGER, -- in grams
  cutting_speed INTEGER,
  blade_depth NUMERIC(5,2), -- in mm
  -- Application Parameters
  application_temperature INTEGER, -- in degrees Fahrenheit
  application_pressure TEXT, -- 'light', 'medium', 'firm'
  application_time INTEGER, -- in seconds
  peel_type TEXT, -- 'hot', 'cold', 'warm'
  multi_layer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.vinyl IS 'Vinyl and heat transfer specific parameters and settings';

-- Create decoration_placements table
CREATE TABLE IF NOT EXISTS public.decoration_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.company(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'left chest', 'full back', 'sleeve', etc.
  description TEXT,
  max_width NUMERIC(6,2), -- in inches
  max_height NUMERIC(6,2), -- in inches
  position_x NUMERIC(6,2), -- horizontal position from reference point
  position_y NUMERIC(6,2), -- vertical position from reference point
  reference_point TEXT, -- 'collar', 'shoulder seam', 'center', etc.
  garment_type TEXT, -- 'tshirt', 'hoodie', 'hat', etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.decoration_placements IS 'Standard decoration placement locations and specifications';

-- Create decoration_upcharges table
CREATE TABLE IF NOT EXISTS public.decoration_upcharges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.company(id) ON DELETE CASCADE,
  technique_id UUID NOT NULL REFERENCES public.decoration_techniques(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'oversized', 'metallic ink', '3D foam', etc.
  description TEXT,
  upcharge_type TEXT NOT NULL, -- 'flat', 'percentage', 'per_color', 'per_thousand_stitches'
  upcharge_amount NUMERIC(12,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.decoration_upcharges IS 'Additional charges for special decoration features';

-- Create line_item_decorations junction table
CREATE TABLE IF NOT EXISTS public.line_item_decorations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_item_id UUID NOT NULL REFERENCES public.line_item(id) ON DELETE CASCADE,
  technique_id UUID NOT NULL REFERENCES public.decoration_techniques(id),
  placement_id UUID NOT NULL REFERENCES public.decoration_placements(id),
  artwork_id UUID, -- Will reference artwork table when created
  colors_count INTEGER DEFAULT 1,
  width NUMERIC(6,2), -- in inches
  height NUMERIC(6,2), -- in inches
  notes TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  -- Technique-specific details stored in respective tables with foreign key to this table
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.line_item_decorations IS 'Links line items to specific decoration techniques and placements';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_decoration_techniques_company_id ON public.decoration_techniques(company_id);
CREATE INDEX IF NOT EXISTS idx_screen_printing_technique_id ON public.screen_printing(technique_id);
CREATE INDEX IF NOT EXISTS idx_embroidery_technique_id ON public.embroidery(technique_id);
CREATE INDEX IF NOT EXISTS idx_dtg_technique_id ON public.dtg(technique_id);
CREATE INDEX IF NOT EXISTS idx_vinyl_technique_id ON public.vinyl(technique_id);
CREATE INDEX IF NOT EXISTS idx_decoration_placements_company_id ON public.decoration_placements(company_id);
CREATE INDEX IF NOT EXISTS idx_decoration_upcharges_company_id ON public.decoration_upcharges(company_id);
CREATE INDEX IF NOT EXISTS idx_decoration_upcharges_technique_id ON public.decoration_upcharges(technique_id);
CREATE INDEX IF NOT EXISTS idx_line_item_decorations_line_item_id ON public.line_item_decorations(line_item_id);
CREATE INDEX IF NOT EXISTS idx_line_item_decorations_technique_id ON public.line_item_decorations(technique_id);
CREATE INDEX IF NOT EXISTS idx_line_item_decorations_placement_id ON public.line_item_decorations(placement_id);

-- Enable Row Level Security
ALTER TABLE public.decoration_techniques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_printing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.embroidery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dtg ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vinyl ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoration_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decoration_upcharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.line_item_decorations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Decoration techniques policies
CREATE POLICY "Users can view decoration techniques in their company" ON public.decoration_techniques
  FOR SELECT USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admin and sales can manage decoration techniques" ON public.decoration_techniques
  FOR ALL USING (company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'sales')
  ));

-- Similar policies for other tables
-- Screen printing policies
CREATE POLICY "Users can view screen printing in their company" ON public.screen_printing
  FOR SELECT USING (technique_id IN (
    SELECT id FROM public.decoration_techniques WHERE company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Admin and production can manage screen printing" ON public.screen_printing
  FOR ALL USING (technique_id IN (
    SELECT id FROM public.decoration_techniques WHERE company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'production')
    )
  ));

-- Apply similar policies to other decoration technique tables
-- Embroidery policies
CREATE POLICY "Users can view embroidery in their company" ON public.embroidery
  FOR SELECT USING (technique_id IN (
    SELECT id FROM public.decoration_techniques WHERE company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Admin and production can manage embroidery" ON public.embroidery
  FOR ALL USING (technique_id IN (
    SELECT id FROM public.decoration_techniques WHERE company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'production')
    )
  ));

-- DTG policies
CREATE POLICY "Users can view DTG in their company" ON public.dtg
  FOR SELECT USING (technique_id IN (
    SELECT id FROM public.decoration_techniques WHERE company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Admin and production can manage DTG" ON public.dtg
  FOR ALL USING (technique_id IN (
    SELECT id FROM public.decoration_techniques WHERE company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'production')
    )
  ));

-- Vinyl policies
CREATE POLICY "Users can view vinyl in their company" ON public.vinyl
  FOR SELECT USING (technique_id IN (
    SELECT id FROM public.decoration_techniques WHERE company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  ));

CREATE POLICY "Admin and production can manage vinyl" ON public.vinyl
  FOR ALL USING (technique_id IN (
    SELECT id FROM public.decoration_techniques WHERE company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'production')
    )
  ));

-- Decoration placements policies
CREATE POLICY "Users can view decoration placements in their company" ON public.decoration_placements
  FOR SELECT USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admin and production can manage decoration placements" ON public.decoration_placements
  FOR ALL USING (company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'production')
  ));

-- Decoration upcharges policies
CREATE POLICY "Users can view decoration upcharges in their company" ON public.decoration_upcharges
  FOR SELECT USING (company_id IN (SELECT company_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admin and sales can manage decoration upcharges" ON public.decoration_upcharges
  FOR ALL USING (company_id IN (
    SELECT company_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'sales')
  ));

-- Line item decorations policies
CREATE POLICY "Users can view line item decorations in their company" ON public.line_item_decorations
  FOR SELECT USING (line_item_id IN (
    SELECT id FROM public.line_item WHERE order_id IN (
      SELECT id FROM public.order WHERE company_id IN (
        SELECT company_id FROM public.users WHERE id = auth.uid()
      )
    )
  ));

CREATE POLICY "Admin, sales, and production can manage line item decorations" ON public.line_item_decorations
  FOR ALL USING (line_item_id IN (
    SELECT id FROM public.line_item WHERE order_id IN (
      SELECT id FROM public.order WHERE company_id IN (
        SELECT company_id FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'sales', 'production')
      )
    )
  ));

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.decoration_techniques;
ALTER PUBLICATION supabase_realtime ADD TABLE public.screen_printing;
ALTER PUBLICATION supabase_realtime ADD TABLE public.embroidery;
ALTER PUBLICATION supabase_realtime ADD TABLE public.dtg;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vinyl;
ALTER PUBLICATION supabase_realtime ADD TABLE public.decoration_placements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.decoration_upcharges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.line_item_decorations;
