"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SlideSection } from "../ui/SlideSection";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Shimmer placeholder for loading state (tiny base64 gray gradient)
const shimmerPlaceholder =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMyMjIiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzMzMyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzIyMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=";

export interface ProjectSlideProps {
  number: string;
  title: string;
  location: string;
  year: string;
  area: string;
  system: string;
  description: string;
  features: string[];
  images: string[];
  dark?: boolean;
  reversed?: boolean;
}

export function SlideProject({
  number,
  title,
  location,
  year,
  area,
  system,
  description,
  features,
  images,
  dark = false,
  reversed = false,
}: ProjectSlideProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", handleSelect);

    // Cleanup to prevent memory leaks
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  return (
    <SlideSection dark={dark} className="p-0 lg:p-0">
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-2 w-full min-h-[100dvh]",
          reversed && "lg:[&>*:first-child]:order-2"
        )}
      >
        {/* Carousel Side */}
        <div className="relative h-[50vh] lg:h-auto lg:min-h-[100dvh]">
          <Carousel
            opts={{ loop: true }}
            setApi={setApi}
            className="h-full"
            aria-label={`Galeria de imagens: ${title}`}
          >
            <CarouselContent className="h-full -ml-0">
              {images.map((img, i) => (
                <CarouselItem key={i} className="h-full pl-0">
                  <div className="relative h-full w-full">
                    <Image
                      src={img}
                      alt={`${title} - Imagem ${i + 1} de ${images.length}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={i === 0}
                      placeholder="blur"
                      blurDataURL={shimmerPlaceholder}
                    />
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-black/10" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom Navigation Controls */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-10">
              {/* Navigation Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={scrollPrev}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center",
                    "border border-white/30 backdrop-blur-sm",
                    "text-white hover:bg-white/10 transition-colors",
                    "disabled:opacity-30"
                  )}
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={scrollNext}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center",
                    "border border-white/30 backdrop-blur-sm",
                    "text-white hover:bg-white/10 transition-colors",
                    "disabled:opacity-30"
                  )}
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Slide Counter */}
              <div
                className="text-white/70 text-sm font-light tracking-wider backdrop-blur-sm px-3 py-1 border border-white/20"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="sr-only">Imagem </span>
                <span className="font-medium text-white">{current}</span>
                <span className="mx-2">/</span>
                <span>{count}</span>
              </div>
            </div>
          </Carousel>
        </div>

        {/* Text Side */}
        <div
          className={cn(
            "flex flex-col justify-center",
            "px-8 py-12 lg:px-16 xl:px-20",
            "min-h-[50vh] lg:min-h-0"
          )}
        >
          {/* Project Number - Large Watermark */}
          <RevealOnScroll>
            <span
              className={cn(
                "font-heading text-[8rem] lg:text-[10rem] xl:text-[12rem] font-extrabold leading-none",
                "absolute top-8 right-8 lg:static lg:mb-[-3rem] lg:ml-[-0.5rem]",
                dark ? "text-white/[0.05]" : "text-black/[0.05]"
              )}
            >
              {number}
            </span>
          </RevealOnScroll>

          {/* Title & Meta */}
          <RevealOnScroll delay={0.1}>
            <div className="relative z-10">
              <h2
                className={cn(
                  "font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight",
                  dark ? "text-white" : "text-black"
                )}
              >
                {title}
              </h2>
              <p
                className={cn(
                  "text-xs sm:text-sm uppercase tracking-[0.2em] mt-3",
                  dark ? "text-white/50" : "text-black/50"
                )}
              >
                {location} &bull; {year}
              </p>
            </div>
          </RevealOnScroll>

          {/* Decorative Line */}
          <RevealOnScroll delay={0.2}>
            <div
              className={cn(
                "w-16 h-px my-8",
                dark ? "bg-white/20" : "bg-black/20"
              )}
            />
          </RevealOnScroll>

          {/* Description */}
          <RevealOnScroll delay={0.3}>
            <p
              className={cn(
                "text-base sm:text-lg lg:text-xl leading-relaxed font-light max-w-xl",
                dark ? "text-white/70" : "text-black/70"
              )}
            >
              {description}
            </p>
          </RevealOnScroll>

          {/* Stats */}
          <RevealOnScroll delay={0.4}>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div>
                <span
                  className={cn(
                    "text-2xl sm:text-3xl lg:text-4xl font-heading font-bold",
                    dark ? "text-white" : "text-black"
                  )}
                >
                  {area}
                </span>
                <p
                  className={cn(
                    "text-xs uppercase tracking-[0.15em] mt-1",
                    dark ? "text-white/40" : "text-black/40"
                  )}
                >
                  Área Total
                </p>
              </div>
              <div>
                <span
                  className={cn(
                    "text-sm sm:text-base lg:text-lg font-medium",
                    dark ? "text-white" : "text-black"
                  )}
                >
                  {system}
                </span>
                <p
                  className={cn(
                    "text-xs uppercase tracking-[0.15em] mt-1",
                    dark ? "text-white/40" : "text-black/40"
                  )}
                >
                  Sistema Construtivo
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Features */}
          <RevealOnScroll delay={0.5}>
            <ul className="mt-8 space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rotate-45",
                      dark ? "bg-white/40" : "bg-black/40"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm lg:text-base",
                      dark ? "text-white/60" : "text-black/60"
                    )}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </div>
    </SlideSection>
  );
}
