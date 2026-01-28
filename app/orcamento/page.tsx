"use client";

import { OrcamentoHeader } from "@/components/orcamento/OrcamentoHeader";
import { OrcamentoHero } from "@/components/orcamento/OrcamentoHero";
// Seção Índice
import { IndiceSection } from "@/components/orcamento/IndiceSection";
// Seção Sobre - Storytelling com propósito
import { SobreSection } from "@/components/orcamento/SobreSection";
import { PacotesInvestimento } from "@/components/orcamento/PacotesInvestimento";
import { InfograficoLSF } from "@/components/orcamento/InfograficoLSF";
import { CTAFinal } from "@/components/orcamento/CTAFinal";
// Novos componentes para Chalé Johny
import { PremissasUnificadasSection } from "@/components/orcamento/PremissasUnificadasSection";
import { MateriaisSection } from "@/components/orcamento/MateriaisSection";
import { PlanoGerenciamentoSection } from "@/components/orcamento/PlanoGerenciamentoSection";
import { NaoIncluiSubsection } from "@/components/orcamento/NaoIncluiSubsection";
import { SectionLabel } from "@/components/orcamento/SectionLabel";
import { PaymentConditions } from "@/components/orcamento/PaymentConditions";

import {
  PROJETO_TEMPLATE,
  PACOTES_TEMPLATE,
  PREMISSAS_TEMPLATE,
  COMPANY_STORY,
  CONTATOS,
  CONDICOES_PAGAMENTO,
  gerarNumeroOrcamento,
  calcularDataValidade,
} from "@/lib/orcamento-data";

export default function OrcamentoPage() {
  const numeroOrcamento = gerarNumeroOrcamento();
  const dataValidade = calcularDataValidade(20); // Validade de 20 dias

  // Usa o pacote recomendado (destaque) para o valor total de referência
  const pacoteRecomendado = PACOTES_TEMPLATE.find(p => p.destaque) || PACOTES_TEMPLATE[0];
  const valorTotal = pacoteRecomendado.valorTotal;

  return (
    <main className="relative">
      {/* Header com indicador de seção dinâmico */}
      <OrcamentoHeader projeto={PROJETO_TEMPLATE} />

      {/* Seção 1: Hero/Capa Premium */}
      <section id="hero">
        <OrcamentoHero
          projeto={PROJETO_TEMPLATE}
          numeroOrcamento={numeroOrcamento}
          validoAte={dataValidade}
        />
      </section>

      {/* Seção 2: Índice */}
      <IndiceSection />

      {/* Seção 3: Sobre a Berkahn - Storytelling com propósito */}
      <section id="sobre">
        <SobreSection />
      </section>

      {/* Seção 3-4: Steel Frame - Eficiência Comprovada */}
      <section id="lsf">
        <InfograficoLSF />
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

      {/* Seção 6: Descrição Analítica de Materiais */}
      <section id="materiais">
        <MateriaisSection />
      </section>

      {/* Subseção: Itens Não Inclusos (parte da seção 03) */}
      <div className="bg-[#F4F2EC] pt-8">
        <div className="container px-4 sm:px-6 lg:px-8">
          <SectionLabel number="03" title="Descrição Analítica dos Materiais" variant="light" subtitle="Itens Não Inclusos" />
        </div>
      </div>
      <NaoIncluiSubsection itensExclusos={PREMISSAS_TEMPLATE.itensExclusos} />

      {/* Seção 7: Proposta de Investimento (CORE) - Pacotes */}
      <section id="investimento">
        <PacotesInvestimento
          pacotes={PACOTES_TEMPLATE}
          metragemProjeto={PROJETO_TEMPLATE.metragem}
        />
      </section>

      {/* Seção 8: Plano de Gerenciamento Berkahn */}
      <section id="plano">
        {PROJETO_TEMPLATE.planoGerenciamento && (
          <PlanoGerenciamentoSection plano={PROJETO_TEMPLATE.planoGerenciamento} />
        )}
      </section>

      {/* Seção 9: Condições de Pagamento */}
      <section id="pagamento">
        <PaymentConditions
          condicoes={CONDICOES_PAGAMENTO}
          valorTotal={valorTotal}
        />
      </section>

      {/* Seção 10: CTA Final / Contato */}
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
