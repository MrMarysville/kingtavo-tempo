import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../supabase/server";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from("products")
    .select("*, companies(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive border border-destructive/20">
          <p>Error loading products: {error.message}</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products?.length === 0 && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No products found</CardTitle>
              <CardDescription>
                Get started by creating your first product
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {products?.map((product) => (
          <Link key={product.id} href={`/admin/products/${product.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md bg-card text-card-foreground">
              <CardHeader className="pb-2">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>
                  {(product.companies as any)?.name || "No company"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-24 w-24 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-md bg-muted border border-input">
                      <span className="text-xl font-bold">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      ${parseFloat(product.base_price).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {product.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
