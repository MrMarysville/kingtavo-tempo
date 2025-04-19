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

export default async function CompaniesPage() {
  const supabase = await createClient();
  const { data: companies, error } = await supabase
    .from("companies")
    .select("*");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Companies
          </h1>
          <p className="text-muted-foreground">Manage your tenant companies</p>
        </div>
        <Link href="/admin/companies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          <p>Error loading companies: {error.message}</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies?.length === 0 && (
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>No companies found</CardTitle>
              <CardDescription>
                Get started by creating your first company
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {companies?.map((company) => (
          <Link key={company.id} href={`/admin/companies/${company.id}`}>
            <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle>{company.name}</CardTitle>
                <CardDescription>{company.slug}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                      <span className="text-xl font-bold text-muted-foreground">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Created:{" "}
                      {new Date(company.created_at).toLocaleDateString()}
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
