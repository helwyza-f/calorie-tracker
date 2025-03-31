"use client";

import { useState } from "react";
import { forgotPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null); // Reset message sebelum request

    const formData = new FormData(event.currentTarget);

    try {
      const result = await forgotPasswordAction(formData);

      if (result?.error) {
        setMessage(result.error);
      } else {
        setMessage("Check your email for a reset link.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="w-96 p-6 bg-gray-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        {message && <p className="text-blue-500 mb-2">{message}</p>}
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="mb-3"
        />
        <Button
          type="submit"
          className="w-full hover:bg-gray-700"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>

        <div className="mt-2 text-sm text-center">
          <Link href="/sign-in" className="text-blue-400 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
