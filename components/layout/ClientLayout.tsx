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

  // Rotas que abrem com foto em tela cheia: o hero encosta no topo (sem pt-20)
  // e a pílula começa transparente por cima dele. As demais nascem com a
  // pílula branca e o conteúdo começa abaixo dela.
  const isHome = pathname === "/";
  const isFullBleed = isHome || FULL_BLEED_ROUTES.has(pathname ?? "");

  // Home: hero pinado com runway de 260vh, o flip para branco vem tarde.
  // Internas: vira branco em 0.75 do viewport, antes do fim do hero; o menor
  // deles (Empresa, 85vh no celular) sai de baixo da pílula por volta de 0.77.
  const heroEndFactor = isHome ? 1.55 : 0.75;

  return (
    <MenuProvider>
      <Header variant={isFullBleed ? "overlay" : "default"} heroEndFactor={heroEndFactor} />
      <Sidebar />
      <main className={isFullBleed ? undefined : "pt-20"}>{children}</main>
    </MenuProvider>
  );
}

const FULL_BLEED_ROUTES = new Set([
  "/empresa",
  "/servicos",
  "/lsf",
  "/residencial",
  "/comercial-industrial",
  "/perguntas-frequentes",
  "/sustentabilidade",
]);
