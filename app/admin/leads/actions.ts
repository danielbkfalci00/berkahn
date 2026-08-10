"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { LeadChannel, LeadSegment, LeadStatus } from "@/types/analytics";

export interface LeadActionResult {
  ok: boolean;
  error?: string;
  id?: string;
  duplicates?: Array<{ id: string; nome: string; email: string | null; telefone: string | null }>;
}

export interface ManualLeadInput {
  nome: string;
  email?: string;
  telefone?: string;
  segmento: LeadSegment;
  canal: Exclude<LeadChannel, "form">;
  mensagem?: string;
  tipoProjeto?: string;
  empresa?: string;
  cargo?: string;
  proximaAcaoEm?: string;
}

function revalidateLead(id?: string) {
  revalidatePath("/admin/leads");
  revalidatePath("/admin/analytics");
  if (id) revalidatePath(`/admin/leads/${id}`);
}

export async function findLeadDuplicates(
  email?: string,
  telefone?: string
): Promise<LeadActionResult> {
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedPhone = telefone?.replace(/\D/g, "");
  if (!normalizedEmail && !normalizedPhone) return { ok: true, duplicates: [] };

  const supabase = await createClient();
  const [emailResult, phoneResult] = await Promise.all([
    normalizedEmail
      ? supabase.from("leads").select("id,nome,email,telefone").ilike("email", normalizedEmail).is("anonimizado_em", null).limit(5)
      : Promise.resolve({ data: [], error: null }),
    normalizedPhone
      ? supabase.from("leads").select("id,nome,email,telefone").eq("telefone_normalizado", normalizedPhone).is("anonimizado_em", null).limit(5)
      : Promise.resolve({ data: [], error: null }),
  ]);
  const error = emailResult.error || phoneResult.error;
  if (error) return { ok: false, error: error.message };
  const unique = new Map([...emailResult.data, ...phoneResult.data].map((lead) => [lead.id, lead]));
  return { ok: true, duplicates: [...unique.values()] };
}

export async function createManualLead(input: ManualLeadInput): Promise<LeadActionResult> {
  if (!input.nome.trim()) return { ok: false, error: "Nome é obrigatório." };
  if (!input.email?.trim() && !input.telefone?.replace(/\D/g, "")) {
    return { ok: false, error: "Informe telefone ou email." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_manual_lead", {
    p_nome: input.nome.trim(),
    p_email: input.email?.trim() || "",
    p_telefone: input.telefone?.trim() || "",
    p_segmento: input.segmento,
    p_mensagem: input.mensagem?.trim() || "",
    p_canal: input.canal,
    p_tipo_projeto: input.tipoProjeto?.trim() || "",
    p_empresa: input.empresa?.trim() || "",
    p_cargo: input.cargo?.trim() || "",
    p_pagina_origem: "",
    p_cta_location: "cadastro_manual",
    p_proxima_acao_em: input.proximaAcaoEm || null,
  });
  if (error || !data) return { ok: false, error: error?.message || "Não foi possível criar o lead." };
  revalidateLead(String(data));
  return { ok: true, id: String(data) };
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus,
  motivo?: string
): Promise<LeadActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_lead_status", {
    p_id: id,
    p_status: status,
    p_motivo: motivo?.trim() || null,
  });
  if (error) return { ok: false, error: error.message };
  revalidateLead(id);
  return { ok: true };
}

export async function registerLeadActivity(
  id: string,
  tipo: "nota" | "contato",
  nota: string,
  proximaAcaoEm?: string
): Promise<LeadActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("register_lead_activity", {
    p_id: id,
    p_tipo: tipo,
    p_nota: nota.trim(),
    p_proxima_acao_em: proximaAcaoEm || null,
  });
  if (error) return { ok: false, error: error.message };
  revalidateLead(id);
  return { ok: true };
}

export async function setLeadNextAction(id: string, date?: string): Promise<LeadActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_lead_next_action", {
    p_id: id,
    p_proxima_acao_em: date || null,
  });
  if (error) return { ok: false, error: error.message };
  revalidateLead(id);
  return { ok: true };
}

export async function markLeadViewed(id: string): Promise<LeadActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("mark_lead_viewed", { p_id: id });
  if (error) return { ok: false, error: error.message };
  revalidateLead(id);
  return { ok: true };
}

export async function setLeadArchived(id: string, archived: boolean): Promise<LeadActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("set_lead_archived", { p_id: id, p_arquivado: archived });
  if (error) return { ok: false, error: error.message };
  revalidateLead(id);
  return { ok: true };
}

export async function resendLeadNotification(id: string): Promise<LeadActionResult> {
  const endpoint = process.env.GOOGLE_SHEETS_LEAD_ENDPOINT?.trim();
  const secret = process.env.GOOGLE_SHEETS_LEAD_SECRET?.trim();
  if (!endpoint) return { ok: false, error: "Endpoint de notificação não configurado." };
  if (!secret) return { ok: false, error: "Segredo de notificação não configurado." };

  const supabase = await createClient();
  const { data: lead, error } = await supabase
    .from("leads")
    .select("id,sheet_sync_tentativas")
    .eq("id", id)
    .single();
  if (error || !lead) return { ok: false, error: error?.message || "Lead não encontrado." };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ sync_secret: secret, lead_id: id }),
      signal: AbortSignal.timeout(8_000),
    });
    const result = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;
    if (!response.ok || result?.success !== true) {
      throw new Error(result?.message || `HTTP ${response.status}`);
    }
    const { error: syncError } = await supabase
      .from("leads")
      .update({
        sheet_sync_status: "sincronizado",
        sheet_sync_tentativas: lead.sheet_sync_tentativas + 1,
        sheet_synced_at: new Date().toISOString(),
        sheet_sync_error: null,
      })
      .eq("id", id);
    if (syncError) {
      revalidateLead(id);
      return {
        ok: false,
        error: "A notificação pode ter sido enviada, mas a confirmação local falhou. Verifique o email antes de reenviar.",
      };
    }
  } catch (notificationError) {
    const message = notificationError instanceof Error
      ? notificationError.message.slice(0, 500)
      : "Falha desconhecida";
    const { error: syncError } = await supabase
      .from("leads")
      .update({
        sheet_sync_status: "falhou",
        sheet_sync_tentativas: lead.sheet_sync_tentativas + 1,
        sheet_sync_error: message,
      })
      .eq("id", id);
    revalidateLead(id);
    return {
      ok: false,
      error: syncError ? `${message} (falha adicional ao salvar o estado)` : message,
    };
  }

  revalidateLead(id);
  return { ok: true };
}
