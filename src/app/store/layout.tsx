import { ThemeProvider } from "@/components/theme-provider";
import StoreNavbar from "@/components/store/navbar";
import StoreFooter from "@/components/store/footer";
import { Sidebar } from "@/components/sidebar";

import { createClient } from "../../../supabase/server";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get user session - no redirect needed as store is public
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreNavbar />
      <div className="flex flex-1">
        {user && (
          <div className="hidden md:block">
            <Sidebar variant="store" />
          </div>
        )}
        <main className="flex-1">{children}</main>
      </div>
      <StoreFooter />
    </div>
  );
}
