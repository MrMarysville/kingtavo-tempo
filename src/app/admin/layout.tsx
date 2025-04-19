import { Sidebar } from "@/components/sidebar";
import AdminNavbar from "@/components/admin/navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { ThemeProvider } from "@/components/theme-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user has admin role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role_id, roles(name)")
    .eq("id", user.id)
    .single();

  // If no role or not admin role, redirect to store
  if (
    userError ||
    !userData ||
    (userData.roles?.name !== "admin" && userData.roles?.name !== "owner")
  ) {
    return redirect("/store");
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar variant="admin" />
        </div>
        <main className="flex-1 p-6 bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
