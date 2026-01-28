"use client";

import { useState } from "react";
import { OrcamentoHero } from "@/components/orcamento/OrcamentoHero";
import { SobreSectionPDF } from "@/components/orcamento/pdf/SobreSectionPDF";
import { MetodologiaPDF } from "@/components/orcamento/pdf/MetodologiaPDF";
import { ProjetoPrototipoPDF } from "@/components/orcamento/pdf/ProjetoPrototipoPDF";
import { PlantasPDF } from "@/components/orcamento/pdf/PlantasPDF";
import { ElevacoesPDF } from "@/components/orcamento/pdf/ElevacoesPDF";
import { MateriaisPDF } from "@/components/orcamento/pdf/MateriaisPDF";
import { PacotesInvestimento } from "@/components/orcamento/PacotesInvestimento";
import { PaymentConditions } from "@/components/orcamento/PaymentConditions";
import { PlanoGerenciamentoSectionPDF } from "@/components/orcamento/pdf/PlanoGerenciamentoSectionPDF";
import { InfograficoLSFPDF } from "@/components/orcamento/pdf/InfograficoLSFPDF";
import { DiferenciaisLSFPDF } from "@/components/orcamento/pdf/DiferenciaisLSFPDF";
import { CTAFinal } from "@/components/orcamento/CTAFinal";

import {
  PROJETO_TEMPLATE,
  PACOTES_TEMPLATE,
  COMPARATIVO_ORCAMENTO,
  BENEFICIOS_LSF_STATS,
  CONTATOS,
  CONDICOES_PAGAMENTO,
  gerarNumeroOrcamento,
  calcularDataValidade,
} from "@/lib/orcamento-data";

export default function OrcamentoPDFPage() {
  const numeroOrcamento = gerarNumeroOrcamento();
  const dataValidade = calcularDataValidade(20);

  const [pacoteSelecionadoId, setPacoteSelecionadoId] = useState<string>(
    PACOTES_TEMPLATE.find(p => p.destaque)?.id || PACOTES_TEMPLATE[0].id
  );

  const pacoteSelecionado = PACOTES_TEMPLATE.find(p => p.id === pacoteSelecionadoId) || PACOTES_TEMPLATE[0];
  const valorTotal = pacoteSelecionado.valorTotal;

  return (
    <main className="relative bg-white">
      {/* Slide 1: Hero/Capa */}
      <section className="min-h-screen">
        <OrcamentoHero
          projeto={PROJETO_TEMPLATE}
          numeroOrcamento={numeroOrcamento}
          validoAte={dataValidade}
        />
      </section>

      {/* Slide 2: Sobre a Berkahn */}
      <section className="min-h-screen flex items-center">
        <SobreSectionPDF />
      </section>

      {/* Slide 3: Vantagens Steel Frame */}
      <section className="min-h-screen flex items-center">
        <InfograficoLSFPDF />
      </section>

      {/* Slide 4: Comparativo LSF vs Alvenaria */}
      <section className="min-h-screen flex items-center">
        <DiferenciaisLSFPDF
          comparativo={COMPARATIVO_ORCAMENTO}
          beneficios={BENEFICIOS_LSF_STATS}
        />
      </section>

      {/* Slide 5: Metodologia Construtiva (COM imagem técnica) */}
      <section className="min-h-screen flex items-center">
        <MetodologiaPDF />
      </section>

      {/* Slide 4: Projeto Chalé - Protótipos (COM 4 fotos) */}
      <section className="min-h-screen flex items-center">
        <ProjetoPrototipoPDF />
      </section>

      {/* Slide 5: Plantas Baixas (COM 2 plantas) */}
      <section className="min-h-screen flex items-center">
        <PlantasPDF />
      </section>

      {/* Slide 6: Elevações Técnicas (COM 4 elevações) */}
      <section className="min-h-screen flex items-center">
        <ElevacoesPDF />
      </section>

      {/* Slide 7: Descrição Analítica de Materiais */}
      <section className="min-h-screen flex items-center">
        <MateriaisPDF />
      </section>

      {/* Slide 8: Proposta de Investimento */}
      <section className="min-h-screen flex items-center">
        <div className="w-full">
          <PacotesInvestimento
            pacotes={PACOTES_TEMPLATE}
            metragemProjeto={PROJETO_TEMPLATE.metragem}
            onPacoteSelecionado={setPacoteSelecionadoId}
            pacoteSelecionadoId={pacoteSelecionadoId}
            isPDFMode={true}
          />
        </div>
      </section>

      {/* Slide 9: Condições de Pagamento */}
      <section className="min-h-screen flex items-center">
        <div className="w-full">
          <PaymentConditions
            condicoes={CONDICOES_PAGAMENTO}
            valorTotal={valorTotal}
          />
        </div>
      </section>

      {/* Slide 12: Plano de Gerenciamento */}
      <section className="min-h-screen flex items-center">
        <div className="w-full">
          {PROJETO_TEMPLATE.planoGerenciamento && (
            <PlanoGerenciamentoSectionPDF plano={PROJETO_TEMPLATE.planoGerenciamento} />
          )}
        </div>
      </section>

      {/* Slide 13: CTA Final / Contato */}
      <section className="min-h-screen">
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
