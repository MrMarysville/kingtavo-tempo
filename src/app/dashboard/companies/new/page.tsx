import { createCompanyAction } from "@/app/actions";
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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCompanyPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/companies">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Company</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>
            Create a new tenant company in the system
          </CardDescription>
        </CardHeader>
        <form action={createCompanyAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input id="name" name="name" placeholder="Acme Inc." required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug (used for URL and identification)
              </Label>
              <Input
                id="slug"
                name="slug"
                placeholder="acme-inc"
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                required
              />
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, and hyphens. No spaces.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL (optional)</Label>
              <Input
                id="logo_url"
                name="logo_url"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color (optional)</Label>
                <div className="flex">
                  <Input
                    id="primary_color"
                    name="primary_color"
                    placeholder="#4F46E5"
                    className="rounded-r-none"
                  />
                  <div className="flex w-10 items-center justify-center rounded-r-md border border-l-0 bg-muted">
                    <input
                      type="color"
                      className="h-6 w-6 cursor-pointer"
                      onChange={(e) => {
                        const input = document.getElementById(
                          "primary_color",
                        ) as HTMLInputElement;
                        if (input) input.value = e.target.value;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_color">
                  Secondary Color (optional)
                </Label>
                <div className="flex">
                  <Input
                    id="secondary_color"
                    name="secondary_color"
                    placeholder="#10B981"
                    className="rounded-r-none"
                  />
                  <div className="flex w-10 items-center justify-center rounded-r-md border border-l-0 bg-muted">
                    <input
                      type="color"
                      className="h-6 w-6 cursor-pointer"
                      onChange={(e) => {
                        const input = document.getElementById(
                          "secondary_color",
                        ) as HTMLInputElement;
                        if (input) input.value = e.target.value;
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Create Company</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
