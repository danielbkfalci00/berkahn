"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  // Não renderizar footer em rotas fullscreen (ex: apresentações)
  const isFullscreenRoute = pathname?.startsWith("/apresentacao");

  if (isFullscreenRoute) {
    return null;
  }

  return <Footer />;
}
