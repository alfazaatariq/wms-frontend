"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 flex">
      <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
        <Package className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">WMS Dashboard</span>
      </Link>
    </div>
  );
}
