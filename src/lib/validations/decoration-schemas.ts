import { z } from 'zod';

// Common validation schemas
export const colorSchema = z.string().min(1, "Color is required");
export const dimensionSchema = z.number().positive("Dimension must be positive");
export const temperatureSchema = z.number().min(0, "Temperature must be non-negative");
export const countSchema = z.number().int().min(1, "Count must be at least 1");

// New detailed color schema for specific systems like Pantone or thread charts
export const detailedColorSchema = z.object({
  value: z.string().min(1, "Color value is required"),
  system: z.enum([
    "Pantone", 
    "RGB", 
    "HEX", 
    "CMYK", 
    "Madeira Polyneon", 
    "Madeira Classic Rayon", 
    "Isacord Polyester", 
    "Robison-Anton Polyester", 
    "Custom" // For any other non-standard system or custom mix
  ], {
    errorMap: () => ({ message: "Invalid color system" }),
  }),
  description: z.string().optional(), // Optional description or name
});

// New measurement schema including units
export const measurementSchema = z.object({
  value: z.number().positive("Measurement value must be positive"),
  unit: z.enum(["in", "cm", "mm"], {
    errorMap: () => ({ message: "Invalid unit of measurement" }),
  }),
});

// Base decoration technique schema
export const decorationTechniqueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
  setup_fee: z.number().min(0, "Setup fee must be non-negative").default(0),
  minimum_order: z.number().int().min(1, "Minimum order must be at least 1").default(1),
});

// Screen Printing specific schema
export const screenPrintingSchema = z.object({
  ink_type: z.enum(["plastisol", "water-based", "discharge", "specialty"], {
    errorMap: () => ({ message: "Invalid ink type" }),
  }),
  ink_color: detailedColorSchema.optional(),
  ink_opacity: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Invalid opacity level" }),
  }).optional(),
  cure_temperature: temperatureSchema.optional(),
  flash_required: z.boolean().default(false),
  mesh_count: z.number().int().positive("Mesh count must be positive").optional(),
  frame_type: z.enum(["wood", "aluminum", "roller"], {
    errorMap: () => ({ message: "Invalid frame type" }),
  }).optional(),
  frame_size: z.string().optional(),
  max_colors: countSchema.default(1),
  print_order: z.number().int().min(0, "Print order must be non-negative").optional(),
  squeegee_type: z.string().optional(),
  squeegee_durometer: z.number().int().min(50, "Durometer must be at least 50").max(90, "Durometer must be at most 90").optional(),
});

// Embroidery specific schema
export const embroiderySchema = z.object({
  thread_type: z.enum(["polyester", "rayon", "metallic", "wool", "cotton"], {
    errorMap: () => ({ message: "Invalid thread type" }),
  }),
  thread_weight: z.string().optional(),
  thread_brand: z.string().optional(),
  thread_color: detailedColorSchema.optional(),
  stitch_type: z.enum(["satin", "fill", "running", "tatami"], {
    errorMap: () => ({ message: "Invalid stitch type" }),
  }).optional(),
  stitch_density: z.number().positive("Stitch density must be positive").optional(),
  stitch_count: countSchema.optional(),
  underlay_type: z.string().optional(),
  backing_type: z.enum(["cut-away", "tear-away", "water-soluble"], {
    errorMap: () => ({ message: "Invalid backing type" }),
  }).optional(),
  backing_weight: z.enum(["light", "medium", "heavy"], {
    errorMap: () => ({ message: "Invalid backing weight" }),
  }).optional(),
});

// DTG specific schema
export const dtgSchema = z.object({
  pretreatment_required: z.boolean().default(false),
  pretreatment_type: z.string().optional(),
  pretreatment_method: z.enum(["spray", "dip", "roller"], {
    errorMap: () => ({ message: "Invalid pretreatment method" }),
  }).optional(),
  resolution: z.number().int().min(300, "Resolution must be at least 300 DPI").optional(),
  color_profile: z.string().optional(),
  white_underbase: z.boolean().default(false),
  white_highlight: z.boolean().default(false),
  cure_temperature: temperatureSchema.optional(),
  cure_time: z.number().int().positive("Cure time must be positive").optional(),
  cure_method: z.enum(["heat press", "tunnel dryer"], {
    errorMap: () => ({ message: "Invalid cure method" }),
  }).optional(),
});

