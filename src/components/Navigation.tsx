"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around bg-black p-4 md:static md:top-0 md:w-full md:flex-row md:justify-center md:gap-10 md:px-20 *:bg-gray-800">
      <Button asChild variant="ghost" className="md:text-lg">
        <Link href={"/"}>🏠 Home</Link>
      </Button>
      {/* <Button asChild variant="ghost" className="md:text-lg">
        <Link href="/analyze">📷 Analyze</Link>
      </Button> */}
      <Button asChild variant="ghost" className="md:text-lg">
        <Link href={"/profile"}>👤 Profile</Link>
      </Button>
    </nav>
  );
}
