"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Keep the public navigation, lead forms and consent UI out of the admin entry.
const PublicLayout = dynamic(() => import("./PublicLayout").then((module) => module.PublicLayout));

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }
  return <PublicLayout>{children}</PublicLayout>;
}
