"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Architect } from "@/lib/architects-data";
import { architects } from "@/lib/architects-data";
import { trackEvent } from "@/lib/analytics";

interface Props {
  architect: Architect;
  index: number;
}

export function ArchitectHubCardCarousel({ architect, index }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const href = `/curadoria-berkahn/${architect.slug}`;
  const prefetch = () => router.prefetch(href);

  const anchorProject =
    architect.projects.find((p) => p.isAnchor) ?? architect.projects[0];
  const heroImages = anchorProject.images.slice(0, Math.min(4, anchorProject.images.length));

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const handle = () => setCurrent(api.selectedScrollSnap());
    api.on("select", handle);
    return () => {
      api.off("select", handle);
    };
  }, [api]);

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-black text-white">
      {/* Carousel layer */}
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 6000, stopOnInteraction: false })]}
        setApi={setApi}
        className="absolute inset-0 h-full"
      >
        <CarouselContent className="h-full ml-0">
          {heroImages.map((src, i) => (
            <CarouselItem key={i} className="h-full pl-0 basis-full">
              <div
                className="relative w-full h-full"
                style={
                  i === 0
                    ? { viewTransitionName: `architect-${architect.slug}` }
                    : undefined
                }
              >
                <Image
                  src={src}
                  alt={`${architect.studioName} — ${anchorProject.name} ${i + 1}`}
                  fill
                  className="object-cover scale-[1.02]"
                  priority={i === 0 && index < 2}
                  quality={i === 0 ? 85 : 78}
                  sizes="100vw"
                  loading={i === 0 && index < 2 ? undefined : "lazy"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dark gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50 pointer-events-none"
      />

      {/* Top bar — index + counter */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 lg:px-12 py-8">
        <span className="font-heading text-sm tracking-[0.3em] text-white/50">
          {String(index + 1).padStart(2, "0")} / {String(architects.length).padStart(2, "0")}
        </span>

        <div className="flex items-center gap-4 text-white/80">
          <button
            onClick={() => api?.scrollPrev()}
            className="p-2 hover:text-white transition-colors"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-light tracking-wider tabular-nums">
            {String(current + 1).padStart(2, "0")} /{" "}
            {String(heroImages.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => api?.scrollNext()}
            className="p-2 hover:text-white transition-colors"
            aria-label="Próximo slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info layer */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-16 pb-20 lg:pb-28 pointer-events-none">
        <div className="max-w-4xl pointer-events-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="text-[11px] uppercase tracking-[0.4em] text-white/70 mb-5"
          >
            {architect.city}, {architect.state}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="font-heading text-[clamp(3rem,7vw,7rem)] font-light leading-[0.95] tracking-tight text-white"
          >
            {architect.studioName}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-wrap gap-2 mt-7"
          >
            {architect.styleTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border border-white/30 text-white/90 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl mt-7 font-light"
          >
            {architect.shortPitch}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="mt-10"
          >
            <Link
              href={href}
              onMouseEnter={prefetch}
              onFocus={prefetch}
              onClick={() =>
                trackEvent("select_architect", {
                  architect: architect.slug,
                  studio: architect.studioName,
                  location: "hub_card",
                })
              }
              className="group/cta inline-flex items-center gap-3"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-white border-b border-white/40 pb-1 group-hover/cta:border-white transition-colors duration-300">
                Ver portfólio completo
              </span>
              <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-500 ease-expo group-hover/cta:translate-x-1 group-hover/cta:-translate-y-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
