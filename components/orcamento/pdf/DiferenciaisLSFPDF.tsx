import { Check, X, Recycle, Calendar } from "lucide-react";
import type { ComparativoItem, StatItem } from "@/types/orcamento";
import { cn } from "@/lib/utils";

interface DiferenciaisLSFPDFProps {
  comparativo: ComparativoItem[];
  beneficios: StatItem[];
}

/**
 * DiferenciaisLSFPDF - Versão tabela compacta
 * Sem imagem, sem animações, apenas tabela comparativa
 */
export function DiferenciaisLSFPDF({
  comparativo,
  beneficios,
}: DiferenciaisLSFPDFProps) {
  return (
    <section className="py-16 bg-black text-white w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">
            Tecnologia Construtiva
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
            Por que escolher Steel Frame?
          </h2>
          <p className="text-sm text-white/60 max-w-xl mx-auto">
            O sistema que combina velocidade, precisão e sustentabilidade
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">6x</p>
            <p className="text-xs text-white/50">Mais Rápido</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Recycle className="w-5 h-5 text-white/70 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">90%</p>
            <p className="text-xs text-white/50">Reciclável</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <Calendar className="w-5 h-5 text-white/70 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">100+</p>
            <p className="text-xs text-white/50">Anos de vida útil</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">±1mm</p>
            <p className="text-xs text-white/50">Precisão</p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
            Comparativo Detalhado
          </h3>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white/60 w-1/3">
                    Critério
                  </th>
                  <th className="px-4 py-3 text-left text-white w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white/70" />
                      Steel Frame
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-white/40 w-1/3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white/30" />
                      Alvenaria
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparativo.map((item, index) => (
                  <tr
                    key={item.criterio}
                    className={index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {item.criterio}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                            item.vencedor === "lsf"
                              ? "bg-white/15 border border-white/25"
                              : "bg-white/5 border border-white/10"
                          )}
                        >
                          {item.vencedor === "lsf" ? (
                            <Check className="w-3 h-3 text-white/80" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                          )}
                        </div>
                        <span
                          className={cn(
                            item.vencedor === "lsf"
                              ? "text-white font-semibold"
                              : "text-white/60"
                          )}
                        >
                          {item.lsf}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                            item.vencedor === "tradicional"
                              ? "bg-white/15 border border-white/25"
                              : "bg-white/5 border border-white/10"
                          )}
                        >
                          {item.vencedor === "tradicional" ? (
                            <Check className="w-3 h-3 text-white/80" />
                          ) : (
                            <X className="w-3 h-3 text-white/30" />
                          )}
                        </div>
                        <span
                          className={cn(
                            item.vencedor === "tradicional"
                              ? "text-white font-semibold"
                              : "text-white/40"
                          )}
                        >
                          {item.tradicional}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-6 text-xs text-white/40">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/15 border border-white/25 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white/80" />
              </div>
              <span>Melhor opção</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <X className="w-2.5 h-2.5 text-white/30" />
              </div>
              <span>Desvantagem</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
