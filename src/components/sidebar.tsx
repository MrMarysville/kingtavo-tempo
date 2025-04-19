"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Building,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  Home,
  Menu,
  Package,
  PanelLeft,
  PanelLeftClose,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
  Workflow,
} from "lucide-react";

interface NavItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  color?: string;
  isActive: boolean;
  subItems?: Array<{ label: string; href: string }>;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem = ({
  label,
  icon,
  href,
  color,
  isActive,
  subItems,
  isCollapsed,
  onClick,
}: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = subItems && subItems.length > 0;
  const pathname = usePathname();

  // Check if any subitems are active
  const isSubItemActive = hasSubItems
    ? subItems.some((item) => pathname === item.href)
    : false;

  // Expand submenu if a subitem is active
  useEffect(() => {
    if (isSubItemActive) {
      setIsOpen(true);
    }
  }, [isSubItemActive]);

  const handleClick = () => {
    if (hasSubItems) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div>
      {href && !hasSubItems ? (
        <Link
          href={href}
          onClick={onClick}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
            isActive || isSubItemActive
              ? "bg-accent text-accent-foreground"
              : "transparent",
          )}
        >
          <span className={cn("mr-2 h-4 w-4", color)}>{icon}</span>
          {!isCollapsed && <span className="truncate">{label}</span>}
          {hasSubItems && !isCollapsed && (
            <ChevronRight
              className={cn(
                "ml-auto h-4 w-4 transition-transform",
                isOpen && "rotate-90",
              )}
            />
          )}
        </Link>
      ) : (
        <div
          onClick={handleClick}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
            isActive || isSubItemActive
              ? "bg-accent text-accent-foreground"
              : "transparent",
          )}
        >
          <span className={cn("mr-2 h-4 w-4", color)}>{icon}</span>
          {!isCollapsed && <span className="truncate">{label}</span>}
          {hasSubItems && !isCollapsed && (
            <ChevronDown
              className={cn(
                "ml-auto h-4 w-4 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          )}
        </div>
      )}

      {/* Submenu */}
      {hasSubItems && !isCollapsed && isOpen && (
        <div className="ml-6 mt-1 space-y-1">
          {subItems.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              onClick={onClick}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === subItem.href
                  ? "bg-accent/50 text-accent-foreground"
                  : "transparent",
              )}
            >
              <span className="h-1 w-1 rounded-full bg-current mr-2" />
              <span className="truncate">{subItem.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
  variant?: "admin" | "dashboard" | "store";
}

export function Sidebar({
  className,
  isOpen,
  onClose,
  variant = "admin",
}: SidebarProps) {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Check if we're in the browser and if there's a saved preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebarCollapsed");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Define routes based on variant
  const getRoutes = () => {
    const adminRoutes = [
      {
        label: "Overview",
        icon: <Home className="h-4 w-4" />,
        href: "/admin",
        color: "text-sky-500",
      },
      {
        label: "Customers",
        icon: <Users className="h-4 w-4" />,
        href: "/admin/customers",
        color: "text-violet-500",
        subItems: [
          { label: "All Customers", href: "/admin/customers" },
          { label: "Add Customer", href: "/admin/customers/new" },
        ],
      },
      {
        label: "Companies",
        icon: <Building className="h-4 w-4" />,
        href: "/admin/companies",
        color: "text-indigo-500",
        subItems: [
          { label: "All Companies", href: "/admin/companies" },
          { label: "Add Company", href: "/admin/companies/new" },
        ],
      },
      {
        label: "Products",
        icon: <Package className="h-4 w-4" />,
        href: "/admin/products",
        color: "text-orange-500",
        subItems: [
          { label: "All Products", href: "/admin/products" },
          { label: "Add Product", href: "/admin/products/new" },
          { label: "Categories", href: "/admin/products/categories" },
        ],
      },
      {
        label: "Quotes",
        icon: <FileText className="h-4 w-4" />,
        href: "/admin/quotes",
        color: "text-emerald-500",
      },
      {
        label: "Orders",
        icon: <ShoppingCart className="h-4 w-4" />,
        href: "/admin/orders",
        color: "text-blue-500",
        subItems: [
          { label: "All Orders", href: "/admin/orders" },
          { label: "Create Order", href: "/admin/orders/new" },
        ],
      },
      {
        label: "Invoices",
        icon: <Receipt className="h-4 w-4" />,
        href: "/admin/invoices",
        color: "text-purple-500",
        subItems: [
          { label: "All Invoices", href: "/admin/invoices" },
          { label: "Create Invoice", href: "/admin/invoices/new" },
        ],
      },
      {
        label: "Tasks",
        icon: <ClipboardList className="h-4 w-4" />,
        href: "/admin/tasks",
        color: "text-red-500",
        subItems: [
          { label: "Kanban Board", href: "/admin/tasks" },
          { label: "Create Task", href: "/admin/tasks/new" },
        ],
      },
      {
        label: "Production",
        icon: <Workflow className="h-4 w-4" />,
        href: "/admin/production",
        color: "text-yellow-500",
      },
      {
        label: "Reports",
        icon: <BarChart3 className="h-4 w-4" />,
        href: "/admin/reports",
        color: "text-pink-500",
      },
      {
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
        href: "/admin/settings",
        color: "text-gray-500",
      },
      {
        label: "Store",
        icon: <ShoppingCart className="h-4 w-4" />,
        href: "/store",
        color: "text-green-500",
      },
    ];

    const dashboardRoutes = [
      {
        label: "Overview",
        icon: <Home className="h-4 w-4" />,
        href: "/dashboard",
        color: "text-sky-500",
      },
      {
        label: "Customers",
        icon: <Users className="h-4 w-4" />,
        href: "/dashboard/customers",
        color: "text-violet-500",
        subItems: [
          { label: "All Customers", href: "/dashboard/customers" },
          { label: "Add Customer", href: "/dashboard/customers/new" },
        ],
      },
      {
        label: "Products",
        icon: <Package className="h-4 w-4" />,
        href: "/dashboard/products",
        color: "text-orange-500",
        subItems: [
          { label: "All Products", href: "/dashboard/products" },
          { label: "Add Product", href: "/dashboard/products/new" },
        ],
      },
      {
        label: "Orders",
        icon: <ShoppingCart className="h-4 w-4" />,
        href: "/dashboard/orders",
        color: "text-blue-500",
      },
      {
        label: "Tasks",
        icon: <ClipboardList className="h-4 w-4" />,
        href: "/dashboard/tasks",
        color: "text-red-500",
        subItems: [
          { label: "Kanban Board", href: "/dashboard/tasks" },
          { label: "Create Task", href: "/dashboard/tasks/new" },
        ],
      },
      {
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
        href: "/dashboard/settings",
        color: "text-gray-500",
      },
    ];

    const storeRoutes = [
      {
        label: "Store Home",
        icon: <Home className="h-4 w-4" />,
        href: "/store",
        color: "text-sky-500",
      },
      {
        label: "Products",
        icon: <Package className="h-4 w-4" />,
        href: "/store/products",
        color: "text-orange-500",
      },
      {
        label: "Custom Orders",
        icon: <FileText className="h-4 w-4" />,
        href: "/store/custom",
        color: "text-emerald-500",
      },
      {
        label: "My Account",
        icon: <Users className="h-4 w-4" />,
        href: "/store/account",
        color: "text-violet-500",
        subItems: [
          { label: "Profile", href: "/store/account/profile" },
          { label: "Orders", href: "/store/account/orders" },
        ],
      },
      {
        label: "Admin",
        icon: <Settings className="h-4 w-4" />,
        href: "/admin",
        color: "text-gray-500",
      },
    ];

    switch (variant) {
      case "admin":
        return adminRoutes;
      case "dashboard":
        return dashboardRoutes;
      case "store":
        return storeRoutes;
      default:
        return adminRoutes;
    }
  };

  const routes = getRoutes();

  const getTitle = () => {
    switch (variant) {
      case "admin":
        return "Kingtavo Admin";
      case "dashboard":
        return "Kingtavo";
      case "store":
        return "Kingtavo Store";
      default:
        return "Kingtavo";
    }
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b px-6 py-4">
              <Link href={`/${variant}`} className="flex items-center">
                <span className="text-xl font-bold">{getTitle()}</span>
              </Link>
            </div>
            <ScrollArea className="flex-1 px-2 py-4">
              <div className="flex flex-col gap-1">
                {routes.map((route, index) => (
                  <NavItem
                    key={index}
                    label={route.label}
                    icon={route.icon}
                    href={route.subItems ? undefined : route.href}
                    color={route.color}
                    isActive={pathname === route.href}
                    subItems={route.subItems}
                    isCollapsed={false}
                    onClick={() => setIsSheetOpen(false)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden border-r bg-card md:flex md:flex-col transition-all duration-300",
          isCollapsed ? "md:w-16" : "md:w-64",
          className,
        )}
      >
        <div className={cn("border-b py-4", isCollapsed ? "px-3" : "px-6")}>
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <Link href={`/${variant}`} className="flex items-center">
                <span className="text-xl font-bold">{getTitle()}</span>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn("h-8 w-8", isCollapsed && "mx-auto")}
            >
              {isCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1 px-2 py-4">
          <div className="flex flex-col gap-1">
            {routes.map((route, index) => (
              <NavItem
                key={index}
                label={route.label}
                icon={route.icon}
                href={route.subItems ? undefined : route.href}
                color={route.color}
                isActive={pathname === route.href}
                subItems={route.subItems}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
