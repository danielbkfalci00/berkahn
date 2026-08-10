"use client";

import Image from "next/image";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { FocusCardsSection } from "@/components/residencial/FocusCardsSection";
import { RESIDENCIAL_SERVICES } from "@/lib/residencial-data";

export function SlideServices() {
  return (
    <SlideSection dark>
      <div className="container max-w-7xl mx-auto">
        <RevealOnScroll className="text-center mb-12 lg:mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/60 mb-4">
            Soluções
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            O que Fazemos por Você
          </h2>
          <div className="w-16 h-px bg-white/20 mx-auto mt-8" />
        </RevealOnScroll>
        <FocusCardsSection cards={RESIDENCIAL_SERVICES} />

        {/* Imagem de Impacto */}
        <RevealOnScroll className="mt-16 lg:mt-20">
          <div className="relative h-[40vh] lg:h-[50vh] w-full overflow-hidden">
            <Image
              src="/images/Lsf/lsf-hero-structure.webp"
              alt="Estrutura Steel Frame em construção"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/70 text-sm uppercase tracking-widest">
                Estrutura Steel Frame
              </p>
              <p className="text-white/50 text-xs mt-1">
                Perfis de aço galvanizado montados com precisão milimétrica
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </SlideSection>
  );
}
