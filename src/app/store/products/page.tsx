import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ProductsPage() {
  // Mock data for products
  const products = [
    {
      id: "1",
      name: "Basic T-Shirt",
      description: "100% cotton crew neck t-shirt",
      price: 19.99,
      image_url:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
      category: "t-shirts",
    },
    {
      id: "2",
      name: "Premium Hoodie",
      description: "Heavy-weight cotton blend hoodie",
      price: 49.99,
      image_url:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
      category: "hoodies",
    },
    {
      id: "3",
      name: "Embroidered Cap",
      description: "Structured 6-panel cap with embroidery",
      price: 24.99,
      image_url:
        "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80",
      category: "hats",
    },
    {
      id: "4",
      name: "Long Sleeve Tee",
      description: "Comfortable long sleeve t-shirt",
      price: 29.99,
      image_url:
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80",
      category: "t-shirts",
    },
    {
      id: "5",
      name: "Zip-Up Hoodie",
      description: "Full-zip hoodie with front pockets",
      price: 54.99,
      image_url:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80",
      category: "hoodies",
    },
    {
      id: "6",
      name: "Trucker Hat",
      description: "Mesh back trucker hat with patch",
      price: 22.99,
      image_url:
        "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=500&q=80",
      category: "hats",
    },
  ];

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Products" },
    { id: "t-shirts", name: "T-Shirts" },
    { id: "hoodies", name: "Hoodies" },
    { id: "hats", name: "Hats" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Min" className="text-sm" />
                  <Input type="number" placeholder="Max" className="text-sm" />
                </div>
              </div>

              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">All Products</h1>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/store/products/${product.id}`}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-lg font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    <Button size="sm">Add to Cart</Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
