"use client";

import { usePathname } from "next/navigation";
import { MenuProvider } from "@/components/providers/MenuProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rotas que não devem ter header/sidebar (ex: apresentações)
  const isFullscreenRoute = pathname?.startsWith("/apresentacao");

  if (isFullscreenRoute) {
    return <main>{children}</main>;
  }

  return (
    <MenuProvider>
      <Header />
      <Sidebar />
      <main className="pt-20">{children}</main>
    </MenuProvider>
  );
}
