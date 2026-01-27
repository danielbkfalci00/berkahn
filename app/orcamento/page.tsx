"use client";

import { useState } from "react";
import { OrcamentoHeader } from "@/components/orcamento/OrcamentoHeader";
import { OrcamentoHero } from "@/components/orcamento/OrcamentoHero";
// Seções de Storytelling Humanizado (substituem AboutInstitucional e AboutBigNumbers)
import { CompanyStorySection } from "@/components/orcamento/CompanyStorySection";
import { InsightsNarrativeSection } from "@/components/orcamento/InsightsNarrativeSection";
import { CertificationsExplained } from "@/components/orcamento/CertificationsExplained";
import { PacotesInvestimento } from "@/components/orcamento/PacotesInvestimento";
import { InfograficoLSF } from "@/components/orcamento/InfograficoLSF";
import { DiferenciaisLSF } from "@/components/orcamento/DiferenciaisLSF";
import { CTAFinal } from "@/components/orcamento/CTAFinal";
// Novos componentes para Chalé Johny
import { PremissasUnificadasSection } from "@/components/orcamento/PremissasUnificadasSection";
import { PlanoGerenciamentoSection } from "@/components/orcamento/PlanoGerenciamentoSection";
import { PaymentConditions } from "@/components/orcamento/PaymentConditions";

import {
  PROJETO_TEMPLATE,
  PACOTES_TEMPLATE,
  PREMISSAS_TEMPLATE,
  COMPANY_STORY,
  COMPARATIVO_ORCAMENTO,
  BENEFICIOS_LSF_STATS,
  CONTATOS,
  CONDICOES_PAGAMENTO,
  gerarNumeroOrcamento,
  calcularDataValidade,
} from "@/lib/orcamento-data";

export default function OrcamentoPage() {
  const numeroOrcamento = gerarNumeroOrcamento();
  const dataValidade = calcularDataValidade(20); // Validade de 20 dias

  // Estado para seleção interativa de pacote
  const [pacoteSelecionadoId, setPacoteSelecionadoId] = useState<string>(
    PACOTES_TEMPLATE.find(p => p.destaque)?.id || PACOTES_TEMPLATE[0].id
  );

  // Calcula valor dinâmico baseado no pacote selecionado
  const pacoteSelecionado = PACOTES_TEMPLATE.find(p => p.id === pacoteSelecionadoId) || PACOTES_TEMPLATE[0];
  const valorTotal = pacoteSelecionado.valorTotal;

  return (
    <main className="relative">
      {/* Header Fixo */}
      <OrcamentoHeader
        projeto={PROJETO_TEMPLATE}
        numeroOrcamento={numeroOrcamento}
      />

      {/* Seção 1: Hero/Capa Premium */}
      <OrcamentoHero
        projeto={PROJETO_TEMPLATE}
        numeroOrcamento={numeroOrcamento}
        validoAte={dataValidade}
      />

      {/* Seção 2: Company Story - Storytelling Humanizado */}
      <CompanyStorySection story={COMPANY_STORY} />

      {/* Seção 3: Insights Narrativos - O que aprendemos */}
      <InsightsNarrativeSection story={COMPANY_STORY} />

      {/* Seção 3.5: Certificações Explicadas */}
      <CertificationsExplained
        certifications={COMPANY_STORY.certificationsExplained}
      />

      {/* Transição Visual */}
      <div className="relative h-24 bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="w-32 h-[1px] bg-black/10" />
            <div className="w-3 h-3 rotate-45 bg-black/20" />
            <div className="w-32 h-[1px] bg-black/10" />
          </div>
        </div>
      </div>

      {/* Seção 4-7: Premissas Adotadas para Orçamento (Unificada) */}
      <PremissasUnificadasSection />

      {/* Seção 7: Proposta de Investimento (CORE) - 2 Pacotes */}
      <PacotesInvestimento
        pacotes={PACOTES_TEMPLATE}
        metragemProjeto={PROJETO_TEMPLATE.metragem}
        onPacoteSelecionado={setPacoteSelecionadoId}
        pacoteSelecionadoId={pacoteSelecionadoId}
      />

      {/* Seção 8: Condições de Pagamento */}
      <PaymentConditions
        condicoes={CONDICOES_PAGAMENTO}
        valorTotal={valorTotal}
      />

      {/* Seção 9: Plano de Gerenciamento Berkahn */}
      {PROJETO_TEMPLATE.planoGerenciamento && (
        <PlanoGerenciamentoSection plano={PROJETO_TEMPLATE.planoGerenciamento} />
      )}

      {/* Seção 10: Infográficos LSF Animados */}
      <InfograficoLSF />

      {/* Seção 12: Diferenciais Steel Frame com Comparativo */}
      <DiferenciaisLSF
        comparativo={COMPARATIVO_ORCAMENTO}
        beneficios={BENEFICIOS_LSF_STATS}
      />

      {/* Seção 13: CTA Final Premium */}
      <CTAFinal
        projeto={PROJETO_TEMPLATE}
        validoAte={dataValidade}
        numeroOrcamento={numeroOrcamento}
        contatos={CONTATOS}
      />
    </main>
  );
}
