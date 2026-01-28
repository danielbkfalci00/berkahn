import {
  FileCheck,
  Pencil,
  CheckCircle2,
  Building2,
} from "lucide-react";
import type { PlanoGerenciamento } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface PlanoGerenciamentoSectionPDFProps {
  plano: PlanoGerenciamento;
}

const iconMap: Record<string, React.ElementType> = {
  FileCheck,
  Pencil,
  CheckCircle2,
  Building2,
};

/**
 * PlanoGerenciamentoSectionPDF - Versão compacta em grid 2x2
 * Sem animações, apenas títulos e descrições curtas
 */
export function PlanoGerenciamentoSectionPDF({
  plano,
}: PlanoGerenciamentoSectionPDFProps) {
  return (
    <section className="py-16 bg-white w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-black/40 mb-3">
            Processo de Trabalho
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-black mb-3">
            {plano.titulo}
          </h2>
          <p className="text-sm text-black/60 max-w-xl mx-auto">
            Nosso processo estruturado garante qualidade e transparência em cada etapa
          </p>
        </div>

        {/* Grid 2x2 */}
        <div className="grid grid-cols-2 gap-6">
          {plano.etapas.map((etapa, index) => {
            const Icon = etapa.icone ? iconMap[etapa.icone] : FileCheck;
            const isLast = index === 3;

            return (
              <div
                key={etapa.fase}
                className={cn(
                  "rounded-xl p-6",
                  isLast
                    ? "bg-black text-white"
                    : "bg-[#F4F2EC] border border-black/10"
                )}
              >
                {/* Phase number + Icon */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      isLast
                        ? "bg-white/20 text-white"
                        : "bg-black/10 text-black/70"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-mono uppercase tracking-wider",
                      isLast ? "text-white/60" : "text-black/40"
                    )}
                  >
                    Fase {index + 1}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={cn(
                    "text-lg font-bold mb-2",
                    isLast ? "text-white" : "text-black"
                  )}
                >
                  {etapa.titulo}
                </h3>

                {/* Description */}
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    isLast ? "text-white/70" : "text-black/60"
                  )}
                >
                  {etapa.descricao}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
