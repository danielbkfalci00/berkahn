import { OrcamentoHero } from "@/components/orcamento/OrcamentoHero";
import { SobreSection } from "@/components/orcamento/SobreSection";
import { PremissasUnificadasSection } from "@/components/orcamento/PremissasUnificadasSection";
import { PacotesInvestimento } from "@/components/orcamento/PacotesInvestimento";
import { PaymentConditions } from "@/components/orcamento/PaymentConditions";
import { PlanoGerenciamentoSection } from "@/components/orcamento/PlanoGerenciamentoSection";
import { InfograficoLSF } from "@/components/orcamento/InfograficoLSF";
import { DiferenciaisLSF } from "@/components/orcamento/DiferenciaisLSF";
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

interface PDFPageProps {
  searchParams: Promise<{ pacote?: string }>;
}

/**
 * Página otimizada para geração de PDF via Puppeteer
 *
 * Esta página:
 * - Reutiliza TODOS os componentes existentes da página de orçamento
 * - Remove header fixo e navegação lateral (não necessários no PDF)
 * - Aplica classe "pdf-mode" para desabilitar animações e forçar layout estático
 * - Recebe pacote selecionado via query parameter
 *
 * Não é uma página para acesso direto - é renderizada pelo Puppeteer para gerar PDF
 */
export default async function OrcamentoPDFPage({ searchParams }: PDFPageProps) {
  const params = await searchParams;
  const pacoteSelecionadoId = params.pacote || "material-acompanhamento-berkahn";

  const numeroOrcamento = gerarNumeroOrcamento();
  const dataValidade = calcularDataValidade(20);

  // Encontra o pacote selecionado para calcular valor dinâmico
  const pacoteSelecionado = PACOTES_TEMPLATE.find(p => p.id === pacoteSelecionadoId) || PACOTES_TEMPLATE[0];
  const valorTotal = pacoteSelecionado.valorTotal;

  return (
    <main className="pdf-mode">
      {/* Seção 1: Hero/Capa Premium */}
      <section id="hero" className="pdf-page-break-after">
        <OrcamentoHero
          projeto={PROJETO_TEMPLATE}
          numeroOrcamento={numeroOrcamento}
          validoAte={dataValidade}
        />
      </section>

      {/* Seção 2: Sobre a Berkahn */}
      <SobreSection />

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

      {/* Seção 3: Premissas Adotadas para Orçamento */}
      <section id="premissas">
        <PremissasUnificadasSection />
      </section>

      {/* Seção 4: Proposta de Investimento */}
      <section id="investimento">
        <PacotesInvestimento
          pacotes={PACOTES_TEMPLATE}
          metragemProjeto={PROJETO_TEMPLATE.metragem}
          pacoteSelecionadoId={pacoteSelecionadoId}
          isPDFMode={true}
        />
      </section>

      {/* Seção 5: Condições de Pagamento */}
      <section id="pagamento">
        <PaymentConditions
          condicoes={CONDICOES_PAGAMENTO}
          valorTotal={valorTotal}
        />
      </section>

      {/* Seção 6: Plano de Gerenciamento */}
      <section id="plano">
        {PROJETO_TEMPLATE.planoGerenciamento && (
          <PlanoGerenciamentoSection plano={PROJETO_TEMPLATE.planoGerenciamento} />
        )}
      </section>

      {/* Seção 7: Infográficos LSF */}
      <InfograficoLSF />

      {/* Seção 8: Diferenciais Steel Frame */}
      <DiferenciaisLSF
        comparativo={COMPARATIVO_ORCAMENTO}
        beneficios={BENEFICIOS_LSF_STATS}
      />

      {/* Seção 9: CTA Final / Contato */}
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
