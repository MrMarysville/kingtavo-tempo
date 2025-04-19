export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          primary_color: string | null;
          secondary_color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          primary_color?: string | null;
          secondary_color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      roles: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          permissions: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          permissions?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          permissions?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          name: string | null;
          avatar_url: string | null;
          company_id: string | null;
          role_id: string | null;
          user_id: string | null;
          token_identifier: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          company_id?: string | null;
          role_id?: string | null;
          user_id?: string | null;
          token_identifier?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          name?: string | null;
          avatar_url?: string | null;
          company_id?: string | null;
          role_id?: string | null;
          user_id?: string | null;
          token_identifier?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          base_price: number;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string | null;
          base_price: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string | null;
          base_price?: number;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          sku: string | null;
          price_adjustment: number;
          inventory_count: number | null;
          attributes: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          sku?: string | null;
          price_adjustment?: number;
          inventory_count?: number | null;
          attributes?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          sku?: string | null;
          price_adjustment?: number;
          inventory_count?: number | null;
          attributes?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: Json | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          address?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          address?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          company_id: string;
          customer_id: string;
          user_id: string;
          status: string;
          total_amount: number;
          setup_fee: number;
          expiry_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          customer_id: string;
          user_id: string;
          status?: string;
          total_amount?: number;
          setup_fee?: number;
          expiry_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          customer_id?: string;
          user_id?: string;
          status?: string;
          total_amount?: number;
          setup_fee?: number;
          expiry_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quote_items: {
        Row: {
          id: string;
          quote_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          unit_price: number;
          customizations: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity?: number;
          unit_price: number;
          customizations?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quote_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          unit_price?: number;
          customizations?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          company_id: string;
          customer_id: string;
          user_id: string;
          quote_id: string | null;
          status: string;
          total_amount: number;
          payment_status: string;
          shipping_address: Json | null;
          shipping_method: string | null;
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          customer_id: string;
          user_id: string;
          quote_id?: string | null;
          status?: string;
          total_amount: number;
          payment_status?: string;
          shipping_address?: Json | null;
          shipping_method?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          customer_id?: string;
          user_id?: string;
          quote_id?: string | null;
          status?: string;
          total_amount?: number;
          payment_status?: string;
          shipping_address?: Json | null;
          shipping_method?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      line_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          quantity: number;
          unit_price: number;
          customizations: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variant_id?: string | null;
          quantity?: number;
          unit_price: number;
          customizations?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          variant_id?: string | null;
          quantity?: number;
          unit_price?: number;
          customizations?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          company_id: string;
          order_id: string;
          line_item_id: string | null;
          assigned_to: string | null;
          task_type: string;
          status: string;
          priority: string;
          due_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          order_id: string;
          line_item_id?: string | null;
          assigned_to?: string | null;
          task_type: string;
          status?: string;
          priority?: string;
          due_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          order_id?: string;
          line_item_id?: string | null;
          assigned_to?: string | null;
          task_type?: string;
          status?: string;
          priority?: string;
          due_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          company_id: string;
          sender_id: string;
          recipient_id: string | null;
          order_id: string | null;
          quote_id: string | null;
          task_id: string | null;
          content: string;
          is_read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          sender_id: string;
          recipient_id?: string | null;
          order_id?: string | null;
          quote_id?: string | null;
          task_id?: string | null;
          content: string;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          sender_id?: string;
          recipient_id?: string | null;
          order_id?: string | null;
          quote_id?: string | null;
          task_id?: string | null;
          content?: string;
          is_read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          theme: Json | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          theme?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          theme?: Json | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      store_products: {
        Row: {
          id: string;
          store_id: string;
          product_id: string;
          is_featured: boolean;
          display_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          product_id: string;
          is_featured?: boolean;
          display_order?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          product_id?: string;
          is_featured?: boolean;
          display_order?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      decoration_techniques: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          is_active: boolean;
          setup_fee: number;
          minimum_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string | null;
          is_active?: boolean;
          setup_fee?: number;
          minimum_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string | null;
          is_active?: boolean;
          setup_fee?: number;
          minimum_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      screen_printing: {
        Row: {
          id: string;
          technique_id: string;
          ink_type: string;
          ink_color: string | null;
          ink_opacity: string | null;
          cure_temperature: number | null;
          flash_required: boolean;
          mesh_count: number | null;
          frame_type: string | null;
          frame_size: string | null;
          max_colors: number;
          print_order: number | null;
          squeegee_type: string | null;
          squeegee_durometer: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          technique_id: string;
          ink_type: string;
          ink_color?: string | null;
          ink_opacity?: string | null;
          cure_temperature?: number | null;
          flash_required?: boolean;
          mesh_count?: number | null;
          frame_type?: string | null;
          frame_size?: string | null;
          max_colors?: number;
          print_order?: number | null;
          squeegee_type?: string | null;
          squeegee_durometer?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          technique_id?: string;
          ink_type?: string;
          ink_color?: string | null;
          ink_opacity?: string | null;
          cure_temperature?: number | null;
          flash_required?: boolean;
          mesh_count?: number | null;
          frame_type?: string | null;
          frame_size?: string | null;
          max_colors?: number;
          print_order?: number | null;
          squeegee_type?: string | null;
          squeegee_durometer?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      embroidery: {
        Row: {
          id: string;
          technique_id: string;
          thread_type: string;
          thread_weight: string | null;
          thread_brand: string | null;
          thread_color: string | null;
          stitch_type: string | null;
          stitch_density: number | null;
          stitch_count: number | null;
          underlay_type: string | null;
          backing_type: string | null;
          backing_weight: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          technique_id: string;
          thread_type: string;
          thread_weight?: string | null;
          thread_brand?: string | null;
          thread_color?: string | null;
          stitch_type?: string | null;
          stitch_density?: number | null;
          stitch_count?: number | null;
          underlay_type?: string | null;
          backing_type?: string | null;
          backing_weight?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          technique_id?: string;
          thread_type?: string;
          thread_weight?: string | null;
          thread_brand?: string | null;
          thread_color?: string | null;
          stitch_type?: string | null;
          stitch_density?: number | null;
          stitch_count?: number | null;
          underlay_type?: string | null;
          backing_type?: string | null;
          backing_weight?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      dtg: {
        Row: {
          id: string;
          technique_id: string;
          pretreatment_required: boolean;
          pretreatment_type: string | null;
          pretreatment_method: string | null;
          resolution: number | null;
          color_profile: string | null;
          white_underbase: boolean;
          white_highlight: boolean;
          cure_temperature: number | null;
          cure_time: number | null;
          cure_method: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          technique_id: string;
          pretreatment_required?: boolean;
          pretreatment_type?: string | null;
          pretreatment_method?: string | null;
          resolution?: number | null;
          color_profile?: string | null;
          white_underbase?: boolean;
          white_highlight?: boolean;
          cure_temperature?: number | null;
          cure_time?: number | null;
          cure_method?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          technique_id?: string;
          pretreatment_required?: boolean;
          pretreatment_type?: string | null;
          pretreatment_method?: string | null;
          resolution?: number | null;
          color_profile?: string | null;
          white_underbase?: boolean;
          white_highlight?: boolean;
          cure_temperature?: number | null;
          cure_time?: number | null;
          cure_method?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      vinyl: {
        Row: {
          id: string;
          technique_id: string;
          material_type: string;
          material_color: string | null;
          material_brand: string | null;
          cutting_force: number | null;
          cutting_speed: number | null;
          blade_depth: number | null;
          application_temperature: number | null;
          application_pressure: string | null;
          application_time: number | null;
          peel_type: string | null;
          multi_layer: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          technique_id: string;
          material_type: string;
          material_color?: string | null;
          material_brand?: string | null;
          cutting_force?: number | null;
          cutting_speed?: number | null;
          blade_depth?: number | null;
          application_temperature?: number | null;
          application_pressure?: string | null;
          application_time?: number | null;
          peel_type?: string | null;
          multi_layer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          technique_id?: string;
          material_type?: string;
          material_color?: string | null;
          material_brand?: string | null;
          cutting_force?: number | null;
          cutting_speed?: number | null;
          blade_depth?: number | null;
          application_temperature?: number | null;
          application_pressure?: string | null;
          application_time?: number | null;
          peel_type?: string | null;
          multi_layer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      decoration_placements: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          description: string | null;
          max_width: number | null;
          max_height: number | null;
          position_x: number | null;
          position_y: number | null;
          reference_point: string | null;
          garment_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          description?: string | null;
          max_width?: number | null;
          max_height?: number | null;
          position_x?: number | null;
          position_y?: number | null;
          reference_point?: string | null;
          garment_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          name?: string;
          description?: string | null;
          max_width?: number | null;
          max_height?: number | null;
          position_x?: number | null;
          position_y?: number | null;
          reference_point?: string | null;
          garment_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      decoration_upcharges: {
        Row: {
          id: string;
          company_id: string;
          technique_id: string;
          name: string;
          description: string | null;
          upcharge_type: string;
          upcharge_amount: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          technique_id: string;
          name: string;
          description?: string | null;
          upcharge_type: string;
          upcharge_amount: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          technique_id?: string;
          name?: string;
          description?: string | null;
          upcharge_type?: string;
          upcharge_amount?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      line_item_decorations: {
        Row: {
          id: string;
          line_item_id: string;
          technique_id: string;
          placement_id: string;
          artwork_id: string | null;
          colors_count: number | null;
          width: number | null;
          height: number | null;
          notes: string | null;
          price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          line_item_id: string;
          technique_id: string;
          placement_id: string;
          artwork_id?: string | null;
          colors_count?: number | null;
          width?: number | null;
          height?: number | null;
          notes?: string | null;
          price?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          line_item_id?: string;
          technique_id?: string;
          placement_id?: string;
          artwork_id?: string | null;
          colors_count?: number | null;
          width?: number | null;
          height?: number | null;
          notes?: string | null;
          price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
