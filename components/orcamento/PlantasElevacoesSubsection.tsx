"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SectionMarker } from "./SectionMarker";
import { DrawingFrame } from "./DrawingFrame";
import type { ChaleProjeto } from "@/types/orcamento";
import { useState } from "react";

interface PlantasElevacoesSubsectionProps {
  data: ChaleProjeto;
  isNested?: boolean; // Quando true, renderiza dentro de ProjetosConsideradosSection
}

/**
 * Subsecção: Plantas & Elevações
 * Layout: Blueprint-style grid (2 plantas + 4 elevações) sobre fundo preto
 * Background: Black #000000
 * Apresentação: Frames brancos com labels técnicos
 */
export function PlantasElevacoesSubsection({ data, isNested }: PlantasElevacoesSubsectionProps) {
  const [expandedImage, setExpandedImage] = useState<{
    src: string;
    label: string;
  } | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <section className="relative py-xl bg-black">
      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header with section marker and breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-lg space-y-2"
        >
          {/* Breadcrumb contextual - only when nested, colors inverted for black background */}
          {isNested && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 font-mono">
              Premissas Adotadas → Projetos Considerados → Plantas & Elevações
            </p>
          )}

          {/* Título da subseção */}
          <h3 className="text-xl font-bold tracking-tight text-white uppercase">
            PLANTAS & ELEVAÇÕES TÉCNICAS
          </h3>
        </motion.div>

        {/* Plants section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-xl"
        >
          <p className="text-sm uppercase tracking-widest text-white-70 mb-6 font-mono">
            Plantas Baixas
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {data.imagens.plantasBaixas.map((planta) => (
              <DrawingFrame
                key={planta.label}
                src={planta.src}
                label={planta.label}
                onOpen={() => setExpandedImage(planta)}
              />
            ))}
          </div>
        </motion.div>

        {/* Decorative divider line */}
        <div className="h-px bg-white-10 my-xl" />

        {/* Elevations section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-sm uppercase tracking-widest text-white-70 mb-6 font-mono">
            Elevações
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {data.imagens.elevacoes.map((elevacao) => (
              <DrawingFrame
                key={elevacao.label}
                src={elevacao.src}
                label={elevacao.label}
                onOpen={() => setExpandedImage(elevacao)}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox/Modal for expanded images */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative max-h-[85vh] max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-white-70 transition-colors"
              aria-label="Fechar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <img
              src={expandedImage.src}
              alt={expandedImage.label}
              className="max-h-[85vh] max-w-[85vw] w-auto h-auto object-contain drop-shadow-2xl"
            />

            <p className="mt-4 text-center font-mono text-sm tracking-wider uppercase text-white">
              {expandedImage.label}
            </p>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
