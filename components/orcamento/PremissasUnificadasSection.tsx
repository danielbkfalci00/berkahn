"use client";

import { motion } from "motion/react";
import { MetodologiaSubsection } from "./MetodologiaSubsection";
import { ProjetosConsideradosSection } from "./ProjetosConsideradosSection";
import { METODOLOGIA_LSF, PREMISSAS_TEMPLATE } from "@/lib/orcamento-data";
import { OrcamentoWatermark } from "./OrcamentoWatermark";
import { SectionLabel } from "./SectionLabel";

/**
 * Seção Premissas Adotadas para Orçamento (UNIFICADA)
 *
 * Hierarquia:
 * 1. METODOLOGIA CONSTRUTIVA (A-D)
 *    - Letras A, B, C, D com imagem técnica e descrições
 *
 * 2. PROJETOS CONSIDERADOS NA PROPOSTA (Letra E - nível hierárquico)
 *    ├── Projeto Chalé
 *    ├── Plantas & Elevações Técnicas
 *    └── Descrição Analítica de Materiais
 *
 * Design: Exposição Arquitetônica
 * - Background progression: Off-White → Bege → White → Black → Off-White
 * - Cria ritmo visual e hierarquia clara de conteúdos
 *
 * Estilo: Premium, minimalista, moderno, alto padrão
 * - Paleta monocromática (preto, branco, off-white, bege)
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
      <OrcamentoWatermark variant="light" logoPosition="top-right" />

      {/* Número gigante "P" de fundo - Seção Principal */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-12 md:top-20 lg:top-24 right-4 md:right-8 lg:right-12 text-[220px] md:text-[280px] lg:text-[360px] font-black text-black/[0.015] leading-none select-none font-heading pointer-events-none z-0"
      >
        P
      </motion.span>

      {/* Header da Seção Principal */}
      <div className="bg-[#F4F2EC] relative z-10">
      <div className="container px-4 sm:px-6 lg:px-8 pt-xl pb-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl"
        >
          <SectionLabel number="02" title="Premissas Adotadas para o Orçamento" variant="light" />

          {/* Título principal */}
          <h2 className="font-heading text-5xl lg:text-6xl font-bold text-black mb-6">
            METODOLOGIA E DOCUMENTAÇÃO TÉCNICA
          </h2>

          {/* Descrição */}
          <p className="text-lg text-black/70 leading-relaxed max-w-3xl">
            Apresentação detalhada da metodologia construtiva, projeto de referência, documentação técnica e especificações de materiais que fundamentam este orçamento.
          </p>
        </motion.div>
      </div>
      </div>

      {/* Seção 1: Metodologia Construtiva (Off-White) */}
      <MetodologiaSubsection data={METODOLOGIA_LSF} />

      {/* Seção 2: Projetos Considerados na Proposta (Letter E hierarchy) */}
      <ProjetosConsideradosSection />

    </section>
  );
}
