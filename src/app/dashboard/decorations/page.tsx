import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";

export default async function DecorationTechniquesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch decoration techniques
  const { data: techniques, error } = await supabase
    .from("decoration_techniques")
    .select("*")
    .order("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decoration Techniques</h1>
          <p className="text-muted-foreground">
            Manage your decoration techniques and settings
          </p>
        </div>
        <Link href="/dashboard/decorations/new">
          <Button>Add Technique</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techniques && techniques.length > 0 ? (
          techniques.map((technique) => (
            <Link href={`/dashboard/decorations/${technique.id}`} key={technique.id}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle>{technique.name}</CardTitle>
                  <CardDescription>
                    Setup Fee: ${technique.setup_fee.toFixed(2)} • Min Order: {technique.minimum_order}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {technique.description || "No description provided"}
                  </p>
                  <div className="mt-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      technique.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {technique.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardHeader>
                <CardTitle>No Decoration Techniques</CardTitle>
                <CardDescription>
                  You haven't added any decoration techniques yet.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Decoration techniques define the methods you use to decorate products, such as screen printing, embroidery, DTG, or vinyl.
                </p>
                <Link href="/dashboard/decorations/new">
                  <Button>Add Your First Technique</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
