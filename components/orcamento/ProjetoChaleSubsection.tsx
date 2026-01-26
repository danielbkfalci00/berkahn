"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionMarker } from "./SectionMarker";
import type { ChaleProjeto } from "@/types/orcamento";

interface ProjetoChaleSubsectionProps {
  data: ChaleProjeto;
}

/**
 * Subsecção: Projeto Chalé
 * Layout: Galeria assimétrica com 2 fotos + card flutuante
 * Background: White #FFFFFF
 * Apresentação: Luxo e elegância com offset layout
 */
export function ProjetoChaleSubsection({ data }: ProjetoChaleSubsectionProps) {
  const totalArea = data.comodos.reduce((sum, c) => sum + c.area, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
    },
  };

  return (
    <section className="relative py-xl bg-white">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header with section marker */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-lg flex items-center gap-sm"
        >
          <SectionMarker number="02" />
          <h2 className="text-xl font-bold tracking-tight text-black">
            PROJETO: {data.titulo}
          </h2>
        </motion.div>

        {/* Asymmetric photo gallery */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative min-h-[600px]"
        >
          {/* First image - Large, left-aligned */}
          <motion.div
            variants={imageVariants}
            className="relative h-[400px] w-full max-w-[600px]"
          >
            <Image
              src={data.imagens.prototipo[0]}
              alt={`${data.titulo} - Protótipo 1`}
              fill
              className="object-cover shadow-luxury-lg"
              sizes="(max-width: 640px) 100vw, 600px"
              quality={90}
            />
          </motion.div>

          {/* Second image - Smaller, offset */}
          <motion.div
            variants={imageVariants}
            className="relative -mt-20 h-[500px] w-full max-w-[400px] ml-auto md:-mt-32"
          >
            <Image
              src={data.imagens.prototipo[1]}
              alt={`${data.titulo} - Protótipo 2`}
              fill
              className="object-cover shadow-luxury-lg"
              sizes="(max-width: 640px) 100vw, 400px"
              quality={90}
            />
          </motion.div>

          {/* Floating info card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            viewport={{ once: true }}
            className="absolute right-0 md:right-12 top-1/2 -translate-y-1/2 md:translate-y-0 md:top-auto md:bottom-12 bg-[#F4F2EC] px-8 py-6 shadow-luxury-md z-10 max-w-xs"
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
