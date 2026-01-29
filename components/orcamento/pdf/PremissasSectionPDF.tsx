import { METODOLOGIA_LSF } from "@/lib/orcamento-data";

/**
 * PremissasSectionPDF - Versão compacta sem imagens
 * Apenas texto, tabelas e listas
 */
export function PremissasSectionPDF() {
  return (
    <section className="py-8 bg-white w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] font-mono text-black/60 mb-2">
            02 — Premissas adotadas para o orçamento
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-black mb-3">
            PREMISSAS ADOTADAS PARA O ORÇAMENTO
          </h2>
          <p className="text-sm text-black/60 max-w-2xl">
            Metodologia construtiva, projeto de referência e especificações de materiais.
          </p>
        </div>

        {/* Grid: Metodologia + Projeto */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Metodologia Construtiva */}
          <div className="bg-[#F4F2EC] rounded-xl p-6">
            <h3 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
              Metodologia Construtiva
            </h3>
            <div className="space-y-3">
              {METODOLOGIA_LSF.itens.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {item.letra}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-black">{item.titulo}</p>
                    <p className="text-xs text-black/60">{item.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projeto Considerado */}
          <div className="bg-white border border-black/10 rounded-xl p-6">
            <h3 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">
              Projeto: Chalé (01)
            </h3>
            <div className="space-y-4">
              <div className="text-center py-4 bg-black/5 rounded-lg">
                <span className="text-4xl font-bold text-black">44m²</span>
                <p className="text-xs text-black/60 mt-1">Área Total</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/60">Quarto</span>
                  <span className="font-semibold">10 m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Banheiro</span>
                  <span className="font-semibold">6 m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Sala</span>
                  <span className="font-semibold">27 m²</span>
                </div>
                <div className="flex justify-between border-t border-black/10 pt-2">
                  <span className="text-black/60">Total</span>
                  <span className="font-bold">44 m²</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
