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

export default async function OrdersPage() {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user's company and role information
  const userInfo = await getUserCompanyAndRole(user!.id);

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

  // Get status badge color based on order status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status badge color
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Orders
          </h1>
          <p className="text-muted-foreground">Manage your customer orders</p>
        </div>
        <Link href="/admin/orders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive border border-destructive/20">
          <p>Error loading orders: {error.message}</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!orders || orders.length === 0 ? (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No orders found</CardTitle>
              <CardDescription>
                Get started by creating your first order
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          orders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`}>
              <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md bg-card text-card-foreground">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="truncate">
                      Order #{order.id.substring(0, 8)}
                    </CardTitle>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status}
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
                      <span className="text-sm font-medium">Payment:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}
                      >
                        {order.payment_status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Company:</span>
                      <span className="text-sm">
                        {(order.companies as any)?.name || "Unknown"}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(order.created_at).toLocaleDateString()}
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
