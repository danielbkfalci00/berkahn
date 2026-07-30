"use client";

import type { Ga4Event } from "@/types/analytics";

interface ConversionEventsProps {
  events: Ga4Event[];
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

export function ConversionEvents({ events, monthSlug }: ConversionEventsProps) {
  const ordenados = ordenar(events);
  const leads = events.find((e) => e.name === "generate_lead")?.count ?? 0;
  const aberturas = events.find((e) => e.name === "cta_click")?.count ?? 0;

  const anteriorAInstrumentacao =
    Boolean(monthSlug) && monthSlug! < MES_INICIO_INSTRUMENTACAO;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold text-neutral-900">Conversão</h3>
        {leads > 0 && (
          <span className="text-sm text-neutral-500 tabular-nums">
            {aberturas > 0
              ? `${((leads / aberturas) * 100).toFixed(1)}% dos CTAs abertos viraram lead`
              : `${leads} lead${leads > 1 ? "s" : ""}`}
          </span>
        )}
      </div>

      {ordenados.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-500">
          {anteriorAInstrumentacao
            ? "Mês anterior à instrumentação de conversão (30/07/2026). Ausência de eventos aqui é esperada, não queda."
            : "Nenhum evento de conversão no período. Se o site recebeu tráfego, verificar se o consentimento de cookies está sendo aceito — o GA não coleta antes do aceite."}
        </p>
      ) : (
        <dl className="mt-4 divide-y divide-neutral-100">
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
        </dl>
      )}
    </div>
  );
}
