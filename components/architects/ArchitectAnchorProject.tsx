"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Maximize2 } from "lucide-react";
import { CountUp } from "@/components/animations/CountUp";
import { ParallaxImage } from "@/components/animations/ParallaxImage";
import { TextReveal } from "@/components/animations/TextReveal";
import type { Architect, ArchitectProject } from "@/lib/architects-data";
import { ArchitectImageLightbox } from "./ArchitectImageLightbox";

interface Props {
  architect: Architect;
}

export function ArchitectAnchorProject({ architect }: Props) {
  const anchor: ArchitectProject =
    architect.projects.find((p) => p.isAnchor) ?? architect.projects[0];

  const heroImage = anchor.images[0];
  const secondaryImages = anchor.images.slice(1, 5);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
    <section className="relative w-full bg-white py-24 lg:py-36 px-6 lg:px-12 overflow-hidden">
      <div className="max-w-[1500px] mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="mb-12 lg:mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-3">
            Projeto destaque
          </p>
          <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-black">
            {anchor.name}
          </h3>
        </motion.div>

        {/* Hero image — full bleed style with parallax */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
          className="relative w-full aspect-[16/9] lg:aspect-[21/9] group"
        >
          <ParallaxImage
            src={heroImage}
            alt={anchor.name}
            speed={0.15}
            containerClassName="absolute inset-0"
          />
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            aria-label={`Ampliar ${anchor.name}`}
            className="absolute inset-0 z-10 flex items-end justify-end p-4 lg:p-6 cursor-zoom-in"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm text-white rounded-full p-2.5">
              <Maximize2 className="w-5 h-5" />
            </span>
          </button>
        </motion.div>

        {/* Concept narrative + stats */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-16 lg:mt-24">
          {/* Concept */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-7"
          >
            <p className="text-[11px] uppercase tracking-[0.4em] text-black-50 mb-5">
              Conceito
            </p>
            <TextReveal
              text={
                anchor.concept ??
                "Projeto-âncora do escritório — referência das soluções autorais aplicadas em steel frame."
              }
              delay={0.25}
              className="text-xl md:text-2xl lg:text-3xl font-light leading-[1.45] tracking-tight text-black"
            />
          </motion.div>

          {/* Stats grid 2x2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 1, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
            className="lg:col-span-5 grid grid-cols-2 gap-y-10 gap-x-6 self-end"
          >
            <div className="border-t border-black-10 pt-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black-50 mb-2">
                Área
              </p>
              <p className="font-heading text-3xl md:text-4xl font-light tracking-tight text-black tabular-nums">
                <CountUp as="span" end={anchor.area} duration={1800} />
                <span className="text-xl text-black-50 ml-1">m²</span>
              </p>
            </div>
            <div className="border-t border-black-10 pt-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black-50 mb-2">
                Ano
              </p>
              <p className="font-heading text-3xl md:text-4xl font-light tracking-tight text-black tabular-nums">
                {anchor.year}
              </p>
            </div>
            <div className="border-t border-black-10 pt-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black-50 mb-2">
                Cidade
              </p>
              <p className="font-heading text-3xl md:text-4xl font-light tracking-tight text-black">
                {anchor.city.split(",")[0]}
              </p>
            </div>
            <div className="border-t border-black-10 pt-4">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black-50 mb-2">
                Programa
              </p>
              <p className="font-heading text-3xl md:text-4xl font-light tracking-tight text-black">
                {anchor.program.split("·")[0].trim()}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Secondary images grid */}
        {secondaryImages.length > 0 && (
          <div className="mt-20 lg:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {secondaryImages.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.12,
                  ease: [0.19, 1, 0.22, 1],
                }}
                whileHover={{ rotate: i % 2 === 0 ? 1 : -1 }}
                className="relative aspect-[4/5] overflow-hidden group"
              >
                <Image
                  src={src}
                  alt={`${anchor.name} — ${i + 2}`}
                  fill
                  quality={75}
                  className="object-cover transition-transform duration-1000 ease-expo group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <button
                  type="button"
                  onClick={() => setLightboxIndex(i + 1)}
                  aria-label={`Ampliar ${anchor.name} imagem ${i + 2}`}
                  className="absolute inset-0 z-10 flex items-end justify-end p-3 cursor-zoom-in bg-black/0 hover:bg-black/10 transition-colors"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm text-white rounded-full p-2">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>

      <ArchitectImageLightbox
        open={lightboxIndex !== null}
        images={anchor.images}
        initialIndex={lightboxIndex ?? 0}
        title={anchor.name}
        meta={`${anchor.area} m² · ${anchor.year} · ${anchor.city}`}
        footer={anchor.program}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  );
}
