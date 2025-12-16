"use client";

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
  return (
    <section className="relative h-screen min-h-[600px] flex items-start justify-start pt-32 md:pt-40 overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel
          opts={{
            loop: true,
            duration: 30,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: false,
            }),
          ]}
          className="h-full w-full"
        >
          <CarouselContent className="h-full">
            {/* Slide 1: Estrutura em Construção */}
            <CarouselItem className="basis-full min-w-0 h-full">
              <Image
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
                alt="Estrutura Steel Frame em construção"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </CarouselItem>

            {/* Slide 2: Detalhes Estruturais */}
            <CarouselItem className="basis-full min-w-0 h-full">
              <Image
                src="https://images.unsplash.com/photo-1503387837-b154d5074bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
                alt="Detalhes de conexões estruturais precisas"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </CarouselItem>

            {/* Slide 3: Estrutura Metálica Limpa */}
            <CarouselItem className="basis-full min-w-0 h-full">
              <Image
                src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
                alt="Perfis estruturais organizados"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </CarouselItem>

            {/* Slide 4: Fachada Finalizada */}
            <CarouselItem className="basis-full min-w-0 h-full">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
                alt="Arquitetura moderna finalizada"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </CarouselItem>

            {/* Slide 5: Casa Completa */}
            <CarouselItem className="basis-full min-w-0 h-full">
              <Image
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80"
                alt="Projeto residencial completo"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
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
            text="Erguendo o amanhã"
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
