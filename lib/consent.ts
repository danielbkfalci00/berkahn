// Constantes do consentimento de cookies.
//
// Ficam fora do CookieConsentProvider porque o script inline do GA em
// app/layout.tsx precisa ler o mesmo localStorage para restaurar a escolha
// antes do primeiro page_view. Se cada lado tivesse sua cópia da chave ou da
// versão, um bump em um dos dois passaria despercebido e o consentimento
// voltaria a ser ignorado — silenciosamente.

export const CONSENT_STORAGE_KEY = "berkahn-cookie-consent";
export const CONSENT_VERSION = "1.0";

export type ConsentLevel = "all" | "necessary" | null;

export interface StoredConsent {
  level: ConsentLevel;
  version: string;
  timestamp: number;
}

/** Categorias do Consent Mode v2 que este site controla. */
export const CONSENT_KEYS = [
  "analytics_storage",
  "ad_storage",
  "ad_user_data",
  "ad_personalization",
] as const;

export function consentPayload(level: ConsentLevel): Record<string, "granted" | "denied"> {
  const valor = level === "all" ? "granted" : "denied";
  return Object.fromEntries(CONSENT_KEYS.map((k) => [k, valor]));
}
