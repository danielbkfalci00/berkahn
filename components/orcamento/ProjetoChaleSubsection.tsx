"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ChaleProjeto } from "@/types/orcamento";

interface ProjetoChaleSubsectionProps {
  data: ChaleProjeto;
  isNested?: boolean; // Quando true, renderiza dentro de ProjetosConsideradosSection
}

/**
 * Subsecção: Projeto Chalé
 * Layout: Grid assimétrico com 4 fotos + card flutuante
 * Background: White #FFFFFF
 *
 * Layout visual:
 * ┌─────────────────────┬──────────────┐
 * │                     │      2       │
 * │         1           ├──────────────┤
 * │    (grande)         │      3       │
 * ├─────────────────────┴──────────────┤
 * │                 4 (wide)           │
 * └────────────────────────────────────┘
 */
export function ProjetoChaleSubsection({ data, isNested }: ProjetoChaleSubsectionProps) {
  const totalArea = data.comodos.reduce((sum, c) => sum + c.area, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
    },
  };

  // Ensure we have at least 4 images
  const images = data.imagens.prototipo;

  return (
    <section className="relative py-lg bg-white">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header with project title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-sm font-mono uppercase tracking-widest text-black/60">
            Projeto Chalé
          </p>
        </motion.div>

        {/* Asymmetric photo grid - 4 images */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          {/* Grid Layout */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {/* Image 1 - Large, spans 2 rows on desktop */}
            {images[0] && (
              <motion.div
                variants={imageVariants}
                className="col-span-2 lg:col-span-2 lg:row-span-2 relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden rounded-lg group"
              >
                <Image
                  src={images[0]}
                  alt={`${data.titulo} - Vista 1`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  quality={90}
                  priority
                />
              </motion.div>
            )}

            {/* Image 2 - Small, top-right */}
            {images[1] && (
              <motion.div
                variants={imageVariants}
                className="col-span-1 relative aspect-[4/3] overflow-hidden rounded-lg group"
              >
                <Image
                  src={images[1]}
                  alt={`${data.titulo} - Vista 2`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  quality={90}
                />
              </motion.div>
            )}

            {/* Image 3 - Small, bottom-right */}
            {images[2] && (
              <motion.div
                variants={imageVariants}
                className="col-span-1 relative aspect-[4/3] overflow-hidden rounded-lg group"
              >
                <Image
                  src={images[2]}
                  alt={`${data.titulo} - Vista 3`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  quality={90}
                />
              </motion.div>
            )}

            {/* Image 4 - Wide, spans full width */}
            {images[3] && (
              <motion.div
                variants={imageVariants}
                className="col-span-2 lg:col-span-3 relative aspect-[21/9] overflow-hidden rounded-lg group"
              >
                <Image
                  src={images[3]}
                  alt={`${data.titulo} - Vista 4`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="100vw"
                  quality={90}
                />
              </motion.div>
            )}
          </div>

          {/* Floating info card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true }}
            className="mt-8 lg:absolute lg:mt-0 lg:right-8 lg:bottom-8 lg:-translate-y-0
                       bg-[#F4F2EC] px-8 py-6 shadow-luxury-md max-w-xs mx-auto lg:mx-0"
          >
            <p className="font-mono text-xs tracking-widest uppercase text-black-70">
              {data.titulo}
            </p>
            <p className="mt-4 text-4xl font-bold text-black">
              {data.metragem}
              <span className="text-base font-normal ml-2">m²</span>
            </p>

            {/* Room metrics */}
            <div className="mt-6 space-y-3 border-t border-black-10 pt-4">
              <p className="font-mono text-xs uppercase tracking-wider text-black-70">
                Metragem por cômodo
              </p>
              <div className="space-y-2">
                {data.comodos.map((comodo) => (
                  <div key={comodo.nome} className="flex justify-between text-sm">
                    <span className="text-black">{comodo.nome}</span>
                    <span className="font-mono text-black-70">{comodo.area} m²</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold pt-2 border-t border-black-10">
                  <span className="text-black">Total</span>
                  <span className="font-mono text-black">{totalArea} m²</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
