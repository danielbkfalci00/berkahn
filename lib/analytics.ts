/**
 * Eventos de analytics (GA4 via `window.gtag`).
 *
 * O CookieConsentProvider carrega o GA somente depois do consentimento completo.
 * Eventos disparados antes disso ficam deliberadamente ignorados.
 *
 * Uso: trackEvent("generate_lead", { segment: "residencial", cta_location: "contato_pagina" });
 */

/**
 * Nomes de evento aceitos. União fechada de propósito.
 *
 * O pipeline em `scripts/analytics/fetch-ga4.mjs` filtra a resposta da API por
 * uma allowlist com estes mesmos nomes. Um typo aqui não viraria erro em lugar
 * nenhum — o evento apenas sumiria do relatório. Foi exatamente o que
 * aconteceu até 2026-07-30: o pipeline esperava 5 nomes que ninguém disparava,
 * e os 3 eventos que existiam ficavam de fora da allowlist. `ga4_data.events`
 * ficou `[]` em todos os meses.
 *
 * Ao adicionar um nome aqui, adicionar também em EVENTOS_RASTREADOS no
 * `scripts/analytics/fetch-ga4.mjs`. Atenção: `/scripts/` é gitignored, então
 * aquele arquivo **não** viaja neste repositório — a alteração precisa ser
 * feita na máquina que roda o cron `berkahn-performance-mensal`.
 */
export type EventName =
  // Conversão
  | "generate_lead"
  | "form_submit"
  | "whatsapp_click"
  | "cta_click"
  // Curadoria de arquitetos
  | "select_architect"
  | "architect_contact_click"
  | "architect_berkahn_whatsapp";

/**
 * Parâmetros do evento.
 *
 * `cta_location`, `channel` e `segment` existem como custom dimensions de
 * escopo Evento no GA4 Admin (criadas em 2026-07-30). Os nomes precisam bater
 * exatamente, senão a dimensão aparece vazia no relatório.
 */
export interface EventParams {
  /** Onde o usuário estava ao converter. Ex: "contato_pagina", "blog_cta", "whatsapp_flutuante". */
  cta_location?: string;
  /** Canal usado. Ex: "whatsapp", "email", "form". */
  channel?: string;
  /** Segmento declarado. Ex: "residencial", "comercial". */
  segment?: string;
  [key: string]: string | number | boolean | undefined;
}

export function trackEvent(name: EventName, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* analytics nunca deve quebrar a UI */
  }
}
