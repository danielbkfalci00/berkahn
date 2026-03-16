"use client";

import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { motion } from "motion/react";
import {
  FileCheck,
  Pencil,
  CheckCircle2,
  Building2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import type { PlanoGerenciamento, EtapaGerenciamento } from "@/types/orcamento";
import { cn } from "@/lib/utils";
import { OrcamentoWatermark } from "./OrcamentoWatermark";
import { SectionLabel } from "./SectionLabel";

interface PlanoGerenciamentoSectionProps {
  plano: PlanoGerenciamento;
}

const iconMap: Record<string, React.ElementType> = {
  FileCheck,
  Pencil,
  CheckCircle2,
  Building2,
};

// Progressive styling for phases
const phaseStyles = {
  1: {
    card: "border-2 border-black/10 bg-white shadow-luxury-sm",
    icon: "w-12 h-12 border-2 border-black/10 bg-white text-black/60",
    title: "text-xl font-bold",
    textColor: "text-black",
  },
  2: {
    card: "border border-black/20 bg-[#F4F2EC] shadow-luxury-md",
    icon: "w-14 h-14 border border-black/20 bg-white text-black/70",
    title: "text-xl font-bold",
    textColor: "text-black",
  },
  3: {
    card: "border border-black/30 bg-black/5 shadow-luxury-lg",
    icon: "w-16 h-16 border border-black/30 bg-white text-black/80",
    title: "text-2xl font-bold",
    textColor: "text-black",
  },
  4: {
    card: "border-2 border-black bg-black shadow-luxury-xl",
    icon: "w-20 h-20 border-2 border-white bg-black text-white",
    title: "text-2xl font-bold text-white",
    textColor: "text-white/90",
  },
};

export function PlanoGerenciamentoSection({
  plano,
}: PlanoGerenciamentoSectionProps) {
  return (
    <section className="relative py-20 lg:py-32 bg-white overflow-hidden">
      <OrcamentoWatermark variant="light" logoPosition="top-right" />
      <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionLabel number="05" title="Plano de Gerenciamento Berkahn" variant="light" />
        <RevealOnScroll>
          <div className="mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold tracking-tight text-black mb-4">
              COMO EXECUTAMOS SEU PROJETO
            </h2>
            <p className="text-xl text-black/60 max-w-2xl">
              Nosso processo estruturado garante qualidade e transparência em
              cada etapa do seu projeto
            </p>
          </div>
        </RevealOnScroll>
      </div>
      <div className="container max-w-6xl relative z-10">

        {/* Desktop: Horizontal Timeline with Arrows */}
        <div className="hidden lg:flex items-center gap-6">
          {plano.etapas.map((etapa, index) => (
            <motion.div
              key={etapa.fase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="flex items-center flex-1 gap-6"
            >
              {/* Card */}
              <EtapaCard
                etapa={etapa}
                index={index}
                phaseNum={index + 1}
              />

              {/* Arrow - except after last */}
              {index < plano.etapas.length - 1 && (
                <div className="flex-shrink-0">
                  <ChevronRight className="w-6 h-6 text-black/20" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Tablet: 2x2 Grid */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
          {plano.etapas.map((etapa, index) => (
            <EtapaCard
              key={etapa.fase}
              etapa={etapa}
              index={index}
              phaseNum={index + 1}
            />
          ))}
        </div>

        {/* Mobile: Vertical Timeline with Arrows */}
        <div className="md:hidden space-y-4">
          {plano.etapas.map((etapa, index) => (
            <motion.div
              key={etapa.fase}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Card */}
              <EtapaCard
                etapa={etapa}
                index={index}
                phaseNum={index + 1}
              />

              {/* Arrow - except after last */}
              {index < plano.etapas.length - 1 && (
                <div className="flex justify-center py-2">
                  <ChevronDown className="w-5 h-5 text-black/20 animate-bounce" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Progressive Card Component
function EtapaCard({
  etapa,
  index,
  phaseNum,
}: {
  etapa: EtapaGerenciamento;
  index: number;
  phaseNum: number;
}) {
  const Icon = etapa.icone ? iconMap[etapa.icone] : FileCheck;
  const styles = phaseStyles[phaseNum as keyof typeof phaseStyles] || phaseStyles[4];
  const isLast = phaseNum === 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={cn(
        "rounded-lg p-8 lg:p-10 transition-all duration-500",
        "hover:scale-[1.02]",
        styles.card
      )}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          delay: index * 0.15 + 0.2,
          type: "spring",
          stiffness: 200,
        }}
        className={cn(
          "rounded-full flex items-center justify-center mb-4",
          "transition-transform duration-300 hover:rotate-12",
          styles.icon
        )}
      >
        {Icon && <Icon className="w-7 h-7" />}
      </motion.div>

      {/* Title */}
      <h3 className={cn("mb-2", styles.title)}>
        {etapa.titulo}
      </h3>

      {/* Description */}
      <p className={cn("text-base leading-relaxed mb-4 min-h-[60px]", styles.textColor, isLast ? "text-white/80" : "text-black/60")}>
        {etapa.descricao}
      </p>

      {/* Deliverables */}
      {etapa.entregas && etapa.entregas.length > 0 && (
        <div className="space-y-2 mt-6">
          {etapa.entregas.map((entrega, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                isLast
                  ? "bg-white/20 text-white"
                  : "bg-black/10 text-black/60"
              )}>
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className={cn(
                "text-sm leading-relaxed",
                isLast ? "text-white/90" : "text-black/70"
              )}>
                {entrega}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
