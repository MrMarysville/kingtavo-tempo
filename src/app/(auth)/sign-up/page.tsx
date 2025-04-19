import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
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
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Sign up
            </CardTitle>
            <CardDescription>Create an account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <UrlProvider>
              <form className="flex flex-col space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      type="text"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Your password"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <SubmitButton
                  formAction={signUpAction}
                  pendingText="Signing up..."
                  className="w-full"
                >
                  Sign up
                </SubmitButton>

                <FormMessage message={searchParams} />
              </form>
            </UrlProvider>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                className="text-primary font-medium hover:underline transition-all"
                href="/sign-in"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
        <div className="mt-4">
          <SmtpMessage />
        </div>
      </div>
    </>
  );
}
