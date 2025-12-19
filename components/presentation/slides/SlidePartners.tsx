"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// Light shimmer placeholder for logos on dark background
const shimmerPlaceholder =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjIyIi8+PC9zdmc+";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const plugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  // Pause autoplay when off-viewport to save CPU resources
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          plugin.current.play();
        } else {
          plugin.current.stop();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <SlideSection dark className="py-20 lg:py-32">
      <div ref={containerRef} className="container max-w-6xl mx-auto">
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
            aria-label="Carrossel de marcas parceiras"
          >
            <CarouselContent className="-ml-4 md:-ml-8">
              {partners.map((partner, index) => (
                <CarouselItem
                  key={index}
                  className="pl-4 md:pl-8 basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="flex items-center justify-center h-40 lg:h-52 p-4">
                    <div className="relative w-full h-full">
                      <Image
                        src={partner.logo}
                        alt={`Logo ${partner.name}`}
                        fill
                        className="object-contain transition-all duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        placeholder="blur"
                        blurDataURL={shimmerPlaceholder}
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
