// Contrato compartilhado entre os formulários públicos e POST /api/leads.

export const LEAD_ENDPOINT = "/api/leads";

export const WHATSAPP_NUMBER = "5511966415742";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Gostaria de saber mais sobre os serviços da Berkahn."
)}`;

export interface LeadInput {
  name: string;
  email?: string;
  phone: string;
  segment: "residencial" | "comercial";
  message?: string;
  projectType?: string;
  company?: string;
  role?: string;
  pagePath?: string;
  ctaLocation?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  website?: string;
  startedAt?: number;
}

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
      pagePath: text("pagePath", 500) || undefined,
      ctaLocation: text("ctaLocation", 160) || undefined,
      utmSource: text("utmSource", 160) || undefined,
      utmMedium: text("utmMedium", 160) || undefined,
      utmCampaign: text("utmCampaign", 160) || undefined,
      website: text("website", 300) || undefined,
      startedAt: typeof value.startedAt === "number" ? value.startedAt : undefined,
    },
  };
}
