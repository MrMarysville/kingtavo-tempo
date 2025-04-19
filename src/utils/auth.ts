import { createClient } from "../../supabase/server";

/**
 * Check if a user has a specific role
 * @param userId The user ID to check
 * @param roleName The role name to check for (e.g., 'admin', 'owner')
 * @returns Boolean indicating if the user has the specified role
 */
export async function hasRole(
  userId: string,
  roleName: string,
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("roles(name)")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return false;
  }

  return data.roles?.name === roleName;
}

/**
 * Check if a user belongs to a specific company
 * @param userId The user ID to check
 * @param companyId The company ID to check for
 * @returns Boolean indicating if the user belongs to the specified company
 */
export async function belongsToCompany(
  userId: string,
  companyId: string,
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", userId)
    .eq("company_id", companyId)
    .single();

  return !error && !!data;
}

/**
 * Get user's role information
 * @param userId The user ID to get role for
 * @returns Object containing role information or null if not found
 */
export async function getUserRole(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("role_id, roles(name, permissions)")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.roles;
}
