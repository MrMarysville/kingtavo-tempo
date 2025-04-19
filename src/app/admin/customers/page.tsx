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
import { getUserCompanyAndRole } from "@/utils/auth";

export default async function CustomersPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user's company and role information
  const userInfo = await getUserCompanyAndRole(user!.id);

  // Fetch customers based on user role and company
  let customersQuery = supabase
    .from("customers")
    .select("*, companies(name)")
    .order("created_at", { ascending: false });

  // If not an owner, only show customers from the user's company
  if (userInfo?.roleName !== "owner" && userInfo?.companyId) {
    customersQuery = customersQuery.eq("company_id", userInfo.companyId);
  }

  const { data: customers, error } = await customersQuery;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Link href="/admin/customers/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          <p>Error loading customers: {error.message}</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!customers || customers.length === 0 ? (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No customers found</CardTitle>
              <CardDescription>
                Get started by creating your first customer
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          customers.map((customer) => (
            <Link key={customer.id} href={`/admin/customers/${customer.id}`}>
              <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle>{customer.name}</CardTitle>
                  <CardDescription>
                    {(customer.companies as any)?.name || "No company"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {customer.email && (
                      <p className="text-sm">
                        <span className="font-medium">Email:</span>{" "}
                        {customer.email}
                      </p>
                    )}
                    {customer.phone && (
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span>{" "}
                        {customer.phone}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Created:{" "}
                      {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
