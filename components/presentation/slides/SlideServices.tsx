"use client";

import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { FocusCardsSection } from "@/components/residencial/FocusCardsSection";
import { RESIDENCIAL_SERVICES } from "@/lib/residencial-data";

export function SlideServices() {
  return (
    <SlideSection dark>
      <div className="container max-w-7xl mx-auto">
        <RevealOnScroll className="text-center mb-12 lg:mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 mb-4">
            Soluções
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            O que Fazemos por Você
          </h2>
          <div className="w-16 h-px bg-white/20 mx-auto mt-8" />
        </RevealOnScroll>
        <FocusCardsSection cards={RESIDENCIAL_SERVICES} />
      </div>
    </SlideSection>
  );
}
