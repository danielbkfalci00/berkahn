"use client";

import { Card } from "@/components/ui/card";
import { pct } from "./calor";
import type { FunilLeads as Funil, FatiaOrigem } from "@/lib/analytics/leads-funnel";

interface FunilLeadsProps {
  funil: Funil;
  monthSlug: string;
}

function ListaOrigem({ titulo, fatias, vazio }: { titulo: string; fatias: FatiaOrigem[]; vazio: string }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider font-medium text-neutral-500 mb-2">{titulo}</h4>
      {fatias.length === 0 ? (
        <p className="text-xs text-neutral-400">{vazio}</p>
      ) : (
        <ul className="space-y-1">
          {fatias.map((f) => (
            <li key={f.rotulo} className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-neutral-700 truncate" title={f.rotulo}>
                {f.rotulo}
              </span>
              <span className="tabular-nums text-neutral-900 shrink-0">
                {f.total}
                {f.convertidos > 0 && (
                  <span className="text-neutral-500"> · {f.convertidos} conv.</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Funil de leads — a métrica norte declarada em analytics-methodology.md
 * (leads qualificados por 100 sessões engajadas) só ganha numerador aqui.
 *
 * Até 2026-08-12 o dashboard não mostrava nenhum dado de lead: os KPIs de funil
 * existiam só em /admin/leads. Este bloco fecha o circuito entre tráfego e
 * conversão dentro da mesma tela.
 */
export function FunilLeads({ funil, monthSlug }: FunilLeadsProps) {
  const topo = funil.degraus[0]?.alcancaram ?? 0;

  return (
    <Card className="bg-white border-neutral-200 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Funil de leads
        </h3>
        {topo > 0 && (
          <p className="text-xs text-neutral-500">
            Conversão{" "}
            <strong className="font-semibold text-neutral-900">
              {pct(funil.taxaConversao)}
            </strong>
            {funil.maiorPerda && (
              <>
                {" "}· maior perda em{" "}
                <strong className="font-semibold text-neutral-900">
                  {funil.maiorPerda.de} → {funil.maiorPerda.para}
                </strong>{" "}
                (−{pct(funil.maiorPerda.pct)})
              </>
            )}
          </p>
        )}
      </div>

      {topo === 0 ? (
        <p className="text-sm text-neutral-500 mt-3">
          Nenhum lead registrado em {monthSlug}. O CRM entrou em produção em
          11/08/2026 — até o primeiro lead chegar, este bloco fica vazio por
          fidelidade, não por falha.
        </p>
      ) : (
        <>
          <div className="space-y-1.5 mt-4">
            {funil.degraus.map((degrau) => (
              <div key={degrau.etapa} className="flex items-center gap-3">
                <span className="text-sm text-neutral-700 w-36 shrink-0">{degrau.rotulo}</span>
                <div className="flex-1 h-7 bg-neutral-100 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 flex items-center justify-end px-2"
                    style={{
                      width: `${Math.max(degrau.fracaoDoTopo * 100, degrau.alcancaram > 0 ? 4 : 0)}%`,
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                    }}
                  >
                    {degrau.alcancaram > 0 && (
                      <span className="text-[11px] tabular-nums text-white font-medium">
                        {degrau.alcancaram}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs tabular-nums text-neutral-500 w-12 text-right shrink-0">
                  {pct(degrau.fracaoDoTopo)}
                </span>
              </div>
            ))}
          </div>

          {funil.desqualificados > 0 && (
            <p className="text-xs text-neutral-500 mt-3">
              {funil.desqualificados} desqualificados, fora da soma do funil — é
              saída lateral a partir de qualquer etapa, não um degrau posterior.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 pt-5 border-t border-neutral-100">
            <ListaOrigem
              titulo="Por gatilho (cta_location)"
              fatias={funil.porCtaLocation}
              vazio="Nenhum lead com gatilho identificado."
            />
            <ListaOrigem
              titulo="Por página de origem"
              fatias={funil.porPagina}
              vazio="Nenhum lead com página identificada."
            />
          </div>

          <p className="text-xs text-neutral-500 mt-4">
            <strong className="font-medium text-neutral-700">
              {funil.comUtm} de {funil.total}
            </strong>{" "}
            leads têm UTM. Atribuição por campanha é enviesada por construção:
            `utm`, `landing_page` e `referrer` só são gravados para quem aceitou
            todos os cookies. Só `pagina_origem`, derivada do header no servidor,
            sobrevive à recusa.
          </p>
        </>
      )}
    </Card>
  );
}
