"use client";

import { usePathname } from "next/navigation";
import { MenuProvider } from "@/components/providers/MenuProvider";
import { CookieConsentProvider } from "@/components/providers/CookieConsentProvider";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ConditionalFooter } from "./ConditionalFooter";
import { CookieBanner } from "./CookieBanner";
import { WhatsAppButton } from "./WhatsAppButton";

/** Existing public chrome, loaded only for public routes. */
export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullscreen = ["/apresentacao", "/orcamento", "/curadoria-berkahn", "/etapas-da-obra", "/institucional"]
    .some((route) => pathname?.startsWith(route));
  const isHome = pathname === "/";
  const isFullBleed = isHome || FULL_BLEED_ROUTES.has(pathname ?? "");
  const heroEndFactor = isHome ? 1.55 : 0.75;
  return (
    <CookieConsentProvider>
      {fullscreen ? children : (
        <MenuProvider>
          <Header variant={isFullBleed ? "overlay" : "default"} heroEndFactor={heroEndFactor} />
          <Sidebar />
          <main className={isFullBleed ? undefined : "pt-20"}>{children}</main>
        </MenuProvider>
      )}
      <ConditionalFooter />
      <CookieBanner />
      <WhatsAppButton />
    </CookieConsentProvider>
  );
}

const FULL_BLEED_ROUTES = new Set([
  "/empresa", "/servicos", "/lsf", "/residencial", "/comercial-industrial",
  "/perguntas-frequentes", "/sustentabilidade", "/atualidades",
]);
