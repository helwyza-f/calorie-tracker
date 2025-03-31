"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function getSupabase() {
  return createClient();
}

export async function signUpAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString();
  const supabase = await getSupabase();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) return { error: error.message };
  return { success: "Check your email for verification link" };
}

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await getSupabase();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  return redirect("/");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = formData.get("email")?.toString();
  const supabase = await getSupabase();
  const origin = (await headers()).get("origin");

  if (!email) return { error: "Email is required" };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/reset-password`,
  });

  if (error) return { error: "Could not reset password" };
  return { success: "Check your email for password reset link" };
}

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const code = formData.get("code") as string;

  if (!password || !confirmPassword || !code) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  // 🛠️ **Tukar kode dengan sesi user** sebelum update password
  const { error: sessionError } = await supabase.auth.exchangeCodeForSession(
    code
  );
  if (sessionError) {
    return { error: "Invalid or expired reset code. Try resetting again." };
  }

  // 🔑 **Update password**
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Password update failed. Try again later." };
  }

  return { success: "Password updated successfully." };
};

export async function signOutAction() {
  const supabase = await getSupabase();
  await supabase.auth.signOut();
  return redirect("/sign-in");
}
