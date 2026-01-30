"use client";
import { OrcamentoHero } from "@/components/orcamento/OrcamentoHero";
import { IndiceSectionPDF } from "@/components/orcamento/pdf/IndiceSectionPDF";
import { SobreSectionPDF } from "@/components/orcamento/pdf/SobreSectionPDF";
import { InfograficoLSFPDF } from "@/components/orcamento/pdf/InfograficoLSFPDF";
import { PremissasSectionPDF } from "@/components/orcamento/pdf/PremissasSectionPDF";
import { MetodologiaPDF } from "@/components/orcamento/pdf/MetodologiaPDF";
import { ProjetoPrototipoPDF } from "@/components/orcamento/pdf/ProjetoPrototipoPDF";
import { PlantasPDF } from "@/components/orcamento/pdf/PlantasPDF";
import { ElevacoesPDF } from "@/components/orcamento/pdf/ElevacoesPDF";
import { MateriaisPDF } from "@/components/orcamento/pdf/MateriaisPDF";
import { PacotesInvestimento } from "@/components/orcamento/PacotesInvestimento";
import { ItensInclususSubsection } from "@/components/orcamento/ItensInclususSubsection";
import { NaoIncluiSubsection } from "@/components/orcamento/NaoIncluiSubsection";
import { PaymentConditions } from "@/components/orcamento/PaymentConditions";
import { PlanoGerenciamentoSectionPDF } from "@/components/orcamento/pdf/PlanoGerenciamentoSectionPDF";
import { CTAFinal } from "@/components/orcamento/CTAFinal";
import { SectionLabel } from "@/components/orcamento/SectionLabel";

import {
  PROJETO_TEMPLATE,
  PACOTES_TEMPLATE,
  CONTATOS,
  CONDICOES_PAGAMENTO,
  PREMISSAS_TEMPLATE,
  gerarNumeroOrcamento,
  calcularDataValidade,
} from "@/lib/orcamento-data";

export default function OrcamentoPDFPage() {
  const numeroOrcamento = gerarNumeroOrcamento();
  const dataValidade = calcularDataValidade(20);

  const pacoteRecomendado = PACOTES_TEMPLATE.find(p => p.destaque) || PACOTES_TEMPLATE[0];
  const valorTotal = pacoteRecomendado.valorTotal;

  return (
    <main className="relative bg-white">
      {/* Slide 1: Hero/Capa */}
      <section className="h-screen">
        <OrcamentoHero
          projeto={PROJETO_TEMPLATE}
          numeroOrcamento={numeroOrcamento}
          validoAte={dataValidade}
        />
      </section>

      {/* Slide 2: Índice */}
      <section className="min-h-screen flex items-center">
        <IndiceSectionPDF />
      </section>

      {/* Slide 3: Sobre a Berkahn — Seção 01 */}
      <section className="min-h-screen flex items-center">
        <SobreSectionPDF />
      </section>

      {/* Slide 4: Vantagens Steel Frame — Seção 01 */}
      <section className="min-h-screen flex items-center">
        <InfograficoLSFPDF />
      </section>

      {/* Slide 5: Premissas — Seção 02 */}
      <section className="min-h-screen flex items-center">
        <PremissasSectionPDF />
      </section>

      {/* Slide 6: Metodologia Construtiva — Seção 02 */}
      <section className="min-h-screen flex items-center">
        <MetodologiaPDF />
      </section>

      {/* Slide 7: Projeto Protótipo — Seção 02 */}
      <section className="min-h-screen flex items-center">
        <ProjetoPrototipoPDF />
      </section>

      {/* Slide 8: Plantas Baixas — Seção 02 */}
      <section className="min-h-screen flex items-center">
        <PlantasPDF />
      </section>

      {/* Slide 9: Elevações Técnicas — Seção 02 */}
      <section className="min-h-screen flex items-center">
        <ElevacoesPDF />
      </section>

      {/* Slide 10: Materiais — Seção 03 */}
      <section className="min-h-screen flex items-center">
        <MateriaisPDF />
      </section>

      {/* Slide 11: Proposta de Investimento — Seção 04 */}
      <section className="min-h-screen flex items-center">
        <PacotesInvestimento
          pacotes={PACOTES_TEMPLATE}
          metragemProjeto={PROJETO_TEMPLATE.metragem}
          isPDFMode={true}
        />
      </section>

      {/* Slide 11b: Itens Inclusos — Seção 4.1 */}
      <section className="min-h-screen flex flex-col justify-center bg-black">
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
          <SectionLabel number="04" title="Planilha Orçamentária" variant="dark" subtitle="4.1 Itens Inclusos" />
        </div>
        <ItensInclususSubsection itensInclusos={PREMISSAS_TEMPLATE.itensInclusos} />
      </section>

      {/* Slide 11c: Itens Exclusos — Seção 4.2 */}
      <section className="min-h-screen flex flex-col justify-center bg-black">
        <div className="container px-4 sm:px-6 lg:px-8 py-8">
          <SectionLabel number="04" title="Planilha Orçamentária" variant="dark" subtitle="4.2 Itens Exclusos" />
        </div>
        <NaoIncluiSubsection itensExclusos={PREMISSAS_TEMPLATE.itensExclusos} />
      </section>

      {/* Slide 12: Plano de Gerenciamento — Seção 05 */}
      <section className="min-h-screen flex items-center">
        {PROJETO_TEMPLATE.planoGerenciamento && (
          <PlanoGerenciamentoSectionPDF plano={PROJETO_TEMPLATE.planoGerenciamento} />
        )}
      </section>

      {/* Slide 13: Pagamento — Seção 06 */}
      <section className="min-h-screen flex items-center">
        <PaymentConditions
          condicoes={CONDICOES_PAGAMENTO}
          valorTotal={valorTotal}
          isPDFMode={true}
        />
      </section>

      {/* Slide 14: CTA Final / Contato */}
      <section className="min-h-screen">
        <CTAFinal
          projeto={PROJETO_TEMPLATE}
          validoAte={dataValidade}
          numeroOrcamento={numeroOrcamento}
          contatos={CONTATOS}
          isPDFMode={true}
        />
      </section>
    </main>
  );
}
