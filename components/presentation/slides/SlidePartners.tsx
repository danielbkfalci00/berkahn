"use client";

import { useRef } from "react";
import Image from "next/image";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const partners = [
  {
    name: "Brand 01",
    logo: "/images/Apresentação/Marcas Parceiras/brand-01.webp",
  },
  {
    name: "Lumen",
    logo: "/images/Apresentação/Marcas Parceiras/lumen.webp",
  },
  {
    name: "Knauf",
    logo: "/images/Apresentação/Marcas Parceiras/knauf.webp",
  },
  {
    name: "Aquapanel",
    logo: "/images/Apresentação/Marcas Parceiras/aquapanel.webp",
  },
];

export function SlidePartners() {
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  return (
    <SlideSection dark className="py-20 lg:py-32">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-12 lg:mb-16">
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/40 mb-4">
            Marcas Parceiras
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            Trabalhamos com<br className="hidden sm:block" /> as Melhores
          </h2>
          <p className="text-base sm:text-lg text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            Parceria com marcas de qualidade do mais alto padrão
          </p>
          <div className="w-16 h-px bg-white/20 mx-auto mt-8" />
        </RevealOnScroll>

        {/* Carousel */}
        <RevealOnScroll delay={0.3} className="mt-12 lg:mt-16">
          <Carousel
            opts={{
              loop: true,
              align: "center",
              dragFree: false,
            }}
            plugins={[plugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-8">
              {partners.map((partner, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:pl-8 basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="flex items-center justify-center h-32 lg:h-40 p-6 border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 group">
                    <div className="relative w-full h-full">
                      <Image
                        src={partner.logo}
                        alt={`Logo ${partner.name}`}
                        fill
                        className="object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </RevealOnScroll>
      </div>
    </SlideSection>
  );
}
