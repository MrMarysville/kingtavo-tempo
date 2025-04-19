import { SidebarNav } from "@/components/dashboard/nav";
import { Header } from "@/components/dashboard/header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <ScrollArea className="h-full py-6">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Dashboard
              </h2>
              <SidebarNav />
            </div>
          </ScrollArea>
        </aside>
        <div className="flex-1 md:border-l">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-4"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <ScrollArea className="h-full py-6">
                  <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                      Dashboard
                    </h2>
                    <SidebarNav />
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
