"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { CharReveal } from "@/components/animations/TextReveal";
import { architects } from "@/lib/architects-data";

const mosaicImages = architects.map((a) => {
  const anchor = a.projects.find((p) => p.isAnchor) ?? a.projects[0];
  return { src: anchor.images[0], studio: a.studioName };
});

export function ArchitectHubHero() {
  return (
    <section className="relative min-h-[90vh] w-full flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
      {/* Mosaic background — 2×2 grid */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        {mosaicImages.map((img, i) => (
          <div key={i} className="relative overflow-hidden">
            <Image
              src={img.src}
              alt={img.studio}
              fill
              quality={65}
              className="object-cover scale-105"
              sizes="(max-width: 1024px) 50vw, 25vw"
              priority={i < 2}
              loading={i < 2 ? undefined : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Overlay — off-white wash que mantém o texto legível */}
      <div
        aria-hidden
        className="absolute inset-0 bg-off-white/[0.88] pointer-events-none"
      />

      {/* Subtle vignette at edges */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(244,242,236,0.5) 100%)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-5xl text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
      >
        <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-8">
          Construtora Berkahn
        </p>

        <h1 className="font-heading text-[clamp(3rem,8vw,8rem)] font-light leading-[0.95] tracking-tight text-black">
          <CharReveal text="Curadoria" delay={0.2} />
          <CharReveal
            text="completa"
            delay={0.55}
            className="italic font-extralight text-black-70"
          />
        </h1>

        <p className="mt-10 text-lg md:text-xl text-black-70 max-w-2xl mx-auto leading-relaxed font-light">
          Quatro escritórios autorais e a linha própria de modelos engenheirados
          — duas formas de começar sua próxima obra em steel frame.
        </p>
      </motion.div>

    </section>
  );
}
