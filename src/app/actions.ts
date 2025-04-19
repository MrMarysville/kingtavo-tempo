"use server";

import { createClient } from "../../supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { revalidatePath } from "next/cache";
import { getUserCompanyId, hasCompanyAccess } from "@/utils/auth";

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return encodedRedirect("success", "/admin", "Successfully signed in");
}

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;
  const site_url = formData.get("site_url") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
      },
      emailRedirectTo: `${site_url}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return {
    message: "Check your email for a confirmation link",
  };
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const site_url = formData.get("site_url") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${site_url}/admin/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    message: "Check your email for a password reset link",
  };
}

export async function resetPasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return encodedRedirect("success", "/admin", "Your password has been reset");
}

export async function createCompanyAction(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const logo_url = formData.get("logo_url") as string;
  const primary_color = formData.get("primary_color") as string;
  const secondary_color = formData.get("secondary_color") as string;

  const supabase = await createClient();

  // Only owners can create companies
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("roles(name)")
    .eq("id", user.id)
    .single();

  if (!userData || userData.roles?.name !== "owner") {
    return { error: "Unauthorized: Only owners can create companies" };
  }

  const { data, error } = await supabase
    .from("companies")
    .insert({
      name,
      slug,
      logo_url: logo_url || null,
      primary_color: primary_color || null,
      secondary_color: secondary_color || null,
    })
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/companies");
  return encodedRedirect(
    "success",
    "/admin/companies",
    "Company created successfully",
  );
}

export async function createProductAction(formData: FormData) {
  const company_id = formData.get("company_id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const base_price = parseFloat(formData.get("base_price") as string);
  const image_url = formData.get("image_url") as string;
  const is_active = formData.get("is_active") === "on";

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check if user has access to this company
  const hasAccess = await hasCompanyAccess(user.id, company_id);
  if (!hasAccess) {
    return { error: "Unauthorized: You don't have access to this company" };
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      company_id,
      name,
      description: description || null,
      base_price,
      image_url: image_url || null,
      is_active,
    })
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/products");
  return encodedRedirect(
    "success",
    "/admin/products",
    "Product created successfully",
  );
}

export async function createCustomerAction(formData: FormData) {
  const company_id = formData.get("company_id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const notes = formData.get("notes") as string;

  const address = {
    street: formData.get("street") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zip: formData.get("zip") as string,
    country: formData.get("country") as string,
  };

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check if user has access to this company
  const hasAccess = await hasCompanyAccess(user.id, company_id);
  if (!hasAccess) {
    return { error: "Unauthorized: You don't have access to this company" };
  }

  const { data, error } = await supabase
    .from("customers")
    .insert({
      company_id,
      name,
      email: email || null,
      phone: phone || null,
      address,
      notes: notes || null,
    })
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/customers");
  return encodedRedirect(
    "success",
    "/admin/customers",
    "Customer created successfully",
  );
}

export async function createTaskAction(formData: FormData) {
  const company_id = formData.get("company_id") as string;
  const order_id = formData.get("order_id") as string;
  const task_type = formData.get("task_type") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const assigned_to = formData.get("assigned_to") as string;
  const due_date = formData.get("due_date") as string;
  const notes = formData.get("notes") as string;

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  // Check if user has access to this company
  const hasAccess = await hasCompanyAccess(user.id, company_id);
  if (!hasAccess) {
    return { error: "Unauthorized: You don't have access to this company" };
  }

  // If order_id is provided, verify it belongs to the same company
  if (order_id) {
    const { data: orderData } = await supabase
      .from("orders")
      .select("company_id")
      .eq("id", order_id)
      .single();

    if (!orderData || orderData.company_id !== company_id) {
      return {
        error: "Invalid order: Order does not belong to the selected company",
      };
    }
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      company_id,
      order_id,
      task_type,
      status,
      priority,
      assigned_to: assigned_to || null,
      due_date: due_date || null,
      notes: notes || null,
    })
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/tasks");
  return encodedRedirect(
    "success",
    "/admin/tasks",
    "Task created successfully",
  );
}
