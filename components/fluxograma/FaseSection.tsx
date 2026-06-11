"use client";

import { motion } from "motion/react";
import { itemVariants } from "@/lib/animation-variants";
import type { FaseContent, FaseObra } from "@/lib/etapas-obra-data";
import { cn } from "@/lib/utils";
import { FlowLink, LoopGroup, MarcoCard, StepChain, StepRow } from "./FluxogramaPrimitives";

function FaseContentBlock({ content }: { content: FaseContent }) {
  switch (content.kind) {
    case "chain":
      return <StepChain items={content.items} />;
    case "row":
      return <StepRow steps={content.steps} />;
    case "loopWide":
      return (
        <LoopGroup
          chip={content.chip}
          // âncoras calibradas no artefato v1: centro da 1ª caixa da fileira por breakpoint
          anchors="top-[34px] min-[480px]:top-[52px] md:top-[76px] bottom-8"
        >
          <StepRow steps={content.row} />
          <FlowLink height="h-[46px]" />
          <StepChain items={content.chain.map((step) => ({ kind: "step" as const, step }))} />
        </LoopGroup>
      );
  }
}

export function FaseSection({
  fase,
  isFirst,
  reducedMotion,
}: {
  fase: FaseObra;
  isFirst?: boolean;
  reducedMotion?: boolean;
}) {
  return (
    <motion.section
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={reducedMotion ? undefined : itemVariants}
      className="mt-2 break-inside-avoid lg:grid lg:grid-cols-[minmax(0,1fr)_220px]"
    >
      {/* Conector de entrada da fase (saída "Não" das decisões nas fases 03 e 06).
          Fases com marco (02/03/05) sempre têm este conector → conteúdo é a row 3 do grid. */}
      {!isFirst && <FlowLink height="h-[52px]" chip={fase.entryChip} className="lg:col-start-1" />}

      <header className="relative mt-3.5 mb-7 flex items-end gap-5 lg:col-start-1">
        <span
          aria-hidden="true"
          className={cn(
            "absolute -left-3 select-none pointer-events-none leading-none",
            "-top-[34px] text-[76px] md:-top-[46px] md:text-[98px]",
            "font-extrabold tracking-[-0.04em] text-black/5"
          )}
        >
          {fase.numero}
        </span>
        <div className="relative z-[1]">
          <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.22em] text-[#666666]">
            Fase {fase.numero}
          </span>
          <h3 className="text-[19px] font-extrabold leading-[1.25] tracking-[0.01em]">{fase.titulo}</h3>
        </div>
        <span aria-hidden="true" className="mb-[7px] h-px min-w-10 flex-1 bg-black/10" />
      </header>

      <div className="lg:col-start-1">
        <FlowLink height="h-[26px]" arrow={false} />
        <FaseContentBlock content={fase.content} />
      </div>

      {fase.marco && <MarcoCard nome={fase.marco.nome} className="lg:col-start-2 lg:row-start-3 lg:self-end" />}
    </motion.section>
  );
}
