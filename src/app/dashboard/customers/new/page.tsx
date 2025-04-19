import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../supabase/server";

export default async function NewCustomerPage() {
  const supabase = await createClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Customer</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
          <CardDescription>
            Create a new customer in your database
          </CardDescription>
        </CardHeader>
        <form
          action={async (formData) => {
            "use server";

            const supabase = await createClient();

            const name = formData.get("name") as string;
            const company_id = formData.get("company_id") as string;
            const email = formData.get("email") as string;
            const phone = formData.get("phone") as string;
            const notes = formData.get("notes") as string;

            const address = {
              street: formData.get("street") as string,
              city: formData.get("city") as string,
              state: formData.get("state") as string,
              zip: formData.get("zip") as string,
              country: formData.get("country") as string,
            };

            const { data, error } = await supabase
              .from("customers")
              .insert({
                name,
                company_id,
                email: email || null,
                phone: phone || null,
                address,
                notes: notes || null,
              })
              .select();

            if (error) {
              console.error("Error creating customer:", error);
              return { error: error.message };
            }

            return { success: "Customer created successfully" };
          }}
        >
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_id">Company</Label>
              <select
                id="company_id"
                name="company_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select a company</option>
                {companies?.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Customer Name</Label>
              <Input id="name" name="name" placeholder="Acme Corp" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@acmecorp.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" placeholder="(555) 123-4567" />
            </div>

            <div className="space-y-2">
              <Label>Address (optional)</Label>
              <div className="grid gap-2">
                <Input id="street" name="street" placeholder="Street Address" />
                <div className="grid grid-cols-2 gap-2">
                  <Input id="city" name="city" placeholder="City" />
                  <Input id="state" name="state" placeholder="State/Province" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input id="zip" name="zip" placeholder="ZIP/Postal Code" />
                  <Input id="country" name="country" placeholder="Country" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional information about this customer"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Create Customer</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
