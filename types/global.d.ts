declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    /**
     * Marcado pelo script inline de app/layout.tsx quando ele restaura o
     * consentimento gravado e sobe o GA antes da hidratação. O
     * CookieConsentProvider lê para não renderizar um segundo `config`, que
     * duplicaria o page_view. Nome literal precisa bater com GA_BOOTSTRAP_FLAG
     * em lib/consent.ts.
     */
    __berkahnGaBootstrapped?: boolean;
  }
}

export {};
