"use client";

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
 */
export function PremissasUnificadasSection() {
  return (
    <>
      {/* Subsecção 1: Metodologia Construtiva (Off-White) */}
      <MetodologiaSubsection data={METODOLOGIA_LSF} />

      {/* Subsecção 2: Projeto Chalé (White) */}
      <ProjetoChaleSubsection data={CHALE_PROJETO} />

      {/* Subsecção 3: Plantas & Elevações (Black) */}
      <PlantasElevacoesSubsection data={CHALE_PROJETO} />

      {/* Subsecção 4: Descrição Analítica de Materiais (Off-White) */}
      <MaterialsTableSubsection data={MATERIAIS_ANALITICOS} />
    </>
  );
}
