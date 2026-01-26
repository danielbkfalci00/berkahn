"use client";

import { usePathname } from "next/navigation";
import { MenuProvider } from "@/components/providers/MenuProvider";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { PROJETO_TEMPLATE } from "@/lib/orcamento-data";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rotas que não devem ter header/sidebar (ex: apresentações, admin)
  const isFullscreenRoute = pathname?.startsWith("/apresentacao");
  const isAdminRoute = pathname?.startsWith("/admin");
  const isOrcamentoRoute = pathname?.startsWith("/orcamento");

  // Handler para download de PDF (placeholder)
  const handleDownloadPDF = () => {
    // TODO: Implementar geração/download de PDF
    // Opções:
    // 1. window.print() com CSS otimizado
    // 2. Gerar PDF client-side (jsPDF/react-pdf)
    // 3. Endpoint server-side para gerar PDF

    console.log('Download PDF triggered');
    alert('Funcionalidade de PDF em desenvolvimento');
  };

  if (isFullscreenRoute || isAdminRoute) {
    return <main>{children}</main>;
  }

  return (
    <MenuProvider>
      <Header
        variant={isOrcamentoRoute ? 'orcamento' : 'default'}
        projectName={isOrcamentoRoute ? PROJETO_TEMPLATE.titulo : undefined}
        onDownloadPDF={isOrcamentoRoute ? handleDownloadPDF : undefined}
      />
      {!isOrcamentoRoute && <Sidebar />}
      <main className="pt-20">{children}</main>
    </MenuProvider>
  );
}
