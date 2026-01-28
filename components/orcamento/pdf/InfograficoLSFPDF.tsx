import {
  Droplets,
  Recycle,
  Target,
} from "lucide-react";

const BENEFICIOS_DATA = [
  {
    icon: Droplets,
    valor: "90%",
    label: "Menos Água",
    descricao: "Construção a seco com mínimo uso de água",
    lsf: "10% uso",
    tradicional: "100% uso",
  },
  {
    icon: Recycle,
    valor: "3%",
    label: "Desperdício",
    descricao: "Apenas 3% de perda de materiais vs 25% tradicional",
    lsf: "3% perda",
    tradicional: "25% perda",
  },
  {
    icon: Target,
    valor: "99%",
    label: "Precisão Orçamentária",
    descricao: "Orçamento preciso sem surpresas no final da obra",
    lsf: "99% precisão",
    tradicional: "60% precisão",
  },
];

/**
 * InfograficoLSFPDF - Versão tabela simples
 * Sem animações, sem gráficos circulares ou barras
 */
export function InfograficoLSFPDF() {
  return (
    <section className="py-16 bg-black text-white w-full">
      <div className="container max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40 mb-3">
            Eficiência Comprovada
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
            Economia de recursos e precisão que fazem a diferença
          </h2>
          <p className="text-sm text-white/60 max-w-xl mx-auto">
            Vantagens exclusivas do Steel Frame que impactam diretamente
            no seu bolso e no meio ambiente.
          </p>
        </div>

        {/* Stats Grid 2x2 */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {BENEFICIOS_DATA.map((beneficio) => {
            const Icon = beneficio.icon;
            return (
              <div
                key={beneficio.label}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white/70" />
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-white">
                      {beneficio.valor}
                    </span>
                    <p className="text-sm text-white/60">{beneficio.label}</p>
                  </div>
                </div>
                <p className="text-sm text-white/50 mb-4">{beneficio.descricao}</p>
                
                {/* Mini comparativo */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <p className="text-white/40 mb-1">Steel Frame</p>
                    <p className="text-white font-semibold">{beneficio.lsf}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-2 text-center">
                    <p className="text-white/30 mb-1">Alvenaria</p>
                    <p className="text-white/50">{beneficio.tradicional}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Table */}
        <div className="bg-white/5 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">
            Resumo Comparativo
          </h3>
          <div className="overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-white/60">Aspecto</th>
                  <th className="px-4 py-3 text-center text-white">Steel Frame</th>
                  <th className="px-4 py-3 text-center text-white/40">Alvenaria</th>
                </tr>
              </thead>
              <tbody>
                {BENEFICIOS_DATA.map((b, index) => (
                  <tr
                    key={b.label}
                    className={index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"}
                  >
                    <td className="px-4 py-3 text-white/70">{b.label}</td>
                    <td className="px-4 py-3 text-center text-white font-semibold">
                      {b.lsf}
                    </td>
                    <td className="px-4 py-3 text-center text-white/40">
                      {b.tradicional}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