// Vinyl specific schema
export const vinylSchema = z.object({
  material_type: z.enum(["standard", "glitter", "reflective", "flock", "sublimation"], {
    errorMap: () => ({ message: "Invalid material type" }),
  }),
  material_color: colorSchema.optional(),
  material_brand: z.string().optional(),
  cutting_force: z.number().int().positive("Cutting force must be positive").optional(),
  cutting_speed: z.number().int().positive("Cutting speed must be positive").optional(),
  blade_depth: z.number().positive("Blade depth must be positive").optional(),
  application_temperature: temperatureSchema.optional(),
  application_pressure: z.enum(["light", "medium", "firm"], {
    errorMap: () => ({ message: "Invalid application pressure" }),
  }).optional(),
  application_time: z.number().int().positive("Application time must be positive").optional(),
  peel_type: z.enum(["hot", "cold", "warm"], {
    errorMap: () => ({ message: "Invalid peel type" }),
  }).optional(),
  multi_layer: z.boolean().default(false),
});

// Decoration placement schema
export const decorationPlacementSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  max_width: measurementSchema.optional(),
  max_height: measurementSchema.optional(),
  position_x: z.number().optional(),
  position_y: z.number().optional(),
  reference_point: z.enum(["collar", "shoulder seam", "center", "bottom hem"], {
    errorMap: () => ({ message: "Invalid reference point" }),
  }).optional(),
  garment_type: z.enum(["tshirt", "hoodie", "hat", "polo", "jacket"], {
    errorMap: () => ({ message: "Invalid garment type" }),
  }).optional(),
});

// Decoration upcharge schema
export const decorationUpchargeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  upcharge_type: z.enum(["flat", "percentage", "per_color", "per_thousand_stitches"], {
    errorMap: () => ({ message: "Invalid upcharge type" }),
  }),
  upcharge_amount: z.number().positive("Upcharge amount must be positive"),
  is_active: z.boolean().default(true),
});

// Line item decoration schema
export const lineItemDecorationSchema = z.object({
  technique_id: z.string().uuid("Invalid technique ID"),
  placement_id: z.string().uuid("Invalid placement ID"),
  artwork_id: z.string().uuid("Invalid artwork ID").optional(),
  colors_count: countSchema.optional(),
  width: measurementSchema.optional(),
  height: measurementSchema.optional(),
  notes: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
});

// JSONB decoration details schema (for the decoration_details field in line_item table)
export const decorationDetailsJsonSchema = z.object({
  technique: z.enum(["screen_printing", "embroidery", "dtg", "vinyl"], {
    errorMap: () => ({ message: "Invalid decoration technique" }),
  }),
  placement: z.string().min(1, "Placement is required"),
  colors: z.array(detailedColorSchema).optional(),
  colors_count: countSchema.optional(),
  width: measurementSchema.optional(),
  height: measurementSchema.optional(),
  artwork_url: z.string().url("Invalid artwork URL").optional(),
  notes: z.string().optional(),
  
  // Technique-specific details
  screen_printing: screenPrintingSchema.optional(),
  embroidery: embroiderySchema.optional(),
  dtg: dtgSchema.optional(),
  vinyl: vinylSchema.optional(),
});

// Export types derived from the schemas
export type DecorationTechnique = z.infer<typeof decorationTechniqueSchema>;
export type ScreenPrinting = z.infer<typeof screenPrintingSchema>;
export type Embroidery = z.infer<typeof embroiderySchema>;
export type DTG = z.infer<typeof dtgSchema>;
export type Vinyl = z.infer<typeof vinylSchema>;
export type DecorationPlacement = z.infer<typeof decorationPlacementSchema>;
export type DecorationUpcharge = z.infer<typeof decorationUpchargeSchema>;
export type LineItemDecoration = z.infer<typeof lineItemDecorationSchema>;
export type DecorationDetailsJson = z.infer<typeof decorationDetailsJsonSchema>;
export type Measurement = z.infer<typeof measurementSchema>;
export type DetailedColor = z.infer<typeof detailedColorSchema>;
