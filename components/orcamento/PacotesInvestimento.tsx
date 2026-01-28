"use client";

import { motion } from "framer-motion";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PacoteCard } from "./PacoteCard";
import type { PacoteInvestimento } from "@/types/orcamento";
import { cn } from "@/lib/utils";
import { OrcamentoWatermark } from "./OrcamentoWatermark";
import { SectionLabel } from "./SectionLabel";

interface PacotesInvestimentoProps {
  pacotes: PacoteInvestimento[];
  metragemProjeto: number;
  /** Quando true, força layout de grid estático (sem carousel) para geração de PDF */
  isPDFMode?: boolean;
}

export function PacotesInvestimento({
  pacotes,
  metragemProjeto,
  isPDFMode = false,
}: PacotesInvestimentoProps) {

  return (
    <section className="relative py-xl bg-gradient-to-b from-white via-white to-black/[0.02]">
      <OrcamentoWatermark variant="light" logoPosition="center" />
      <div className="container max-w-7xl relative z-10">
        {/* Section Header */}
        <SectionLabel number="04" title="Planilha Orçamentária" variant="light" />
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h2 className="headline-md text-black mb-4">
              Opções de Investimento
            </h2>
            <p className="body-md text-black/60 max-w-2xl mx-auto">
              {pacotes.length === 2
                ? "Apresentamos duas opções de pacotes pensados para atender diferentes necessidades. Ambos incluem nossa garantia de qualidade e compromisso com prazos."
                : "Apresentamos opções de pacotes pensados para atender diferentes necessidades e expectativas. Todos incluem nossa garantia de qualidade e compromisso com prazos."}
            </p>
          </div>
        </RevealOnScroll>

        {/* Desktop: Grid de Cards - Adaptável para 2 ou 3 pacotes */}
        {/* Em modo PDF, sempre usa grid (nunca carousel) */}
        <div
          className={cn(
            "gap-6 xl:gap-8 items-start",
            isPDFMode ? "grid" : "hidden lg:grid",
            pacotes.length === 2
              ? "lg:grid-cols-2 max-w-5xl mx-auto"
              : "lg:grid-cols-3"
          )}
        >
          {pacotes.map((pacote, index) => (
            <PacoteCard
              key={pacote.id}
              pacote={pacote}
              metragem={metragemProjeto}
              index={index}
            />
          ))}
        </div>

        {/* Mobile/Tablet: Carousel com snap scroll */}
        {/* Escondido em modo PDF */}
        <div className={cn("lg:hidden", isPDFMode && "hidden")}>
          <Carousel
            opts={{
              align: "center",
              loop: false,
              skipSnaps: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {pacotes.map((pacote, index) => (
                <CarouselItem
                  key={pacote.id}
                  className="pl-4 basis-[85%] sm:basis-[75%] md:basis-[60%]"
                >
                  <PacoteCard
                    pacote={pacote}
                    metragem={metragemProjeto}
                    index={index}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 h-12 w-12 border-black/20 hover:bg-black hover:text-white transition-all" />
              <CarouselNext className="static translate-y-0 h-12 w-12 border-black/20 hover:bg-black hover:text-white transition-all" />
            </div>

            {/* Carousel Indicators */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {pacotes.map((_, index) => (
                <div
                  key={index}
                  className="w-2 h-2 rounded-full bg-black/20 transition-colors"
                />
              ))}
            </div>
          </Carousel>
        </div>

        {/* Footnote */}
        <RevealOnScroll delay={0.5}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-black/40 mt-12"
          >
            * Valores calculados para {metragemProjeto}m². Consulte-nos para projetos com
            metragem diferente.
          </motion.p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
