// Contrato compartilhado entre os formulários públicos e POST /api/leads.

export const LEAD_ENDPOINT = "/api/leads";

export const WHATSAPP_NUMBER = "5511966415742";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Gostaria de saber mais sobre os serviços da Berkahn."
)}`;

interface LeadAttributionFields {
  pagePath?: string;
  ctaLocation?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
  referrer?: string;
  attributionConsent?: boolean;
  website?: string;
  startedAt?: number;
}

export interface ContactLeadInput extends LeadAttributionFields {
  kind?: "contact";
  name: string;
  email?: string;
  phone: string;
  segment: "residencial" | "comercial";
  message?: string;
  projectType?: string;
  company?: string;
  role?: string;
}

export interface ResourceLeadInput extends LeadAttributionFields {
  kind: "resource";
  email: string;
  resourceTitle: string;
}

export type LeadInput = ContactLeadInput | ResourceLeadInput;

export function validateLeadInput(input: unknown):
  | { success: true; data: LeadInput }
  | { success: false; message: string } {
  if (!input || typeof input !== "object") {
    return { success: false, message: "Dados inválidos." };
  }

  const value = input as Record<string, unknown>;
  const text = (key: string, max: number) =>
    typeof value[key] === "string" ? value[key].trim().slice(0, max) : "";
  const name = text("name", 160);
  const email = text("email", 254);
  const phone = text("phone", 40);
  const segment = text("segment", 32);
  const kind = text("kind", 32);

  const attribution = {
    pagePath: text("pagePath", 500) || undefined,
    ctaLocation: text("ctaLocation", 160) || undefined,
    utmSource: text("utmSource", 160) || undefined,
    utmMedium: text("utmMedium", 160) || undefined,
    utmCampaign: text("utmCampaign", 160) || undefined,
    utmContent: text("utmContent", 160) || undefined,
    utmTerm: text("utmTerm", 160) || undefined,
    landingPage: text("landingPage", 500) || undefined,
    referrer: text("referrer", 500) || undefined,
    attributionConsent: value.attributionConsent === true,
    website: text("website", 300) || undefined,
    startedAt: typeof value.startedAt === "number" ? value.startedAt : undefined,
  };

  if (kind === "resource") {
    const resourceTitle = text("resourceTitle", 200);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, message: "Email inválido." };
    }
    if (!resourceTitle) {
      return { success: false, message: "Material não identificado." };
    }
    return {
      success: true,
      data: { kind: "resource", email, resourceTitle, ...attribution },
    };
  }

  if (!name) return { success: false, message: "Nome é obrigatório." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Email inválido." };
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return { success: false, message: "Telefone inválido." };
  }
  if (segment !== "residencial" && segment !== "comercial") {
    return { success: false, message: "Segmento inválido." };
  }

  return {
    success: true,
    data: {
      name,
      email: email || undefined,
      phone,
      segment,
      message: text("message", 4000) || undefined,
      projectType: text("projectType", 160) || undefined,
      company: text("company", 200) || undefined,
      role: text("role", 160) || undefined,
      ...attribution,
    },
  };
}

const LEAD_ATTRIBUTION_STORAGE = "berkahn-lead-attribution-v1";

export interface LeadAttributionInput {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
  referrer?: string;
  attributionConsent: boolean;
}

/** Persiste o primeiro toque somente depois do consentimento analítico. */
export function persistLeadAttribution(): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(LEAD_ATTRIBUTION_STORAGE)) return;

  const url = new URL(window.location.href);
  const payload: LeadAttributionInput = {
    utmSource: url.searchParams.get("utm_source")?.slice(0, 160) || undefined,
    utmMedium: url.searchParams.get("utm_medium")?.slice(0, 160) || undefined,
    utmCampaign: url.searchParams.get("utm_campaign")?.slice(0, 160) || undefined,
    utmContent: url.searchParams.get("utm_content")?.slice(0, 160) || undefined,
    utmTerm: url.searchParams.get("utm_term")?.slice(0, 160) || undefined,
    landingPage: url.pathname.slice(0, 500),
    referrer: sanitizeReferrer(document.referrer),
    attributionConsent: true,
  };

  sessionStorage.setItem(LEAD_ATTRIBUTION_STORAGE, JSON.stringify(payload));
}

function sanitizeReferrer(value: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return undefined;
  }
}

export function getLeadAttribution(): LeadAttributionInput {
  if (typeof window === "undefined") return { attributionConsent: false };
  const stored = sessionStorage.getItem(LEAD_ATTRIBUTION_STORAGE);
  if (!stored) return { attributionConsent: false };
  try {
    const parsed = JSON.parse(stored) as Partial<LeadAttributionInput>;
    return { ...parsed, attributionConsent: parsed.attributionConsent === true };
  } catch {
    sessionStorage.removeItem(LEAD_ATTRIBUTION_STORAGE);
    return { attributionConsent: false };
  }
}
