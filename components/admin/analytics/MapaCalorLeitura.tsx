"use client";

import { Card } from "@/components/ui/card";
import { estiloCalor, classeTextoCalor, pct } from "./calor";
import { MIN_AMOSTRA } from "@/lib/analytics/heatmaps";
import type { MapaLeitura } from "@/lib/analytics/heatmaps";

interface MapaCalorLeituraProps {
  mapa: MapaLeitura;
}

/**
 * Mapa de calor de leitura — onde a atenção morre dentro de cada artigo.
 *
 * Alimentado por `article_progress`, disparado em 25/50/75/90% por
 * components/article/ReadingProgress.tsx. É o mapa de calor que responde à
 * decisão que está em aberto: onde colocar o CTA. Mapa de clique diria em que
 * ponto da tela as pessoas tocam; este diz até onde elas chegam, que é a
 * pergunta anterior.
 */
export function MapaCalorLeitura({ mapa }: MapaCalorLeituraProps) {
  if (!mapa.disponivel) {
    return (
      <Card className="bg-white border-neutral-200 p-6">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Até onde leem
        </h3>
        <p className="text-sm text-neutral-500 mt-3">
          Profundidade de leitura indisponível neste mês. As dimensões
          personalizadas <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">article_slug</code>{" "}
          e <code className="text-xs bg-neutral-100 px-1 py-0.5 rounded">percent_scrolled</code>{" "}
          precisam estar registradas no GA4 Admin — e não são retroativas, então
          o dado começa na data do registro.
        </p>
        {mapa.motivoIndisponivel && (
          <p className="text-xs text-neutral-400 mt-2">{mapa.motivoIndisponivel}</p>
        )}
      </Card>
    );
  }

  const comAmostra = mapa.linhas.filter((l) => l.amostraSuficiente).length;

  return (
    <Card className="bg-white border-neutral-200 p-6">
      <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
        Até onde leem
      </h3>
      <p className="text-xs text-neutral-500 mt-1 mb-4">
        Percentual de quem começou a rolar e chegou a cada marca. Linha cinza é
        amostra abaixo de {MIN_AMOSTRA} leitores — sem leitura, de propósito.
      </p>

      {mapa.linhas.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Nenhum evento de leitura com artigo identificado neste período.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-0">
            <caption className="sr-only">
              Retenção de leitura por artigo em quatro marcas de profundidade.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="text-left font-medium text-neutral-500 text-xs pb-2 pr-3">
                  Artigo
                </th>
                {[25, 50, 75, 90].map((b) => (
                  <th
                    key={b}
                    scope="col"
                    className="font-medium text-neutral-500 text-xs pb-2 px-1 text-center w-16"
                  >
                    {b}%
                  </th>
                ))}
                <th scope="col" className="font-medium text-neutral-500 text-xs pb-2 pl-3 text-right whitespace-nowrap">
                  Leitores
                </th>
                <th scope="col" className="font-medium text-neutral-500 text-xs pb-2 pl-3 text-left whitespace-nowrap">
                  Maior queda
                </th>
              </tr>
            </thead>
            <tbody>
              {mapa.linhas.map((linha) => (
                <tr key={linha.slug}>
                  <th
                    scope="row"
                    className={`text-left font-normal py-1 pr-3 max-w-[280px] truncate ${
                      linha.amostraSuficiente ? "text-neutral-900" : "text-neutral-400"
                    }`}
                    title={linha.title}
                  >
                    {linha.title}
                  </th>
                  {linha.celulas.map((celula) => (
                    <td key={celula.bucket} className="p-0.5">
                      <div
                        className={`rounded-sm text-center text-[11px] tabular-nums py-1.5 ${
                          linha.amostraSuficiente
                            ? classeTextoCalor(celula.retencao)
                            : "text-neutral-400"
                        }`}
                        style={
                          linha.amostraSuficiente
                            ? estiloCalor(celula.retencao)
                            : { backgroundColor: "rgba(0,0,0,0.03)" }
                        }
                        title={`${linha.title} — ${celula.bucket}%: ${celula.eventos} de ${linha.base}`}
                      >
                        {linha.amostraSuficiente ? pct(celula.retencao) : "·"}
                      </div>
                    </td>
                  ))}
                  <td
                    className={`pl-3 text-right tabular-nums ${
                      linha.amostraSuficiente ? "text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {linha.base}
                  </td>
                  <td className="pl-3 text-left whitespace-nowrap">
                    {linha.maiorQueda ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {linha.maiorQueda}
                        <span className="tabular-nums">−{pct(linha.maiorQuedaPct)}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400">amostra insuficiente</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mapa.semDimensao > 0 && (
        <p className="text-xs text-neutral-500 mt-3">
          {mapa.semDimensao.toLocaleString("pt-BR")} eventos de leitura sem artigo
          identificado — são anteriores ao registro das dimensões no GA4, que não
          é retroativo. Esse número encolhe sozinho a cada mês.
        </p>
      )}
      {mapa.linhas.length > 0 && comAmostra === 0 && (
        <p className="text-xs text-neutral-500 mt-3">
          Nenhum artigo alcançou {MIN_AMOSTRA} leitores ainda. As linhas aparecem
          para mostrar que a coleta funciona, não para sustentar decisão.
        </p>
      )}
    </Card>
  );
}
