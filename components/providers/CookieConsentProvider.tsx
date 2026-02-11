"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type ConsentLevel = "all" | "necessary" | null;

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

const STORAGE_KEY = "berkahn-cookie-consent";
const CONSENT_VERSION = "1.0";

interface StoredConsent {
  level: ConsentLevel;
  version: string;
  timestamp: number;
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentLevel>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: StoredConsent = JSON.parse(stored);
        if (parsed.version === CONSENT_VERSION && parsed.level) {
          setConsent(parsed.level);
          return;
        }
      } catch {
        // Invalid data, show banner
      }
    }
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const saveConsent = useCallback((level: ConsentLevel) => {
    const data: StoredConsent = {
      level,
      version: CONSENT_VERSION,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setConsent(level);
    setIsVisible(false);

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: level === "all" ? "granted" : "denied",
        ad_storage: level === "all" ? "granted" : "denied",
      });
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
