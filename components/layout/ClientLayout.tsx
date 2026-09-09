"use client";

import { usePathname } from "next/navigation";
import { MenuProvider } from "@/components/providers/MenuProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rotas que não devem ter header/sidebar (ex: apresentações, orçamentos, admin)
  const isFullscreenRoute = pathname?.startsWith("/apresentacao");
  const isAdminRoute = pathname?.startsWith("/admin");
  const isOrcamentoRoute = pathname?.startsWith("/orcamento");
  const isCuradoriaRoute = pathname?.startsWith("/curadoria-berkahn");
  const isEtapasObraRoute = pathname?.startsWith("/etapas-da-obra");
  const isInstitucionalRoute = pathname?.startsWith("/institucional");

  if (isFullscreenRoute || isAdminRoute || isOrcamentoRoute || isCuradoriaRoute || isEtapasObraRoute || isInstitucionalRoute) {
    return <>{children}</>;
  }

  // Rotas cujo hero e full-bleed: encostam no topo (sem pt-20) sob header
  // transparente. A home tem hero pinado com runway de 260vh, por isso o
  // flip para solido acontece mais tarde nela do que num hero de 100svh.
  const isHome = pathname === "/";
  const isFullBleed = isHome || pathname === "/sustentabilidade";

  return (
    <MenuProvider>
      <Header
        variant={isFullBleed ? "overlay" : "default"}
        heroEndFactor={isHome ? 1.55 : 0.92}
      />
      <Sidebar />
      <main className={isFullBleed ? undefined : "pt-20"}>{children}</main>
    </MenuProvider>
  );
}
