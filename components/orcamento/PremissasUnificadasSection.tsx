"use client";

import { motion } from "framer-motion";
import { MetodologiaSubsection } from "./MetodologiaSubsection";
import { ProjetoChaleSubsection } from "./ProjetoChaleSubsection";
import { PlantasElevacoesSubsection } from "./PlantasElevacoesSubsection";
import { MaterialsTableSubsection } from "./MaterialsTableSubsection";
import {
  CHALE_PROJETO,
  METODOLOGIA_LSF,
  MATERIAIS_ANALITICOS,
} from "@/lib/orcamento-data";

/**
 * Seção Premissas Adotadas para Orçamento (UNIFICADA)
 *
 * Consolida:
 * - ESCOPO DA PROPOSTA → MetodologiaSubsection
 * - Projeto Chalé → ProjetoChaleSubsection
 * - Plantas & Elevações → PlantasElevacoesSubsection
 * - Materiais → MaterialsTableSubsection
 *
 * Design: Exposição Arquitetônica
 * - Cada subsecção tem visual único com backgrounds alternados
 * - Background progression: Off-White → White → Black → Off-White
 * - Cria ritmo visual e distinção clara entre seções
 *
 * Estilo: Premium, minimalista, moderno, alto padrão
 * - Paleta monocromática (preto, branco, off-white)
 * - Tipografia e espaçamento do design system existente
 * - Animações scroll-reveal com Framer Motion
 *
 * Hierarquia Visual:
 * - Header principal com número "P" gigante de fundo
 * - Breadcrumbs em cada subseção para contextualizar
 * - Títulos H2 (seção) e H3 (subseções) para semântica clara
 */
export function PremissasUnificadasSection() {
  return (
    <section className="relative">
      {/* Número gigante "P" de fundo - Seção Principal */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-12 md:top-20 lg:top-24 right-4 md:right-8 lg:right-12 text-[180px] md:text-[220px] lg:text-[280px] font-black text-black/[0.015] leading-none select-none font-heading pointer-events-none z-0"
      >
        P
      </motion.span>

      {/* Header da Seção Principal */}
      <div className="container px-4 sm:px-6 lg:px-8 pt-xl pb-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          {/* Supra-título */}
          <p className="text-xs uppercase tracking-[0.3em] text-black/70 font-mono mb-2">
            Seção Principal
          </p>

          {/* Título Principal H2 */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black mb-4">
            PREMISSAS ADOTADAS PARA O ORÇAMENTO
          </h2>

          {/* Descrição */}
          <p className="text-base text-black/70 leading-relaxed max-w-2xl mb-8">
            Apresentação detalhada da metodologia construtiva, projeto de referência, documentação técnica e especificações de materiais que fundamentam este orçamento.
          </p>

          {/* Linha decorativa */}
          <div className="flex items-center gap-4">
            <div className="w-32 h-[1px] bg-black/10" />
            <div className="w-3 h-3 rotate-45 bg-black/20" />
            <div className="w-32 h-[1px] bg-black/10" />
          </div>
        </motion.div>
      </div>

      {/* Subsecção 1: Metodologia Construtiva (Off-White) */}
      <MetodologiaSubsection data={METODOLOGIA_LSF} />

      {/* Subsecção 2: Projeto Chalé (White) */}
      <ProjetoChaleSubsection data={CHALE_PROJETO} />

      {/* Subsecção 3: Plantas & Elevações (Black) */}
      <PlantasElevacoesSubsection data={CHALE_PROJETO} />

      {/* Subsecção 4: Descrição Analítica de Materiais (Off-White) */}
      <MaterialsTableSubsection data={MATERIAIS_ANALITICOS} />
    </section>
  );
}
