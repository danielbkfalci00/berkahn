"use client";

import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";

export function SlideProjectsIntro() {
  return (
    <SlideSection dark className="flex items-center justify-center">
      <div className="container max-w-4xl mx-auto px-6 text-center">
        <RevealOnScroll>
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/60 mb-6">
            Experiência dos Fundadores
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Obras Gerenciadas<br className="hidden sm:block" /> pelos Sócios
          </h2>
          <p className="text-base sm:text-lg text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            Projetos realizados ao longo de mais de duas décadas de atuação
            no mercado de construção civil e gerenciamento de obras.
          </p>
          <div className="w-16 h-px bg-white/20 mx-auto mt-10" />
        </RevealOnScroll>
      </div>
    </SlideSection>
  );
}
