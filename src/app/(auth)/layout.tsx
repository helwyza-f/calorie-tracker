"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function checkUser() {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user) {
        router.push("/"); // Redirect kalau user sudah login
      }
    }
    checkUser();
  }, [router, supabase]);

  return <>{children}</>;
}
