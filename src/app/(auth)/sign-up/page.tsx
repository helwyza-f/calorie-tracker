"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null); // Reset message sebelum request

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signUpAction(formData);

      if (result?.error) {
        setMessage(result.error);
      } else {
        setMessage("Account created! Check your email for verification.");
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
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        {message && <p className="text-blue-500 mb-2">{message}</p>}
        <Input
          type="text"
          name="full_name"
          placeholder="Full Name"
          required
          className="mb-3"
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="mb-3"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="mb-3"
        />
        <Button
          type="submit"
          className="w-full hover:bg-gray-700"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>

        <div className="mt-2 text-sm text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
}
