"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  // Não renderizar footer em rotas fullscreen (ex: apresentações, orçamento)
  const isFullscreenRoute =
    pathname?.startsWith("/apresentacao") || pathname?.startsWith("/orcamento");

  if (isFullscreenRoute) {
    return null;
  }

  return <Footer />;
}
