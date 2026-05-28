"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  // Não renderizar footer em rotas fullscreen (ex: apresentações, orçamento) nem no admin
  const isFullscreenRoute =
    pathname?.startsWith("/apresentacao") ||
    pathname?.startsWith("/orcamento") ||
    pathname?.startsWith("/curadoria-berkahn") ||
    pathname?.startsWith("/admin");

  if (isFullscreenRoute) {
    return null;
  }

  return <Footer />;
}
