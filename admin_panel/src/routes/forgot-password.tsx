import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { forgotPassword } from "@/services/auth";


export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});


function ForgotPasswordPage() {

  const [email, setEmail] = useState("");


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await forgotPassword(email);

    toast.success("Reset link sent to your email");
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">

      <div className="w-full max-w-md">

        <h1 className="text-3xl font-semibold">
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email address and we will send you a password reset link.
        </p>


        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div className="space-y-2">

            <Label htmlFor="email">
              Email address
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

          </div>


          <Button
            type="submit"
            className="w-full"
          >
            Send Reset Link
          </Button>

        </form>


        <Link
          to="/login"
          className="block text-center mt-5 text-sm text-primary hover:underline"
        >
          Back to Login
        </Link>


      </div>

    </div>
  );
}