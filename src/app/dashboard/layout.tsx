import { Sidebar } from "@/components/sidebar";
import DashboardNavbar from "@/components/dashboard-navbar";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { ThemeProvider } from "@/components/theme-provider";
import { getUserCompanyAndRole } from "@/utils/auth";

export default async function DashboardLayout({
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

  // Users must have a company assigned to access the dashboard
  if (!userInfo || !userInfo.companyId) {
    return redirect("/store");
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />
      <div className="flex">
        <div className="hidden md:block">
          <Sidebar variant="dashboard" />
        </div>
        <main className="flex-1 p-6 bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
