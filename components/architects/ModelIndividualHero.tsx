"use client";

import { motion } from "motion/react";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import type { Project } from "@/types/project";
import { getSubtypeLabel } from "@/types/project";

interface Props {
  project: Project;
}

export function ModelIndividualHero({ project }: Props) {
  const subtypeLabel = project.subtype ? getSubtypeLabel(project.subtype) : "Modelo";

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-black text-white">
      {/* Background image with parallax + view transition pairing */}
      <ParallaxImage
        src={project.heroImage}
        alt={project.name}
        speed={0.18}
        priority
        containerClassName="absolute inset-0"
        containerStyle={{ viewTransitionName: `model-${project.slug}` }}
      />

      {/* Gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none"
      />

      {/* Project info */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-16 pb-20 lg:pb-28 pointer-events-none">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="text-[11px] uppercase tracking-[0.4em] text-white/70 mb-5"
        >
          Linha Berkahn · {subtypeLabel} · {project.area.builtArea.toFixed(0)} m²
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          className="font-heading text-[clamp(3.5rem,9vw,9rem)] font-light leading-[0.92] tracking-tight max-w-5xl"
        >
          {project.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="text-lg md:text-xl text-white/80 leading-relaxed font-light max-w-2xl mt-6"
        >
          {project.tagline}
        </motion.p>

        {/* Mini-meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease: [0.19, 1, 0.22, 1] }}
          className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-8 text-sm"
        >
          <div>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
              Dorms
            </span>
            <span className="font-light tabular-nums">
              {project.features.bedrooms}
            </span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/20" />
          <div>
            <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
              Banhos
            </span>
            <span className="font-light tabular-nums">
              {project.features.bathrooms}
            </span>
          </div>
          {project.features.suites > 0 && (
            <>
              <div className="hidden sm:block w-px h-8 bg-white/20" />
              <div>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
                  Suítes
                </span>
                <span className="font-light tabular-nums">
                  {project.features.suites}
                </span>
              </div>
            </>
          )}
          {project.constructionTime && (
            <>
              <div className="hidden sm:block w-px h-8 bg-white/20" />
              <div>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-white/40 mb-1">
                  Construção
                </span>
                <span className="font-light tabular-nums">
                  {project.constructionTime}
                </span>
              </div>
            </>
          )}
        </motion.div>
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
