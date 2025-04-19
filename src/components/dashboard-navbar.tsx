"use client";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Search, UserCircle } from "lucide-react";
import Link from "next/link";
import UserProfile from "./user-profile";
import { Input } from "./ui/input";

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2 md:hidden">
          <Sidebar />
        </div>
        <div className="hidden md:flex md:flex-1">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">Kingtavo</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 md:ml-8">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-primary"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/customers"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Customers
            </Link>
            <Link
              href="/dashboard/products"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Products
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:flex items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px] pl-8 rounded-md bg-background"
            />
          </div>
          <ThemeSwitcher />
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
