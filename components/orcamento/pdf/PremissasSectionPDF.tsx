import { METODOLOGIA_LSF } from "@/lib/orcamento-data";

/**
 * PremissasSectionPDF - Header da seção + Metodologia A-D
 * Alinhado com PremissasUnificadasSection da web
 */
export function PremissasSectionPDF() {
  return (
    <section className="py-8 bg-[#F4F2EC] w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] font-mono text-black/60 mb-2">
            02 — Premissas adotadas para o orçamento
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-black mb-4">
            METODOLOGIA E DOCUMENTAÇÃO TÉCNICA
          </h2>
          <p className="text-base text-black/70 leading-relaxed max-w-2xl">
            Apresentação detalhada da metodologia construtiva, projeto de referência, documentação técnica e especificações de materiais que fundamentam este orçamento.
          </p>
        </div>

        {/* Metodologia Construtiva A-D */}
        <div className="bg-white rounded-xl p-6 border border-black/5">
          <div className="space-y-4">
            {METODOLOGIA_LSF.itens.map((item, index) => (
              <div key={index} className="flex gap-4">
                <span className="w-8 h-8 rounded-full border-2 border-black bg-white text-black text-sm font-bold flex items-center justify-center flex-shrink-0 font-mono">
                  {item.letra}
                </span>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm font-semibold text-black uppercase tracking-tight">{item.titulo}</p>
                  <p className="text-sm text-black/60 leading-relaxed mt-0.5">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
