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
import { PaymentConditions } from "@/components/orcamento/PaymentConditions";
import { PlanoGerenciamentoSectionPDF } from "@/components/orcamento/pdf/PlanoGerenciamentoSectionPDF";
import { CTAFinal } from "@/components/orcamento/CTAFinal";

import {
  PROJETO_TEMPLATE,
  PACOTES_TEMPLATE,
  CONTATOS,
  CONDICOES_PAGAMENTO,
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
      <section className="h-screen flex items-center overflow-hidden">
        <IndiceSectionPDF />
      </section>

      {/* Slide 3: Sobre a Berkahn — Seção 01 */}
      <section className="h-screen flex items-center overflow-hidden">
        <SobreSectionPDF />
      </section>

      {/* Slide 4: Vantagens Steel Frame — Seção 01 */}
      <section className="h-screen flex items-center overflow-hidden">
        <InfograficoLSFPDF />
      </section>

      {/* Slide 5: Premissas — Seção 02 */}
      <section className="h-screen flex items-center overflow-hidden">
        <PremissasSectionPDF />
      </section>

      {/* Slide 6: Metodologia Construtiva — Seção 02 */}
      <section className="h-screen flex items-center overflow-hidden">
        <MetodologiaPDF />
      </section>

      {/* Slide 7: Projeto Protótipo — Seção 02 */}
      <section className="h-screen flex items-center overflow-hidden">
        <ProjetoPrototipoPDF />
      </section>

      {/* Slide 8: Plantas Baixas — Seção 02 */}
      <section className="h-screen flex items-center overflow-hidden">
        <PlantasPDF />
      </section>

      {/* Slide 9: Elevações Técnicas — Seção 02 */}
      <section className="h-screen flex items-center overflow-hidden">
        <ElevacoesPDF />
      </section>

      {/* Slide 10: Materiais — Seção 03 */}
      <section className="h-screen flex items-center overflow-hidden">
        <MateriaisPDF />
      </section>

      {/* Slide 11: Proposta de Investimento — Seção 04 */}
      <section className="h-screen flex items-center overflow-hidden">
        <div className="w-full">
          <PacotesInvestimento
            pacotes={PACOTES_TEMPLATE}
            metragemProjeto={PROJETO_TEMPLATE.metragem}
            isPDFMode={true}
          />
        </div>
      </section>

      {/* Slide 12: Plano de Gerenciamento — Seção 05 */}
      <section className="h-screen flex items-center overflow-hidden">
        <div className="w-full">
          {PROJETO_TEMPLATE.planoGerenciamento && (
            <PlanoGerenciamentoSectionPDF plano={PROJETO_TEMPLATE.planoGerenciamento} />
          )}
        </div>
      </section>

      {/* Slide 13: Pagamento — Seção 06 */}
      <section className="h-screen flex items-center overflow-hidden">
        <div className="w-full">
          <PaymentConditions
            condicoes={CONDICOES_PAGAMENTO}
            valorTotal={valorTotal}
          />
        </div>
      </section>

      {/* Slide 14: CTA Final / Contato */}
      <section className="h-screen">
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
