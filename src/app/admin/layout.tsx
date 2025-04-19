import { Sidebar } from "@/components/sidebar";
import AdminNavbar from "@/components/admin/navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { ThemeProvider } from "@/components/theme-provider";
import { getUserCompanyAndRole } from "@/utils/auth";

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

  // Get user's company and role information
  const userInfo = await getUserCompanyAndRole(user.id);

  // If no role or not admin role, redirect to store
  if (
    !userInfo ||
    (userInfo.roleName !== "admin" && userInfo.roleName !== "owner")
  ) {
    return redirect("/store");
  }

  // If user is not an owner and doesn't have a company assigned, redirect to store
  // Owners can access the admin panel without a company (they can manage all companies)
  if (userInfo.roleName !== "owner" && !userInfo.companyId) {
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
