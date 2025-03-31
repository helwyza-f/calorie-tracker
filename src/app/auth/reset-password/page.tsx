"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { resetPasswordAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const resetCode = searchParams.get("code");
    if (resetCode) {
      setCode(resetCode);
    } else {
      setMessage("Invalid or missing reset code.");
    }
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code) return setMessage("Invalid reset code.");

    const formData = new FormData(event.currentTarget);
    formData.append("code", code);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match.");
    }

    setLoading(true);
    try {
      const result = await resetPasswordAction(formData);
      if (result?.error) {
        setMessage(result.error);
      } else {
        setMessage("Password updated successfully. Redirecting to sign in...");
        setTimeout(() => router.push("/sign-in"), 3000);
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="w-96 p-6 bg-gray-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {message && <p className="text-blue-500 mb-2">{message}</p>}
        <Input
          type="password"
          name="password"
          placeholder="New Password"
          required
          className="mb-3"
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
          className="mb-3"
        />
        <Button
          type="submit"
          className="w-full hover:bg-gray-700"
          disabled={loading}
        >
          {loading ? "Loading..." : "Reset Password"}
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
