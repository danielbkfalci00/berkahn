"use client";

import Image from "next/image";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CharReveal, TextReveal } from "@/components/animations/TextReveal";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-start justify-start pt-32 md:pt-40 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home-hero.png"
          alt="Estrutura Steel Frame Berkahn"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-left">
        <div className="hero-content-left">
          {/* Decorative Line */}
          <RevealOnScroll delay={0.1}>
            <div className="hero-decorative-line w-24 mb-8" />
          </RevealOnScroll>

          {/* Label */}
          <RevealOnScroll delay={0.2}>
            <p className="hero-label text-white/70 mb-6 hero-text-shadow uppercase tracking-widest">
              Construção Inteligente
            </p>
          </RevealOnScroll>

          {/* Headline - CharReveal */}
          <CharReveal
            text="Líderes em Steel Frame. Mestres em construir."
            className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tighter text-white hero-text-shadow-strong mb-8"
            delay={0.3}
          />

          {/* Subheadline - TextReveal */}
          <TextReveal
            text="Escolhemos a melhor tecnologia para cada projeto. Residencial ou comercial, simples ou complexo — entregamos excelência."
            className="text-lg md:text-xl font-body text-white/90 hero-text-shadow max-w-2xl leading-relaxed"
            delay={0.6}
            as="p"
          />
        </div>
      </div>
    </section>
  );
}
