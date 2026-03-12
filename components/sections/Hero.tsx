"use client";

import { useRef } from "react";
import Image from "next/image";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { CharReveal, TextReveal } from "@/components/animations/TextReveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function Hero() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <section className="relative h-[70vh] md:h-screen min-h-[500px] md:min-h-[600px] flex items-start justify-start pt-32 md:pt-40 overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel
          opts={{
            loop: true,
            duration: 30,
          }}
          plugins={[autoplayPlugin.current]}
          className="h-full w-full"
        >
          <CarouselContent className="h-full">
            {/* Slide 1 */}
            <CarouselItem className="basis-full min-w-0 h-full">
              <Image
                src="/images/hero/hero-home-1.webp"
                alt="Estrutura Steel Frame em construção"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </CarouselItem>

            {/* Slide 2 */}
            <CarouselItem className="basis-full min-w-0 h-full">
              <Image
                src="/images/hero/hero-home-2.webp"
                alt="Detalhes de conexões estruturais precisas"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </CarouselItem>

            {/* Slide 3 */}
            <CarouselItem className="basis-full min-w-0 h-full">
              <Image
                src="/images/hero/hero-home-4.webp"
                alt="Arquitetura moderna finalizada"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </CarouselItem>

            {/* Slide 4 */}
            <CarouselItem className="basis-full min-w-0 h-full">
              <Image
                src="/images/hero/hero-home-5.webp"
                alt="Projeto residencial completo"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>

        {/* Gradient Overlay para legibilidade - top vignette */}
        <div
          className="absolute inset-0 hero-overlay-top"
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-left">
        <div className="hero-content-left">
          {/* Decorative Line */}
          <RevealOnScroll delay={0.1}>
            <div className="hero-decorative-line w-24 mb-8" />
          </RevealOnScroll>

          {/* Headline - Two lines */}
          <h1 className="mb-8">
            <CharReveal
              text="Especialistas em Light Steel Frame"
              className="hero-headline-line text-xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tighter text-white hero-text-shadow-strong"
              delay={0.2}
            />
            <CharReveal
              text="Mestres em Construir"
              className="hero-headline-line text-xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tighter text-white hero-text-shadow-strong"
              delay={0.4}
            />
          </h1>

          {/* Subheadline - TextReveal */}
          <TextReveal
            text="Construímos com a tecnologia certa para cada projeto. Residencial ou comercial, simples ou complexo."
            className="text-lg md:text-xl font-body text-white/90 hero-text-shadow max-w-2xl leading-relaxed"
            delay={0.6}
            as="p"
          />
        </div>
      </div>
    </section>
  );
}
