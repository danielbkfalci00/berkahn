"use client";

import { motion } from "framer-motion";
import { SectionMarker } from "./SectionMarker";
import type { MaterialAnalise } from "@/types/orcamento";

interface MaterialsTableSubsectionProps {
  data: MaterialAnalise[];
  isNested?: boolean; // Quando true, renderiza dentro de ProjetosConsideradosSection
}

/**
 * Subsecção: Descrição Analítica de Materiais
 * Layout: Tabela limpa com linhas separadoras sutis
 * Background: Off-White #F4F2EC
 * Apresentação: Marcadores circulares (A-E) com especificações detalhadas
 */
export function MaterialsTableSubsection({ data, isNested }: MaterialsTableSubsectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
    },
  };

  return (
    <section className="relative py-xl bg-[#F4F2EC]">
      {/* Section marker line (architectural drawing style) */}
      <div className="absolute left-0 top-0 h-px w-full bg-black-10" />

      <div className="container px-4 sm:px-6 lg:px-8">
        {/* Header with section marker and breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-lg space-y-2"
        >
          {/* Breadcrumb contextual - only when nested */}
          {isNested && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/50 font-mono">
              Premissas Adotadas → Projetos Considerados → Descrição Analítica
            </p>
          )}

          {/* Título da subseção */}
          <h3 className="text-xl font-bold tracking-tight text-black uppercase">
            DESCRIÇÃO ANALÍTICA DE MATERIAIS
          </h3>
        </motion.div>

        {/* Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="overflow-hidden"
        >
          <table className="w-full">
            <tbody>
              {data.map((item, index) => (
                <motion.tr
                  key={item.letra}
                  variants={rowVariants}
                  className={`group transition-colors duration-300 ${
                    index % 2 === 0 ? "bg-transparent hover:bg-white-50" : "bg-white-30 hover:bg-white-50"
                  }`}
                >
                  {/* Letter marker circle */}
                  <td className="w-16 px-4 py-6 align-top">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white font-mono text-sm font-bold text-black flex-shrink-0">
                      {item.letra}
                    </div>
                  </td>

                  {/* Category column */}
                  <td className="px-4 py-6 align-top">
                    <h3 className="font-semibold text-base uppercase tracking-tight text-black">
                      {item.categoria}
                    </h3>
                  </td>

                  {/* Specification column */}
                  <td className="px-4 py-6 align-top">
                    <p className="text-sm leading-relaxed text-black-70">
                      {item.especificacao}
                    </p>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Subtle bottom border */}
          <div className="h-px bg-black-10 mt-sm" />
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-lg text-xs uppercase tracking-widest text-black-70 font-mono"
        >
          Especificações sujeitas a alterações conforme projeto executivo
        </motion.p>
      </div>
    </section>
  );
}
