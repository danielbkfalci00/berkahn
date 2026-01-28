"use client";

import { useState } from "react";
import { OrcamentoHeader } from "@/components/orcamento/OrcamentoHeader";
import { OrcamentoHero } from "@/components/orcamento/OrcamentoHero";
import { OrcamentoSideNav } from "@/components/orcamento/OrcamentoSideNav";
// Seção Sobre - Storytelling com propósito
import { SobreSection } from "@/components/orcamento/SobreSection";
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
      {/* Navegação lateral fixa - Blueprint Style */}
      <OrcamentoSideNav />

      {/* Header Fixo */}
      <OrcamentoHeader
        projeto={PROJETO_TEMPLATE}
        numeroOrcamento={numeroOrcamento}
        pacoteSelecionadoId={pacoteSelecionadoId}
      />

      {/* Seção 1: Hero/Capa Premium */}
      <section id="hero">
        <OrcamentoHero
          projeto={PROJETO_TEMPLATE}
          numeroOrcamento={numeroOrcamento}
          validoAte={dataValidade}
        />
      </section>

      {/* Seção 2: Sobre a Berkahn - Storytelling com propósito */}
      <section id="sobre">
        <SobreSection />
      </section>

      {/* Seção 3-4: Steel Frame - Infográficos + Diferenciais */}
      <section id="lsf">
        <InfograficoLSF />
        <DiferenciaisLSF
          comparativo={COMPARATIVO_ORCAMENTO}
          beneficios={BENEFICIOS_LSF_STATS}
        />
      </section>

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

      {/* Seção 5: Premissas Adotadas para Orçamento (Unificada) */}
      <section id="premissas">
        <PremissasUnificadasSection />
      </section>

      {/* Seção 7: Proposta de Investimento (CORE) - 2 Pacotes */}
      <section id="investimento">
        <PacotesInvestimento
          pacotes={PACOTES_TEMPLATE}
          metragemProjeto={PROJETO_TEMPLATE.metragem}
          onPacoteSelecionado={setPacoteSelecionadoId}
          pacoteSelecionadoId={pacoteSelecionadoId}
        />
      </section>

      {/* Seção 8: Condições de Pagamento */}
      <section id="pagamento">
        <PaymentConditions
          condicoes={CONDICOES_PAGAMENTO}
          valorTotal={valorTotal}
        />
      </section>

      {/* Seção 9: Plano de Gerenciamento Berkahn */}
      <section id="plano">
        {PROJETO_TEMPLATE.planoGerenciamento && (
          <PlanoGerenciamentoSection plano={PROJETO_TEMPLATE.planoGerenciamento} />
        )}
      </section>

      {/* Seção 10: CTA Final Premium */}
      <section id="contato">
        <CTAFinal
          projeto={PROJETO_TEMPLATE}
          validoAte={dataValidade}
          numeroOrcamento={numeroOrcamento}
          contatos={CONTATOS}
        />
      </section>
    </main>
  );
}
