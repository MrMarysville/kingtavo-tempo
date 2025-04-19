import Link from "next/link";
import { createClient } from "../../../supabase/server";
import { Button } from "../ui/button";
import { Menu, ShoppingCart, User } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ThemeSwitcher } from "../theme-switcher";

export default async function StoreNavbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 md:hidden">
          <Sidebar variant="store" />
        </div>
        <Link href="/store" prefetch className="text-xl font-bold">
          Kingtavo
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link
            href="/store/products"
            className="text-gray-700 hover:text-gray-900"
          >
            Products
          </Link>
          <Link
            href="/store/custom"
            className="text-gray-700 hover:text-gray-900"
          >
            Custom Orders
          </Link>
          <Link
            href="/store/about"
            className="text-gray-700 hover:text-gray-900"
          >
            About Us
          </Link>
          <Link
            href="/store/contact"
            className="text-gray-700 hover:text-gray-900"
          >
            Contact
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/store/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          <ThemeSwitcher />

          {user ? (
            <Link href="/store/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
