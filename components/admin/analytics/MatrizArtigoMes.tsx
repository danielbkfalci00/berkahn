"use client";

import { Card } from "@/components/ui/card";
import { estiloCalor, classeTextoCalor, pct } from "./calor";
import type { MatrizArtigoMes as Matriz } from "@/lib/analytics/heatmaps";

interface MatrizArtigoMesProps {
  matriz: Matriz;
}

const MESES_PT = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function rotuloMes(monthSlug: string): string {
  const [ano, mes] = monthSlug.split("-");
  return `${MESES_PT[parseInt(mes) - 1]}/${ano.slice(2)}`;
}

/**
 * Matriz artigo × mês — o acervo ao longo do tempo, em uma olhada.
 *
 * Responde a pergunta que o gráfico de linha não responde: a biblioteca está
 * compondo, ou um artigo carrega tudo? A concentração do artigo #1 é meta
 * declarada até dezembro (78% → 55%), e é esta matriz que a torna visível.
 */
export function MatrizArtigoMes({ matriz }: MatrizArtigoMesProps) {
  if (matriz.linhas.length === 0) {
    return (
      <Card className="bg-white border-neutral-200 p-6">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Acervo mês a mês
        </h3>
        <p className="text-sm text-neutral-500 mt-3">
          Nenhum artigo com pageviews nos snapshots disponíveis.
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white border-neutral-200 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Acervo mês a mês
        </h3>
        <p className="text-xs text-neutral-500">
          Artigo mais lido concentra{" "}
          <strong className="font-semibold text-neutral-900">
            {pct(matriz.concentracaoTopo)}
          </strong>{" "}
          dos pageviews do último mês
        </p>
      </div>
      <p className="text-xs text-neutral-500 mb-4">
        Intensidade em escala de raiz sobre o máximo global — a cauda continua
        visível sem achatar o topo.
      </p>

      {/* Wide content rola dentro do próprio container; a página nunca rola na horizontal. */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <caption className="sr-only">
            Pageviews por artigo em cada mês. Células mais escuras indicam mais leituras.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="text-left font-medium text-neutral-500 text-xs pb-2 pr-3 sticky left-0 bg-white">
                Artigo
              </th>
              {matriz.meses.map((m) => (
                <th
                  key={m}
                  scope="col"
                  className="font-medium text-neutral-500 text-xs pb-2 px-1 text-center whitespace-nowrap"
                >
                  {rotuloMes(m)}
                </th>
              ))}
              <th scope="col" className="font-medium text-neutral-500 text-xs pb-2 pl-3 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {matriz.linhas.map((linha) => (
              <tr key={linha.slug} className="group">
                <th
                  scope="row"
                  className="text-left font-normal text-neutral-900 py-1 pr-3 max-w-[280px] truncate sticky left-0 bg-white group-hover:bg-neutral-50"
                  title={linha.title}
                >
                  {linha.title}
                </th>
                {linha.celulas.map((celula) => (
                  <td key={celula.monthSlug} className="p-0.5">
                    <div
                      className={`rounded-sm text-center text-[11px] tabular-nums py-1.5 px-1 ${classeTextoCalor(celula.intensidade)}`}
                      style={estiloCalor(celula.intensidade)}
                      title={`${linha.title} — ${rotuloMes(celula.monthSlug)}: ${celula.pageviews} pageviews`}
                    >
                      {celula.pageviews > 0 ? celula.pageviews.toLocaleString("pt-BR") : "·"}
                    </div>
                  </td>
                ))}
                <td className="pl-3 text-right tabular-nums text-neutral-900 font-medium">
                  {linha.total.toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {matriz.ocultos > 0 && (
        <p className="text-xs text-neutral-500 mt-3">
          {matriz.ocultos} {matriz.ocultos === 1 ? "artigo com menos tráfego ficou" : "artigos com menos tráfego ficaram"} fora do corte.
        </p>
      )}
    </Card>
  );
}
