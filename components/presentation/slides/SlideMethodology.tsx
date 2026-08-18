"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { containerVariants, itemVariants, lineVariants } from "@/lib/animation-variants";
import { useInViewAnimation } from "@/hooks/useInViewAnimation";
import { cn } from "@/lib/utils";
import { MessageSquare, PenTool, HardHat, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

// Chunk separado: só baixa na primeira expansão do card
const FluxogramaEtapasObra = dynamic(
  () => import("@/components/fluxograma/FluxogramaEtapasObra").then((m) => m.FluxogramaEtapasObra),
  { loading: () => <div className="min-h-[400px]" /> }
);

const steps = [
  {
    number: "01",
    title: "Consulta",
    description: "Entendemos suas necessidades e apresentamos as melhores soluções",
    icon: MessageSquare,
  },
  {
    number: "02",
    // "Pré Obra" é o nome canônico desta fase no resto do material
    // (lib/servicos-data.ts EXECUTION_PHASES[0], ComoTrabalhamosPDF fase 01).
    title: "Pré Obra",
    description: "Desenvolvemos todos os projetos necessários para a obra e acompanhamos cada um deles, com a estruturação técnica e financeira do empreendimento",
    icon: PenTool,
  },
  {
    number: "03",
    title: "Execução",
    description: "Construímos com qualidade, acompanhamento constante e prazo definido",
    icon: HardHat,
  },
  {
    number: "04",
    title: "Entrega",
    description: "Entregamos sua obra pronta para uso com garantia e suporte",
    icon: CheckCircle2,
  },
];

export function SlideMethodology() {
  const { ref, isInView } = useInViewAnimation({ margin: "-20% 0px" });
  const [fluxOpen, setFluxOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const closeFluxograma = () => {
    setFluxOpen(false);
    if (!prefersReducedMotion) {
      triggerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <SlideSection className="pt-10 pb-20 lg:pt-14 lg:pb-32">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-16 lg:mb-24">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-black/50 mb-4">
            Como Trabalhamos
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Do Conceito à<br className="hidden sm:block" /> Entrega das Chaves
          </h2>
        </RevealOnScroll>

        {/* Steps */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Connecting Line - Desktop */}
          <motion.div
            variants={lineVariants}
            className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-black/10 origin-left"
          />

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="relative text-center lg:text-left"
                >
                  {/* Icon */}
                  <div className="flex flex-col items-center lg:items-start mb-6">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-black/60 leading-relaxed max-w-xs mx-auto lg:mx-0">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Fluxograma expansível — Etapas da Obra */}
        <RevealOnScroll delay={0.2} className="mt-16 lg:mt-20">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => (fluxOpen ? closeFluxograma() : setFluxOpen(true))}
            aria-expanded={fluxOpen}
            aria-controls="fluxograma-etapas-obra"
            className={cn(
              "group flex w-full items-center justify-between gap-6 text-left",
              "rounded-xl border border-black/10 bg-off-white/60 px-6 py-5 lg:px-8 lg:py-6",
              "shadow-luxury-sm transition-shadow duration-300 ease-expo hover:shadow-luxury-md"
            )}
          >
            <div>
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.24em] text-black/50">
                Processo Construtivo
              </p>
              <p className="font-heading text-lg font-bold tracking-tight lg:text-xl">
                Etapas da Obra — do terreno à mobilização
              </p>
            </div>
            <ChevronDown
              strokeWidth={1.5}
              className={cn(
                "h-5 w-5 flex-none transition-transform duration-500 ease-expo",
                fluxOpen && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence initial={false}>
            {fluxOpen && (
              <motion.div
                id="fluxograma-etapas-obra"
                initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-6">
                  <FluxogramaEtapasObra variant="embed" />
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={closeFluxograma}
                      className="inline-flex items-center gap-2 rounded-full border border-black/20 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black/70 transition-colors duration-300 ease-expo hover:border-black hover:text-black"
                    >
                      <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Recolher fluxograma
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </RevealOnScroll>
      </div>
    </SlideSection>
  );
}
