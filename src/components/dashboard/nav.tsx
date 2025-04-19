"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Building,
  ClipboardList,
  FileText,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Workflow,
} from "lucide-react";

interface NavProps {
  links: {
    title: string;
    label?: string;
    icon: React.ReactNode;
    variant: "default" | "ghost";
    href: string;
    color?: string;
  }[];
}

export function Nav({ links }: NavProps) {
  const pathname = usePathname();

  return (
    <div className="group flex flex-col gap-4 py-2">
      <nav className="grid gap-1 px-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === link.href
                ? "bg-accent text-accent-foreground"
                : "transparent",
              link.variant === "default" && "bg-accent text-accent-foreground",
            )}
          >
            <span className={cn("h-5 w-5", link.color)}>{link.icon}</span>
            <span>{link.title}</span>
            {link.label && (
              <span className="ml-auto text-xs">{link.label}</span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function SidebarNav() {
  const links = [
    {
      title: "Overview",
      icon: <Home className="h-5 w-5" />,
      href: "/admin",
      variant: "ghost" as const,
      color: "text-sky-500",
    },
    {
      title: "Customers",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/customers",
      variant: "ghost" as const,
      color: "text-violet-500",
    },
    {
      title: "Companies",
      icon: <Building className="h-5 w-5" />,
      href: "/admin/companies",
      variant: "ghost" as const,
      color: "text-indigo-500",
    },
    {
      title: "Products",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/products",
      variant: "ghost" as const,
      color: "text-orange-500",
    },
    {
      title: "Quotes",
      icon: <FileText className="h-5 w-5" />,
      href: "/admin/quotes",
      variant: "ghost" as const,
      color: "text-emerald-500",
    },
    {
      title: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/admin/orders",
      variant: "ghost" as const,
      color: "text-blue-500",
    },
    {
      title: "Tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      href: "/admin/tasks",
      variant: "ghost" as const,
      color: "text-red-500",
    },
    {
      title: "Production",
      icon: <Workflow className="h-5 w-5" />,
      href: "/admin/production",
      variant: "ghost" as const,
      color: "text-yellow-500",
    },
    {
      title: "Reports",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/admin/reports",
      variant: "ghost" as const,
      color: "text-pink-500",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      variant: "ghost" as const,
      color: "text-gray-500",
    },
    {
      title: "Store",
      icon: <ShoppingCart className="h-5 w-5" />,
      href: "/store",
      variant: "ghost" as const,
      color: "text-green-500",
    },
  ];

  return <Nav links={links} />;
}
