"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionMarker } from "./SectionMarker";
import { SectionLabel } from "./SectionLabel";
import type { MetodologiaConstrutivaPremissas } from "@/types/orcamento";

interface MetodologiaSubsectionProps {
  data: MetodologiaConstrutivaPremissas;
}

/**
 * Subsecção: Metodologia Construtiva
 * Layout: Horizontal split com imagem técnica (60%) + lista de metodologia (40%)
 * Background: Off-White #F4F2EC
 * Apresentação: Estilo desenho arquitetônico com linhas de dimensão
 */
export function MetodologiaSubsection({ data }: MetodologiaSubsectionProps) {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] },
    },
  };

  return (
    <section className="relative py-xl bg-[#F4F2EC]">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header with section marker and breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-lg space-y-2"
        >
          <SectionLabel number="02" title="Premissas Adotadas para o Orçamento" variant="light" subtitle="2.1 Metodologia Construtiva" className="mb-0" />
        </motion.div>

        {/* Main content - horizontal split layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-lg md:grid-cols-[3fr_2fr] md:gap-xl"
        >
          {/* Left side - Technical image with architectural frame */}
          <motion.div variants={itemVariants} className="flex justify-center md:justify-start">
            <div className="relative w-full max-w-[600px]">
              {/* Architectural frame elements */}
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-black-30" />
              <div className="absolute -left-4 top-0 h-2 w-2 border border-black rounded-full bg-white" />
              <div className="absolute -left-4 bottom-0 h-2 w-2 border border-black rounded-full bg-white" />

              {/* Image with border */}
              <div className="relative aspect-auto overflow-hidden border border-black shadow-luxury-md">
                <Image
                  src={data.imagemTecnica}
                  alt="Estrutura técnica LSF - Corte de vedação"
                  width={600}
                  height={800}
                  className="w-full h-auto object-contain"
                  quality={90}
                  priority
                />
              </div>

              {/* Technical caption */}
              <p className="mt-sm font-mono text-sm tracking-wider uppercase text-black-70">
                CORTE TÉCNICO - SISTEMA DE VEDAÇÃO LSF
              </p>
            </div>
          </motion.div>

          {/* Right side - Methodology list with markers */}
          <motion.div variants={itemVariants} className="flex flex-col justify-start gap-lg">
            <div className="space-y-lg">
              {data.itens.map((item, index) => (
                <motion.div
                  key={item.letra}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.2 + index * 0.1,
                    duration: 0.5,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  viewport={{ once: true }}
                  className="flex gap-md"
                >
                  {/* Circular letter marker */}
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full border-2 border-black bg-white font-mono text-base lg:text-lg font-bold text-black">
                      {item.letra}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-xs">
                    {/* Connecting line */}
                    <div className="absolute -ml-md h-px w-md bg-black-30 mt-4" style={{ marginLeft: "-2rem" }} />

                    <h3 className="font-semibold text-lg lg:text-xl text-black uppercase tracking-tight">
                      {item.titulo}
                    </h3>
                    <p className="mt-xs text-base leading-relaxed text-black-70">
                      {item.descricao}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
