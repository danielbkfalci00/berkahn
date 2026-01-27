"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrcamentoProjeto } from "@/types/orcamento";

interface OrcamentoHeaderProps {
  projeto: OrcamentoProjeto;
  numeroOrcamento?: string;
  onDownloadPDF?: () => void;
}

/**
 * Header fixo/sticky para a página de orçamento
 *
 * Layout de 3 colunas:
 * - Esquerda: Logo Berkahn
 * - Centro: Título do projeto (clicável - scroll to top)
 * - Direita: Botão "BAIXAR PDF"
 *
 * Sticky positioning com z-index 50 (abaixo de modais)
 * Background glassmorphism com backdrop blur
 * Responsivo com ajustes para mobile/tablet/desktop
 */
export function OrcamentoHeader({
  projeto,
  numeroOrcamento,
  onDownloadPDF,
}: OrcamentoHeaderProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDownload = () => {
    if (onDownloadPDF) {
      onDownloadPDF();
    } else {
      window.print();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black-10">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Left: Logo Berkahn */}
          <div className="flex-shrink-0">
            <Image
              src="/images/logo/berkahn-logo.webp"
              alt="Berkahn Logo"
              width={48}
              height={48}
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
              quality={90}
              priority
            />
          </div>

          {/* Center: Clickable Title */}
          <button
            onClick={scrollToTop}
            className="flex-1 text-center px-4 cursor-pointer group transition-opacity hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded"
            aria-label="Voltar para o topo do orçamento"
          >
            <h1 className="text-sm sm:text-base lg:text-lg font-semibold tracking-tight text-black truncate">
              Berkahn & {projeto.titulo}
            </h1>
          </button>

          {/* Right: PDF Button */}
          <div className="flex-shrink-0">
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="gap-2 text-xs sm:text-sm"
              aria-label="Download do PDF do orçamento"
            >
              <Download className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">BAIXAR PDF</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
