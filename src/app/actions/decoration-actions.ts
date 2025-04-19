"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { decorationDetailsJsonSchema, decorationTechniqueSchema } from "@/lib/validations/decoration-schemas";
import { validateDecorationDetails } from "@/lib/validations/validate-decoration-details";
import { z } from "zod";

// Helper function to encode redirect with a message
function encodedRedirect(type: "success" | "error", path: string, message: string) {
  const params = new URLSearchParams();
  params.set(type, message);
  return redirect(`${path}?${params.toString()}`);
}

// Create a new decoration technique
export async function createDecorationTechniqueAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const setup_fee = parseFloat(formData.get("setup_fee") as string || "0");
  const minimum_order = parseInt(formData.get("minimum_order") as string || "1");
  const is_active = formData.get("is_active") === "on";

  // Validate the input data
  const validationResult = decorationTechniqueSchema.safeParse({
    name,
    description,
    setup_fee,
    minimum_order,
    is_active,
  });

  if (!validationResult.success) {
    const errors = validationResult.error.format();
    return { error: "Validation failed", details: errors };
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("decoration_techniques")
      .insert([validationResult.data])
      .select();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/decorations");
    return encodedRedirect(
      "success",
      "/dashboard/decorations",
      "Decoration technique created successfully"
    );
  } catch (error: any) {
    return { error: error.message || "Failed to create decoration technique" };
  }
}

// Update a line item with decoration details
export async function updateLineItemDecorationAction(lineItemId: string, decorationDetails: unknown) {
  // Validate the decoration details
  const validation = validateDecorationDetails(decorationDetails);
  
  if (!validation.isValid) {
    return { error: "Invalid decoration details", details: validation.errors };
  }

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("line_item")
      .update({ decoration_details: validation.data })
      .eq("id", lineItemId)
      .select();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/dashboard/orders");
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to update decoration details" };
  }
}

// Get decoration techniques
export async function getDecorationTechniquesAction() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("decoration_techniques")
      .select("*")
      .order("name");

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch decoration techniques" };
  }
}

// Get decoration placements
export async function getDecorationPlacementsAction() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("decoration_placements")
      .select("*")
      .order("name");

    if (error) {
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "Failed to fetch decoration placements" };
  }
}
