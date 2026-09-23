"use client";

import type { AdminDataResult, Ga4Data, Ga4Event } from "@/types/analytics";
import type { FunilLeads } from "@/lib/analytics/leads-funnel";

interface ConversionEventsProps {
  ga4: Ga4Data;
  funil: AdminDataResult<FunilLeads>;
  /** Mês do snapshot ("2026-08"), para o estado vazio saber o que dizer. */
  monthSlug?: string;
}

/** Primeiro mês com instrumentação de conversão no ar. */
const MES_INICIO_INSTRUMENTACAO = "2026-07";

const ROTULO: Record<string, string> = {
  generate_lead: "Leads confirmados",
  form_submit: "Formulários enviados",
  whatsapp_click: "Cliques no WhatsApp",
  cta_click: "CTAs abertos",
  select_architect: "Arquiteto selecionado",
  architect_contact_click: "Contato de arquiteto",
  architect_berkahn_whatsapp: "WhatsApp via arquiteto",
};

/** A ordem do funil importa mais que a contagem — deixa a queda visível. */
const ORDEM_FUNIL = [
  "cta_click",
  "form_submit",
  "generate_lead",
  "whatsapp_click",
];

function ordenar(events: Ga4Event[]): Ga4Event[] {
  return [...events].sort((a, b) => {
    const ia = ORDEM_FUNIL.indexOf(a.name);
    const ib = ORDEM_FUNIL.indexOf(b.name);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return b.count - a.count;
  });
}

export function ConversionEvents({ ga4, funil, monthSlug }: ConversionEventsProps) {
  const events = ga4.events ?? [];
  const ordenados = ordenar(events);
  const whatsappClicks = events.find((e) => e.name === "whatsapp_click")?.count ?? 0;
  const formLeads = funil.status === "ok" ? funil.data.porCanal.find((c) => c.rotulo === "form")?.total ?? 0 : null;
  const whatsappLeads = funil.status === "ok" ? funil.data.porCanal.find((c) => c.rotulo === "whatsapp")?.total ?? 0 : null;
  const gaEventsAvailable = ga4.eventsAvailable === true || (ga4.eventsAvailable === undefined && events.length > 0);
  const breakdown = ga4.whatsappBreakdown;

  const anteriorAInstrumentacao =
    Boolean(monthSlug) && monthSlug! < MES_INICIO_INSTRUMENTACAO;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
      <h3 className="text-base font-semibold text-neutral-900">Caminhos de contato</h3>
      <p className="mt-1 text-xs text-neutral-600">No período selecionado · cliques são intenção; registros no CRM são contatos recebidos.</p>
      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-md bg-neutral-50 p-3"><dt className="text-xs text-neutral-600">Cliques no WhatsApp</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{gaEventsAvailable ? whatsappClicks.toLocaleString("pt-BR") : "—"}</dd><span className="text-[11px] text-neutral-500">GA4 · com consentimento</span></div>
        <div className="rounded-md bg-neutral-50 p-3"><dt className="text-xs text-neutral-600">Formulários</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{formLeads?.toLocaleString("pt-BR") ?? "—"}</dd><span className="text-[11px] text-neutral-500">CRM · confirmados</span></div>
        <div className="col-span-2 rounded-md bg-neutral-50 p-3 sm:col-span-1"><dt className="text-xs text-neutral-600">Leads via WhatsApp</dt><dd className="mt-1 text-xl font-semibold tabular-nums">{whatsappLeads?.toLocaleString("pt-BR") ?? "—"}</dd><span className="text-[11px] text-neutral-500">CRM · origem registrada</span></div>
      </dl>
      {(funil.status === "unavailable" || !gaEventsAvailable) && <p role="status" className="mt-3 text-xs text-amber-800">{funil.status === "unavailable" ? "CRM indisponível. " : ""}{!gaEventsAvailable ? "Eventos GA4 não verificados neste snapshot." : ""}</p>}
      <p className="mt-3 text-xs text-neutral-600">As bases têm coberturas diferentes: não some estes números. Um clique não comprova conversa; quem enviou formulário e depois chamou no WhatsApp continua com origem “form” no CRM.</p>

      <details className="mt-3 border-t border-neutral-100 pt-2">
        <summary className="flex min-h-11 cursor-pointer items-center text-sm font-medium text-neutral-700">Ver origens e eventos</summary>
        {breakdown?.available ? (
          breakdown.rows.length > 0 ? <ul className="mt-2 space-y-2 text-xs text-neutral-700">{breakdown.rows.slice(0, 10).map((row, index) => <li key={`${row.pagePath}-${row.ctaLocation}-${index}`} className="flex justify-between gap-3"><span className="min-w-0 truncate" title={`${row.pagePath} · ${row.ctaLocation}`}>{row.pagePath} · {row.ctaLocation}</span><strong className="tabular-nums">{row.clicks}</strong></li>)}</ul> : <p className="mt-2 text-xs text-neutral-500">Nenhum clique rastreado por página e botão.</p>
        ) : <p className="mt-2 text-xs text-neutral-500">Detalhamento por página e botão indisponível neste snapshot.</p>}
        {anteriorAInstrumentacao && <p className="mt-2 text-xs text-neutral-500">Período anterior à instrumentação de conversão.</p>}
        {ordenados.length > 0 && <dl className="mt-3 divide-y divide-neutral-100 border-t border-neutral-100">
          {ordenados.map((evento) => (
            <div
              key={evento.name}
              className="flex items-baseline justify-between gap-4 py-2.5"
            >
              <dt className="text-sm text-neutral-700">
                {ROTULO[evento.name] ?? evento.name}
              </dt>
              <dd className="text-sm font-semibold text-neutral-900 tabular-nums">
                {evento.count.toLocaleString("pt-BR")}
              </dd>
            </div>
          ))}
        </dl>}
      </details>
    </div>
  );
}
