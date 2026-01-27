"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFDownloadButtonProps {
  pacoteSelecionadoId: string;
  numeroOrcamento: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

/**
 * Botão para download do PDF do orçamento
 *
 * Características:
 * - Mostra estado de loading durante geração (3-5 segundos)
 * - Passa pacote selecionado para a API
 * - Nome do arquivo inclui número do orçamento
 * - Usa a API route /api/orcamento/pdf
 */
export function PDFDownloadButton({
  pacoteSelecionadoId,
  numeroOrcamento,
  variant = "outline",
  size = "sm",
  className = "",
}: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      const response = await fetch(
        `/api/orcamento/pdf?pacote=${encodeURIComponent(pacoteSelecionadoId)}&numero=${encodeURIComponent(numeroOrcamento)}`
      );

      if (!response.ok) {
        throw new Error(`Erro ao gerar PDF: ${response.status}`);
      }

      // Obtém o blob do PDF
      const blob = await response.blob();

      // Cria URL temporária e faz download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Orcamento-Berkahn-${numeroOrcamento}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpa a URL temporária
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      // Fallback para impressão do navegador
      window.print();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isGenerating}
      variant={variant}
      size={size}
      className={`gap-2 ${className}`}
      aria-label={isGenerating ? "Gerando PDF..." : "Download do PDF do orçamento"}
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : (
        <Download className="w-4 h-4 flex-shrink-0" />
      )}
      <span className="hidden sm:inline">
        {isGenerating ? "Gerando..." : "BAIXAR PDF"}
      </span>
    </Button>
  );
}
