import { MATERIAIS_DETALHADOS } from "@/lib/orcamento-data";

/**
 * MateriaisPDF - Slide com tabela de especificações de materiais
 * Versão PDF com estrutura hierárquica (categorias + subitens)
 */
export function MateriaisPDF() {
  return (
    <section className="py-4 bg-[#F4F2EC] w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-3">
          <p className="text-sm uppercase tracking-[0.3em] font-mono text-black/60 mb-2">
            03 — Descrição Analítica dos Materiais
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-black mb-3">
            COMPOSIÇÃO TÉCNICA DO PROJETO
          </h2>
          <p className="text-sm text-black/60 max-w-2xl">
            Relação detalhada de materiais, componentes e quantidades previstas para a execução.
          </p>
        </div>

        {/* Tabela de Materiais */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="px-4 py-2 text-left w-20 font-semibold tracking-wide">
                    ITEM
                  </th>
                  <th className="px-4 py-2 text-left font-semibold tracking-wide">
                    DESCRIÇÃO
                  </th>
                  <th className="px-4 py-2 text-center w-24 font-semibold tracking-wide">
                    UNID.
                  </th>
                  <th className="px-4 py-2 text-right w-28 font-semibold tracking-wide">
                    QNTD.
                  </th>
                </tr>
              </thead>
              <tbody>
                {MATERIAIS_DETALHADOS.map((material, index) => (
                  <tr
                    key={material.item}
                    className={`
                      border-b border-black/5
                      ${material.isCategoria
                        ? "bg-black/[0.03]"
                        : index % 2 === 0
                          ? "bg-white"
                          : "bg-black/[0.01]"
                      }
                    `}
                  >
                    {/* Coluna ITEM */}
                    <td className={`px-4 py-1.5 ${material.isCategoria ? "font-bold" : ""}`}>
                      {material.isCategoria ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-bold">
                          {material.item.replace(".", "")}
                        </span>
                      ) : (
                        <span className="text-black/60 pl-2 font-mono text-xs">
                          {material.item}
                        </span>
                      )}
                    </td>

                    {/* Coluna DESCRIÇÃO */}
                    <td className={`px-4 py-1.5 ${
                      material.isCategoria
                        ? "font-bold text-black"
                        : "text-black/80 pl-6"
                    }`}>
                      {material.descricao}
                    </td>

                    {/* Coluna UNIDADE */}
                    <td className="px-4 py-1.5 text-center text-black/50 font-mono text-xs">
                      {material.unidade || "—"}
                    </td>

                    {/* Coluna QUANTIDADE */}
                    <td className={`px-4 py-1.5 text-right font-mono text-sm ${
                      material.quantidade === "Incluso"
                        ? "text-emerald-600 font-medium"
                        : "text-black/70"
                    }`}>
                      {material.quantidade || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notas */}
          <div className="px-6 py-4 border-t border-black/10 bg-black/[0.02]">
            <p className="text-xs text-black/50 italic">
              * Especificações sujeitas a alterações conforme projeto executivo final
            </p>
            <p className="text-xs text-black/40 mt-1">
              Todos os materiais seguem normas ABNT e possuem certificação de qualidade
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
