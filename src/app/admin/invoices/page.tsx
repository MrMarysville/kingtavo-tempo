import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Receipt } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../supabase/server";
import { getUserCompanyAndRole } from "@/utils/auth";

import { redirect } from "next/navigation";

export default async function InvoicesPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect if user is not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  // Get user's company and role information
  const userInfo = await getUserCompanyAndRole(user.id);

  // Fetch orders based on user role and company
  let ordersQuery = supabase
    .from("orders")
    .select("*, companies(name), customers(name)")
    .order("created_at", { ascending: false });

  // If not an owner, only show orders from the user's company
  if (userInfo?.roleName !== "owner" && userInfo?.companyId) {
    ordersQuery = ordersQuery.eq("company_id", userInfo.companyId);
  }

  const { data: orders, error } = await ordersQuery;

  // Get payment status badge color
  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Invoices
          </h1>
          <p className="text-muted-foreground">Manage customer invoices</p>
        </div>
        <Link href="/admin/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive border border-destructive/20">
          <p>Error loading invoices: {error.message}</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!orders || orders.length === 0 ? (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No invoices found</CardTitle>
              <CardDescription>
                Get started by creating your first invoice
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          orders.map((order) => (
            <Link key={order.id} href={`/admin/invoices/${order.id}`}>
              <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md bg-card text-card-foreground">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="truncate">
                      Invoice #{order.id.substring(0, 8).toUpperCase()}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}
                    >
                      {order.payment_status}
                    </span>
                  </div>
                  <CardDescription>
                    {(order.customers as any)?.name || "Unknown Customer"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Amount:</span>
                      <span className="font-bold">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Date:</span>
                      <span className="text-sm">
                        {formatDate(order.created_at)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Due Date:</span>
                      <span className="text-sm">
                        {order.due_date
                          ? formatDate(order.due_date)
                          : "On receipt"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Company:</span>
                      <span className="text-sm">
                        {(order.companies as any)?.name || "Unknown"}
                      </span>
                    </div>
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
