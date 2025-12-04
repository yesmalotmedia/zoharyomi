"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // אם זה העמוד הראשי — לא מציגים Navbar
  if (pathname === "/") return null;

  return <Navbar />;
}
