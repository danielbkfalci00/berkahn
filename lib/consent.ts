// Constantes do consentimento de cookies.
//
// Ficam fora do CookieConsentProvider porque o script inline do GA em
// app/layout.tsx precisa ler o mesmo localStorage para restaurar a escolha
// antes do primeiro page_view. Se cada lado tivesse sua cópia da chave ou da
// versão, um bump em um dos dois passaria despercebido e o consentimento
// voltaria a ser ignorado — silenciosamente.

export const CONSENT_STORAGE_KEY = "berkahn-cookie-consent";
export const CONSENT_VERSION = "1.0";

/** Measurement ID do GA4. Não é segredo — vai no bundle por desenho. */
export const GA_MEASUREMENT_ID = "G-RBQJ1D6JHW";

/** Flag em window que diz se o bootstrap inline já subiu o GA nesta página. */
export const GA_BOOTSTRAP_FLAG = "__berkahnGaBootstrapped";

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

/**
 * Script inline que restaura o consentimento de visitas anteriores e sobe o GA
 * antes da hidratação.
 *
 * Este arquivo e o CookieConsentProvider afirmavam, desde a instrumentação de
 * 2026-07-30, que um script assim existia em `app/layout.tsx`. Ele não existia:
 * `grep gtag|dataLayer|googletagmanager` em `app/` devolvia zero linhas. O
 * comentário descrevia código ausente, e o provider deixava de reenviar o
 * `consent update` justamente porque acreditava que o replay já tinha
 * acontecido.
 *
 * O consentimento em si nunca se perdeu — o componente `GoogleAnalytics` seta
 * `consent default: granted` antes do `config`. O que se perdia era **tempo**:
 * para visitante recorrente que já consentiu, o GA só carregava depois da
 * hidratação, do `useEffect` e do `afterInteractive`. Quem saía antes disso não
 * era contado, e `trackEvent` descartava em silêncio todo evento disparado
 * nesse intervalo. Sub-medição sistemática, invisível.
 *
 * Só age quando já existe consentimento total gravado. Primeira visita continua
 * inteiramente com o banner — nada carrega antes do aceite.
 */
export function scriptBootstrapGa(): string {
  const granted = JSON.stringify(consentPayload("all"));
  return `(function(){try{
var s=localStorage.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)});
if(!s)return;
var c=JSON.parse(s);
if(c.version!==${JSON.stringify(CONSENT_VERSION)}||c.level!=='all')return;
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};
gtag('consent','default',${granted});
gtag('js',new Date());
gtag('config',${JSON.stringify(GA_MEASUREMENT_ID)});
var t=document.createElement('script');
t.async=true;
t.src='https://www.googletagmanager.com/gtag/js?id='+${JSON.stringify(GA_MEASUREMENT_ID)};
document.head.appendChild(t);
window[${JSON.stringify(GA_BOOTSTRAP_FLAG)}]=true;
}catch(e){}})();`;
}
