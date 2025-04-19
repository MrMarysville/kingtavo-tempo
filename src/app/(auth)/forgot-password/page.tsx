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
import { forgotPasswordAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { UrlProvider } from "@/components/url-provider";

export default async function ForgotPassword(props: {
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
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UrlProvider>
              <form className="flex flex-col space-y-6">
                <div className="space-y-4">
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
                </div>

                <SubmitButton
                  formAction={forgotPasswordAction}
                  pendingText="Sending reset link..."
                  className="w-full"
                >
                  Reset Password
                </SubmitButton>

                <FormMessage message={searchParams} />
              </form>
            </UrlProvider>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <div className="text-sm text-muted-foreground">
              Remember your password?{" "}
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
