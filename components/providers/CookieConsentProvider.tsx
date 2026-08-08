"use client";

import Script from "next/script";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  consentPayload,
  type ConsentLevel,
  type StoredConsent,
} from "@/lib/consent";

// `window.gtag` é declarado em types/global.d.ts — não redeclarar aqui.

const GA_MEASUREMENT_ID = "G-RBQJ1D6JHW";

function GoogleAnalytics({ consent }: { consent: ConsentLevel }) {
  if (consent !== "all") return null;

  return (
    <>
      <Script id="google-analytics-consented" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };
          window.gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted'
          });
          window.gtag('js', new Date());
          window.gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}

// Renderers de PDF onde o cookie banner não deve aparecer (puppeteer rasteriza
// e o banner ficaria gravado no PDF). Allowlist explícita — NÃO usar prefixo
// solto `/orcamento` porque quebraria a página LSF pública.
function ehRotaSemConsentimento(pathname: string | null): boolean {
  if (!pathname) return false;
  return (
    pathname.startsWith("/orcamento/estimativa/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/institucional/")
  );
}

interface CookieConsentContextType {
  consent: ConsentLevel;
  hasConsented: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  isVisible: boolean;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(
  undefined
);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentLevel>(null);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const consentimentoDesabilitado = ehRotaSemConsentimento(pathname);

  useEffect(() => {
    // Skip banner em renderers de PDF — puppeteer rasteriza e ficaria no PDF
    if (consentimentoDesabilitado) {
      setIsVisible(false);
      setConsent(null);
      return;
    }

    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredConsent = JSON.parse(stored);
        if (parsed.version === CONSENT_VERSION && parsed.level) {
          // Só estado de UI: o `gtag consent update` de visitas anteriores já
          // foi replayed pelo script inline em app/layout.tsx, antes do
          // primeiro page_view. Repetir aqui seria tarde demais.
          setConsent(parsed.level);
          return;
        }
      } catch {
        // Invalid data, show banner
      }
    }
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, [pathname, consentimentoDesabilitado]);

  const saveConsent = useCallback((level: ConsentLevel) => {
    const data: StoredConsent = {
      level,
      version: CONSENT_VERSION,
      timestamp: Date.now(),
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data));
    setConsent(level);
    setIsVisible(false);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", consentPayload(level));
    }
  }, []);

  const acceptAll = useCallback(() => saveConsent("all"), [saveConsent]);
  const acceptNecessary = useCallback(() => saveConsent("necessary"), [saveConsent]);

  const hasConsented = consent !== null;

  return (
    <CookieConsentContext.Provider
      value={{ consent, hasConsented, acceptAll, acceptNecessary, isVisible }}
    >
      {children}
      <GoogleAnalytics consent={consentimentoDesabilitado ? null : consent} />
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
}
