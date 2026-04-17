"use client";

import { motion } from "motion/react";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import type { Architect } from "@/lib/architects-data";

interface Props {
  architect: Architect;
}

export function ArchitectIndividualHero({ architect }: Props) {
  const anchorProject =
    architect.projects.find((p) => p.isAnchor) ?? architect.projects[0];

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-black text-white">
      {/* Background image with parallax + view transition pairing */}
      <ParallaxImage
        src={anchorProject.images[0]}
        alt={`${architect.studioName} — projeto destaque`}
        speed={0.18}
        priority
        containerClassName="absolute inset-0"
        containerStyle={{ viewTransitionName: `architect-${architect.slug}` }}
      />

      {/* Gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none"
      />

      {/* Studio info */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-16 pb-20 lg:pb-28 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/70 mb-5"
        >
          {architect.city}, {architect.state} · Fundado em {architect.yearFounded}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="font-heading text-[clamp(3.5rem,9vw,9rem)] font-light leading-[0.92] tracking-tight max-w-5xl"
        >
          {architect.studioName}
        </motion.h1>

        <div className="flex flex-wrap gap-2 mt-8">
          {architect.styleTags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.4 + i * 0.08,
                ease: [0.19, 1, 0.22, 1],
              }}
              className="text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border border-white/30 text-white/90 backdrop-blur-sm"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2 text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent animate-scroll-cue" />
      </motion.div>
    </section>
  );
}
