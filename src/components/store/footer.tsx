import Link from "next/link";
import { Twitter, Linkedin, Github, Instagram, Facebook } from "lucide-react";

export default function StoreFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Shop Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/store/products"
                  className="text-gray-600 hover:text-blue-600"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/store/products/t-shirts"
                  className="text-gray-600 hover:text-blue-600"
                >
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/store/products/hoodies"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  href="/store/products/hats"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Hats
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/store/custom"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Custom Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/store/team-stores"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Team Stores
                </Link>
              </li>
              <li>
                <Link
                  href="/store/bulk-orders"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/store/design-services"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Design Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/store/about"
                  className="text-gray-600 hover:text-blue-600"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/store/contact"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/store/blog"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/store/careers"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/store/faq"
                  className="text-gray-600 hover:text-blue-600"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/store/shipping"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/store/returns"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/store/privacy"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
          <div className="text-gray-600 mb-4 md:mb-0">
            © {currentYear} Kingtavo. All rights reserved.
          </div>

          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">LinkedIn</span>
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
