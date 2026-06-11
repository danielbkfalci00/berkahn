"use client";

import { useReducedMotion } from "motion/react";
import { ETAPAS_OBRA, ETAPAS_OBRA_RESUMO_SR } from "@/lib/etapas-obra-data";
import { cn } from "@/lib/utils";
import { FaseSection } from "./FaseSection";
import { Arrowhead, FluxogramaLegend } from "./FluxogramaPrimitives";

interface FluxogramaEtapasObraProps {
  /**
   * "page": sem casca própria (fundo off-white + grade ficam no wrapper da página).
   * "embed": painel "papel técnico" auto-contido para inserir em superfícies brancas (slide).
   */
  variant?: "page" | "embed";
  className?: string;
}

export function FluxogramaEtapasObra({ variant = "page", className }: FluxogramaEtapasObraProps) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <div
      className={cn(
        variant === "embed" &&
          "rounded-xl border border-black/10 bg-off-white fluxograma-grid-bg overflow-hidden print:bg-white print:bg-none",
        className
      )}
    >
      <p className="sr-only">{ETAPAS_OBRA_RESUMO_SR}</p>

      <FluxogramaLegend className="px-6 pt-7" />

      <div className="relative mx-auto max-w-[1080px] px-[clamp(24px,6vw,80px)] pb-16 pt-10">
        {/* Trilho de precisão do orçamento — liga os 3 marcos pretos (desktop) */}
        <div
          aria-hidden="true"
          className={cn(
            "hidden lg:block print:hidden absolute top-[104px] bottom-[120px] w-0",
            "right-[calc(clamp(24px,6vw,80px)+110px)] border-l border-black/[0.18]"
          )}
        >
          <Arrowhead dir="up" className="absolute -top-0.5 -left-[4.5px] w-2 h-2" />
          <span className="absolute top-5 left-2 whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.24em] text-[#999999] [writing-mode:vertical-rl] rotate-180">
            Precisão do orçamento
          </span>
        </div>

        {ETAPAS_OBRA.map((fase, i) => (
          <FaseSection key={fase.numero} fase={fase} isFirst={i === 0} reducedMotion={reducedMotion} />
        ))}
      </div>
    </div>
  );
}
