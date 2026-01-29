"use client";

import { ProjetoChaleSubsection } from "./ProjetoChaleSubsection";
import { PlantasElevacoesSubsection } from "./PlantasElevacoesSubsection";
import { SectionLabel } from "./SectionLabel";
import { CHALE_PROJETO } from "@/lib/orcamento-data";

/**
 * Seção hierárquica: Projetos Considerados na Proposta
 * Agrupa as 3 subseções relativas à letra E da metodologia:
 * - Projeto Chalé
 * - Plantas & Elevações Técnicas
 * - Descrição Analítica de Materiais
 */
export function ProjetosConsideradosSection() {
  return (
    <>
      {/* Header da seção agrupadora com SectionLabel 2.1 */}
      <section className="bg-white py-lg">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionLabel number="2.1" title="Projetos Considerados na Proposta" variant="light" />
        </div>
      </section>

      {/* 2 subseções filhas */}
      <ProjetoChaleSubsection data={CHALE_PROJETO} isNested={true} />
      <PlantasElevacoesSubsection data={CHALE_PROJETO} isNested={true} />
    </>
  );
}
