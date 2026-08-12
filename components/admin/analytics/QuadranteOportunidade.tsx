"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";
import {
  POSICAO_MIN,
  POSICAO_MAX,
  CTR_ALVO,
  IMPRESSOES_MIN,
} from "@/lib/analytics/query-opportunity";
import type { MapaOportunidade } from "@/lib/analytics/query-opportunity";

interface QuadranteOportunidadeProps {
  mapa: MapaOportunidade;
}

interface PontoTooltip {
  active?: boolean;
  payload?: Array<{ payload: { query: string; position: number; ctr: number; impressions: number; clicks: number } }>;
}

function TooltipQuery({ active, payload }: PontoTooltip) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white border border-neutral-200 rounded-md shadow-sm px-3 py-2 text-xs max-w-[280px]">
      <p className="font-medium text-neutral-900 mb-1 break-words">{p.query}</p>
      <p className="text-neutral-600 tabular-nums">
        posição {p.position.toFixed(1)} · CTR {p.ctr.toFixed(2)}%
      </p>
      <p className="text-neutral-600 tabular-nums">
        {p.impressions.toLocaleString("pt-BR")} impressões · {p.clicks} cliques
      </p>
    </div>
  );
}

/**
 * Quadrante de oportunidade — onde o Google já entrega audiência e o clique não vem.
 *
 * Vive no Ato 2, ao lado da TopQueriesTable, e não no Ato 4: é o mesmo assunto
 * da tabela que já está aqui, e o Ato 4 já carrega cinco blocos.
 *
 * Existe porque fetch-gsc.mjs pedia 20 queries de uma distribuição de ~1.126.
 * O quadrante inteiro estava fora do corte.
 */
export function QuadranteOportunidade({ mapa }: QuadranteOportunidadeProps) {
  const temDado = mapa.plotaveis.length > 0;

  return (
    <Card className="bg-white border-neutral-200 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Onde há clique na mesa
        </h3>
        {mapa.oportunidades.length > 0 && (
          <p className="text-xs text-neutral-500">
            <strong className="font-semibold text-neutral-900">
              {mapa.oportunidades.length}
            </strong>{" "}
            queries no quadrante · ganho estimado{" "}
            <strong className="font-semibold text-neutral-900">
              +{mapa.ganhoTotal}
            </strong>{" "}
            cliques/mês
          </p>
        )}
      </div>
      <p className="text-xs text-neutral-500 mb-4">
        Posição {POSICAO_MIN}–{POSICAO_MAX} com CTR abaixo de {CTR_ALVO}% e ao
        menos {IMPRESSOES_MIN} impressões: o Google já mostra a página e o título
        não converte. Corrige-se reescrevendo title e meta, sem artigo novo.
      </p>

      {mapa.provavelmenteTruncado && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-4">
          Este mês foi coletado com o limite antigo de 20 queries. O quadrante só
          fica completo a partir do próximo run do pipeline.
        </p>
      )}

      {!temDado ? (
        <p className="text-sm text-neutral-500">
          Nenhuma query com {IMPRESSOES_MIN}+ impressões neste período.
        </p>
      ) : (
        <>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 8, right: 12, bottom: 24, left: 4 }}>
                {/* A faixa marca o alvo antes de qualquer ponto ser lido. */}
                <ReferenceArea
                  x1={POSICAO_MIN}
                  x2={POSICAO_MAX}
                  y1={0}
                  y2={CTR_ALVO}
                  fill="#000000"
                  fillOpacity={0.05}
                />
                <XAxis
                  type="number"
                  dataKey="position"
                  name="Posição"
                  domain={[1, 30]}
                  reversed
                  tick={{ fontSize: 11, fill: "#737373" }}
                  label={{
                    value: "Posição média (melhor à direita)",
                    position: "insideBottom",
                    offset: -14,
                    style: { fontSize: 11, fill: "#737373" },
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="ctr"
                  name="CTR"
                  unit="%"
                  tick={{ fontSize: 11, fill: "#737373" }}
                  width={44}
                />
                <ZAxis type="number" dataKey="impressions" range={[24, 420]} name="Impressões" />
                <Tooltip content={<TooltipQuery />} cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={mapa.plotaveis} fill="#000000" fillOpacity={0.35} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {mapa.oportunidades.length > 0 && (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Queries no quadrante de oportunidade, da maior impressão para a menor.
                </caption>
                <thead>
                  <tr className="text-xs text-neutral-500">
                    <th scope="col" className="text-left font-medium pb-2">Query</th>
                    <th scope="col" className="text-right font-medium pb-2 pl-3">Impr.</th>
                    <th scope="col" className="text-right font-medium pb-2 pl-3">Pos.</th>
                    <th scope="col" className="text-right font-medium pb-2 pl-3">CTR</th>
                    <th scope="col" className="text-right font-medium pb-2 pl-3 whitespace-nowrap">Ganho est.</th>
                  </tr>
                </thead>
                <tbody>
                  {mapa.oportunidades.slice(0, 12).map((q) => (
                    <tr key={q.query} className="border-t border-neutral-100">
                      <td className="py-1.5 pr-3 text-neutral-900 max-w-[320px] truncate" title={q.query}>
                        {q.query}
                      </td>
                      <td className="py-1.5 pl-3 text-right tabular-nums text-neutral-600">
                        {q.impressions.toLocaleString("pt-BR")}
                      </td>
                      <td className="py-1.5 pl-3 text-right tabular-nums text-neutral-600">
                        {q.position.toFixed(1)}
                      </td>
                      <td className="py-1.5 pl-3 text-right tabular-nums text-neutral-600">
                        {q.ctr.toFixed(2)}%
                      </td>
                      <td className="py-1.5 pl-3 text-right tabular-nums font-medium text-neutral-900">
                        +{q.ganhoEstimado}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {mapa.oportunidades.length > 12 && (
                <p className="text-xs text-neutral-500 mt-2">
                  Mais {mapa.oportunidades.length - 12} queries no quadrante.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
