import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  Mail,
  Printer,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../supabase/server";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Fetch the order (which serves as our invoice)
  const { data: order, error } = await supabase
    .from("orders")
    .select(
      "*, companies(name, logo_url, address), customers(name, email, phone, address)",
    )
    .eq("id", params.id)
    .single();

  if (error || !order) {
    return notFound();
  }

  // Fetch line items for this order
  const { data: lineItems, error: lineItemsError } = await supabase
    .from("line_items")
    .select("*, products(name, base_price)")
    .eq("order_id", params.id)
    .order("created_at", { ascending: true });

  if (lineItemsError) {
    console.error("Error fetching line items:", lineItemsError);
  }

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate subtotal, tax, and total
  const subtotal =
    lineItems?.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0,
    ) || 0;
  const taxRate = 0.07; // 7% tax rate (example)
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // Generate invoice number (using order ID for now)
  const invoiceNumber = `INV-${order.id.substring(0, 8).toUpperCase()}`;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/admin/invoices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Invoice {invoiceNumber}
        </h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Email Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>
                  Invoice {invoiceNumber} for order #{order.id.substring(0, 8)}
                </CardDescription>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                    order.payment_status,
                  )}`}
                >
                  {order.payment_status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invoice header with company and customer info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    From
                  </h3>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {(order.companies as any)?.name || "Company Name"}
                    </p>
                    {(order.companies as any)?.address && (
                      <div className="text-sm text-muted-foreground">
                        <p>{(order.companies as any)?.address.street}</p>
                        <p>
                          {(order.companies as any)?.address.city},{" "}
                          {(order.companies as any)?.address.state}{" "}
                          {(order.companies as any)?.address.zip}
                        </p>
                        <p>{(order.companies as any)?.address.country}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Bill To
                  </h3>
                  <div className="space-y-1">
                    <p className="font-medium">
                      {(order.customers as any)?.name || "Customer Name"}
                    </p>
                    {(order.customers as any)?.address && (
                      <div className="text-sm text-muted-foreground">
                        <p>{(order.customers as any)?.address.street}</p>
                        <p>
                          {(order.customers as any)?.address.city},{" "}
                          {(order.customers as any)?.address.state}{" "}
                          {(order.customers as any)?.address.zip}
                        </p>
                        <p>{(order.customers as any)?.address.country}</p>
                      </div>
                    )}
                    {(order.customers as any)?.email && (
                      <p className="text-sm">
                        {(order.customers as any)?.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Invoice details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Invoice Number
                  </h3>
                  <p>{invoiceNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Invoice Date
                  </h3>
                  <p>{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Due Date
                  </h3>
                  <p>
                    {order.due_date
                      ? formatDate(order.due_date)
                      : "Due on receipt"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Order Status
                  </h3>
                  <p>{order.status}</p>
                </div>
              </div>

              <Separator />

              {/* Line items */}
              <div>
                <h3 className="text-sm font-medium mb-4">Line Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems && lineItems.length > 0 ? (
                      lineItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {(item.products as any)?.name ||
                              item.description ||
                              "Product"}
                            {item.description &&
                              (item.products as any)?.name && (
                                <p className="text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              )}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(parseFloat(item.price))}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(
                              parseFloat(item.price) * item.quantity,
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center text-muted-foreground"
                        >
                          No line items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right">
                        Subtotal
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(subtotal)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right">
                        Tax ({(taxRate * 100).toFixed(0)}%)
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(taxAmount)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(total)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

              {/* Notes */}
              {order.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Notes
                  </h3>
                  <div className="rounded-md border border-input p-3 text-sm">
                    <p className="whitespace-pre-line">{order.notes}</p>
                  </div>
                </div>
              )}

              {/* Payment terms */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Payment Terms
                </h3>
                <p className="text-sm">
                  Payment is due within 30 days. Please make checks payable to{" "}
                  {(order.companies as any)?.name || "Company Name"} or use the
                  online payment options.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Payment Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>
                Current status and payment options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                    order.payment_status,
                  )}`}
                >
                  {order.payment_status}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Amount Due:</span>
                <span className="font-bold">
                  {formatCurrency(parseFloat(order.total_amount))}
                </span>
              </div>

              {order.payment_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Payment:</span>
                  <span className="text-sm">
                    {formatDate(order.payment_date)}
                  </span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                disabled={order.payment_status === "paid"}
              >
                <Receipt className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Payment Reminder
              </Button>
            </CardFooter>
          </Card>

          {/* Activity Card */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent invoice activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-blue-100 p-1">
                    <FileText className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invoice created</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {order.payment_status === "paid" && order.payment_date && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-green-100 p-1">
                      <Receipt className="h-4 w-4 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payment received</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.payment_date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Example of email sent activity */}
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-purple-100 p-1">
                    <Mail className="h-4 w-4 text-purple-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Invoice sent</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
