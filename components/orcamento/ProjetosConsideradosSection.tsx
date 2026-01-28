"use client";

import { motion } from "framer-motion";
import { ProjetoChaleSubsection } from "./ProjetoChaleSubsection";
import { PlantasElevacoesSubsection } from "./PlantasElevacoesSubsection";
import { CHALE_PROJETO } from "@/lib/orcamento-data";

/**
 * Seção hierárquica: Projetos Considerados na Proposta
 * Agrupa as 3 subseções relativas à letra E da metodologia:
 * - Projeto Chalé
 * - Plantas & Elevações Técnicas
 * - Descrição Analítica de Materiais
 */
export function ProjetosConsideradosSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      {/* Header da seção agrupadora - Letra E */}
      <section className="bg-[#E8E2D5] py-16">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl space-y-4"
          >
            {/* Marcador visual letra E */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black text-white font-mono text-xl font-bold"
            >
              E
            </motion.div>

            {/* Título */}
            <motion.h3
              variants={itemVariants}
              className="text-2xl lg:text-3xl font-bold tracking-tight text-black uppercase"
            >
              PROJETOS CONSIDERADOS NA PROPOSTA
            </motion.h3>

            {/* Descrição contextual */}
            <motion.p
              variants={itemVariants}
              className="text-black/70 leading-relaxed text-lg"
            >
              Projeto preliminar de Arquitetura, CHALÉ (01) com metragem total de 44m²,
              incluindo plantas baixas, elevações técnicas e descrição analítica dos materiais.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2 subseções filhas */}
      <ProjetoChaleSubsection data={CHALE_PROJETO} isNested={true} />
      <PlantasElevacoesSubsection data={CHALE_PROJETO} isNested={true} />
    </>
  );
}
