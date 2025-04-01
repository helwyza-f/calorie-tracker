"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Import usePathname to detect active path

export default function Navigation() {
  const pathname = usePathname(); // Get the current path

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around bg-black p-4 md:static md:top-0 md:w-full md:flex-row md:justify-center md:gap-10 md:px-20 *:bg-gray-800">
      <Button
        asChild
        variant="ghost"
        className={`md:text-lg ${
          pathname === "/" ? "text-blue-500" : "text-white"
        }`} // Highlight Home link when active
      >
        <Link href={"/"}>🏠 Home</Link>
      </Button>

      <Button
        asChild
        variant="ghost"
        className={`md:text-lg ${
          pathname === "/profile" ? "text-blue-500" : "text-white"
        }`} // Highlight Profile link when active
      >
        <Link href={"/profile"}>👤 Profile</Link>
      </Button>
    </nav>
  );
}
