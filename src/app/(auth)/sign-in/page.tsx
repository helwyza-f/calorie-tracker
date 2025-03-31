"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signInAction(formData);

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      //  setError("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="w-96 p-6 bg-gray-800 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
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
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        <div className="mt-4 text-sm text-center">
          <Link
            href="/forgot-password"
            className="text-blue-400 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mt-2 text-sm text-center">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-blue-400 hover:underline">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
