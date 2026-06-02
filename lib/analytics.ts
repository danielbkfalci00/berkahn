/**
 * Eventos de analytics (GA4 via `window.gtag`, configurado em app/layout.tsx).
 * O consentimento e gerido pelo CookieConsentProvider (gtag consent mode),
 * entao basta disparar o evento; o GA respeita o estado de consentimento.
 *
 * Uso: trackEvent("select_architect", { architect: slug });
 */
type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", name, params);
  } catch {
    /* analytics nunca deve quebrar a UI */
  }
}
