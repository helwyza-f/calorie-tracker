"use client";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function ClientWrapper() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) =>
          console.log("Service Worker registered:", registration)
        )
        .catch((error) =>
          console.error("Service Worker registration failed:", error)
        );
    }
  }, []);

  return <Toaster position="top-right" />;
}
