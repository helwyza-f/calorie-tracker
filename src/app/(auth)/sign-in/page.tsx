"use client";

import { signInAction } from "@/actions/auth";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SignIn() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const status = searchParams.get("status");
  const message = searchParams.get("message");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    await signInAction(formData);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>

      {status && (
        <p
          className={`mb-4 ${
            status === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="p-2 rounded bg-gray-800"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="p-2 rounded bg-gray-800"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 p-2 rounded"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
