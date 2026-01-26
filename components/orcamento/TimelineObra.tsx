"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Pencil,
  FileCheck,
  Layers,
  Building2,
  Paintbrush,
  Key,
} from "lucide-react";
import type { TimelineEtapa } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface TimelineObraProps {
  etapas: TimelineEtapa[];
  cronogramaPacote?: string; // Ex: "120 dias"
}

// Map icon names to components
const iconMap: Record<string, React.ElementType> = {
  Pencil,
  FileCheck,
  Layers,
  Building2,
  Paintbrush,
  Key,
};

export function TimelineObra({ etapas, cronogramaPacote }: TimelineObraProps) {
  return (
    <section className="py-xl bg-black/[0.02]">
      <div className="container max-w-6xl">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-black/40 mb-4">
              Cronograma
            </span>
            <h2 className="headline-md text-black mb-4">
              Timeline da Sua Obra
            </h2>
            <p className="body-md text-black/60 max-w-2xl mx-auto">
              Acompanhe cada etapa do processo de construção com total
              transparência e previsibilidade.
            </p>
            {cronogramaPacote && (
              <div className="inline-flex items-center gap-2 mt-6 bg-black/5 border border-black/15 rounded-full px-5 py-2">
                <span className="text-black/90 font-semibold">
                  Prazo estimado: {cronogramaPacote}
                </span>
              </div>
            )}
          </div>
        </RevealOnScroll>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block relative">
          {/* Connecting Line */}
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-black/10" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-black via-black/80 to-black/60 origin-left"
          />

          {/* Timeline Steps */}
          <div className="grid grid-cols-6 gap-4">
            {etapas.map((etapa, index) => {
              const IconComponent = iconMap[etapa.icone] || Layers;

              return (
                <motion.div
                  key={etapa.numero}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.6,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className="relative text-center"
                >
                  {/* Icon Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.15 + 0.3,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className={cn(
                      "relative z-10 w-12 h-12 mx-auto mb-6 rounded-full flex items-center justify-center",
                      "bg-white border-2 border-black shadow-lg",
                      "group hover:bg-black transition-colors duration-300"
                    )}
                  >
                    <IconComponent className="w-5 h-5 text-black group-hover:text-white transition-colors" />
                  </motion.div>

                  {/* Step Number */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-black">
                    {String(etapa.numero).padStart(2, "0")}
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-black mb-2">
                    {etapa.titulo}
                  </h3>
                  <p className="text-sm text-black/60 leading-relaxed mb-2">
                    {etapa.descricao}
                  </p>
                  <span className="inline-block text-xs text-black/80 font-medium bg-black/5 px-3 py-1 rounded-full">
                    {etapa.duracaoEstimada}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline - Vertical */}
        <div className="lg:hidden relative pl-8">
          {/* Connecting Line */}
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-black/10" />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-black via-black/80 to-black/60 origin-top"
          />

          {/* Timeline Steps */}
          <div className="space-y-8">
            {etapas.map((etapa, index) => {
              const IconComponent = iconMap[etapa.icone] || Layers;

              return (
                <motion.div
                  key={etapa.numero}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className="relative"
                >
                  {/* Icon Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1 + 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className={cn(
                      "absolute -left-8 top-0 z-10 w-6 h-6 rounded-full flex items-center justify-center",
                      "bg-white border-2 border-black shadow-md"
                    )}
                  >
                    <IconComponent className="w-3 h-3 text-black" />
                  </motion.div>

                  {/* Content Card */}
                  <div className="bg-white border border-black/10 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-black">{etapa.titulo}</h3>
                      <span className="text-xs text-black/80 font-medium bg-black/5 px-2 py-0.5 rounded">
                        {etapa.duracaoEstimada}
                      </span>
                    </div>
                    <p className="text-sm text-black/60">{etapa.descricao}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom note */}
        <RevealOnScroll delay={0.5}>
          <p className="text-center text-sm text-black/40 mt-12">
            * Prazos podem variar de acordo com condições climáticas e
            aprovações de prefeitura
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
