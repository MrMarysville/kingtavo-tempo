"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Building,
  ClipboardList,
  FileText,
  Home,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Workflow,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const routes = [
    {
      label: "Overview",
      icon: <Home className="mr-2 h-4 w-4" />,
      href: "/admin",
      color: "text-sky-500",
    },
    {
      label: "Customers",
      icon: <Users className="mr-2 h-4 w-4" />,
      href: "/admin/customers",
      color: "text-violet-500",
    },
    {
      label: "Companies",
      icon: <Building className="mr-2 h-4 w-4" />,
      href: "/admin/companies",
      color: "text-indigo-500",
    },
    {
      label: "Products",
      icon: <Package className="mr-2 h-4 w-4" />,
      href: "/admin/products",
      color: "text-orange-500",
    },
    {
      label: "Quotes",
      icon: <FileText className="mr-2 h-4 w-4" />,
      href: "/admin/quotes",
      color: "text-emerald-500",
    },
    {
      label: "Orders",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
      href: "/admin/orders",
      color: "text-blue-500",
    },
    {
      label: "Tasks",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
      href: "/admin/tasks",
      color: "text-red-500",
    },
    {
      label: "Production",
      icon: <Workflow className="mr-2 h-4 w-4" />,
      href: "/admin/production",
      color: "text-yellow-500",
    },
    {
      label: "Reports",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
      href: "/admin/reports",
      color: "text-pink-500",
    },
    {
      label: "Settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      href: "/admin/settings",
      color: "text-gray-500",
    },
    {
      label: "Store",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
      href: "/store",
      color: "text-green-500",
    },
  ];

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b px-6 py-4">
              <Link href="/admin" className="flex items-center">
                <span className="text-xl font-bold">Kingtavo Admin</span>
              </Link>
            </div>
            <ScrollArea className="flex-1 px-2 py-4">
              <div className="flex flex-col gap-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsSheetOpen(false)}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === route.href
                        ? "bg-accent text-accent-foreground"
                        : "transparent",
                    )}
                  >
                    <span className={cn("mr-2 h-4 w-4", route.color)}>
                      {route.icon}
                    </span>
                    {route.label}
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "hidden border-r bg-card md:flex md:w-64 md:flex-col",
          className,
        )}
      >
        <div className="border-b px-6 py-4">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold">Kingtavo Admin</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-2 py-4">
          <div className="flex flex-col gap-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent",
                )}
              >
                <span className={cn("mr-2 h-4 w-4", route.color)}>
                  {route.icon}
                </span>
                {route.label}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
