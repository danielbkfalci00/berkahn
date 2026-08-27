"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/supabase/sessao";
import type { LeadChannel, LeadPriority, LeadSegment, LeadStatus } from "@/types/analytics";

export interface LeadActionResult {
  ok: boolean;
  error?: string;
  id?: string;
  url?: string;
  upload?: { path: string; token: string };
  duplicates?: Array<{ id: string; nome: string; email: string | null; telefone: string | null }>;
}

export interface PushSubscriptionInput {
  endpoint: string;
  p256dh: string;
  auth: string;
  deviceLabel: string;
  userAgent?: string;
}

const LEAD_FILE_MAX_BYTES = 6 * 1024 * 1024;
const LEAD_FILE_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

async function requireCommercialAdmin() {
  const session = await getAdminSession();
  if (!session || !["owner", "comercial"].includes(session.membership.role)) return null;
  return session;
}

function safeStorageName(value: string): string {
  const clean = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-100);
  return clean || "arquivo";
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

export async function updateLeadOperations(
  id: string,
  input: { responsavelId?: string; prioridade: LeadPriority; resumoStatus: string }
): Promise<LeadActionResult> {
  if (input.resumoStatus.trim().length > 500) {
    return { ok: false, error: "O último status deve ter até 500 caracteres." };
  }
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_lead_operations", {
    p_id: id,
    p_responsavel_id: input.responsavelId || null,
    p_prioridade: input.prioridade,
    p_resumo_status: input.resumoStatus.trim(),
  });
  if (error) return { ok: false, error: error.message };
  revalidateLead(id);
  return { ok: true };
}

export async function saveAdminPushSubscription(input: PushSubscriptionInput): Promise<LeadActionResult> {
  const admin = await requireCommercialAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };
  let endpoint: URL;
  try {
    endpoint = new URL(input.endpoint);
  } catch {
    return { ok: false, error: "Assinatura de notificação inválida." };
  }
  if (endpoint.protocol !== "https:" || input.p256dh.length < 20 || input.auth.length < 8) {
    return { ok: false, error: "Assinatura de notificação inválida." };
  }

  const now = new Date().toISOString();
  const { data, error } = await admin.supabase
    .from("admin_push_subscriptions")
    .upsert({
      user_id: admin.user.id,
      endpoint: endpoint.toString(),
      p256dh: input.p256dh,
      auth_key: input.auth,
      device_label: input.deviceLabel.trim().slice(0, 80) || "Dispositivo",
      user_agent: input.userAgent?.slice(0, 500) || null,
      ativo: true,
      ultimo_uso_em: now,
      atualizado_em: now,
    }, { onConflict: "endpoint" })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: error?.message || "Não foi possível ativar as notificações." };
  revalidatePath("/admin/configuracoes");
  return { ok: true, id: data.id };
}

export async function deactivateAdminPushSubscription(endpoint: string): Promise<LeadActionResult> {
  const admin = await requireCommercialAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };
  const { error } = await admin.supabase
    .from("admin_push_subscriptions")
    .update({ ativo: false, atualizado_em: new Date().toISOString() })
    .eq("user_id", admin.user.id)
    .eq("endpoint", endpoint);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/configuracoes");
  return { ok: true };
}

export async function revokeAdminPushDevice(id: string): Promise<LeadActionResult> {
  const admin = await requireCommercialAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };
  const { error } = await admin.supabase
    .from("admin_push_subscriptions")
    .update({ ativo: false, atualizado_em: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", admin.user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/configuracoes");
  return { ok: true };
}

export async function createLeadExternalArtifact(
  leadId: string,
  tipo: "drive_folder" | "external_link",
  nome: string,
  rawUrl: string
): Promise<LeadActionResult> {
  const cleanName = nome.trim();
  if (!cleanName) return { ok: false, error: "Dê um nome ao vínculo." };
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { ok: false, error: "Informe uma URL válida." };
  }
  if (url.protocol !== "https:") return { ok: false, error: "Use uma URL HTTPS." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_lead_external_artifact", {
    p_lead_id: leadId,
    p_tipo: tipo,
    p_nome: cleanName,
    p_url: url.toString(),
  });
  if (error || !data) return { ok: false, error: error?.message || "Não foi possível vincular." };
  revalidateLead(leadId);
  return { ok: true, id: String(data) };
}

export async function prepareLeadUpload(
  leadId: string,
  file: { name: string; type: string; size: number }
): Promise<LeadActionResult> {
  const admin = await requireCommercialAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };
  if (!LEAD_FILE_TYPES.has(file.type)) return { ok: false, error: "Formato de arquivo não permitido." };
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > LEAD_FILE_MAX_BYTES) {
    return { ok: false, error: "O upload direto aceita arquivos de até 6 MB. Para arquivos maiores, use o Drive." };
  }

  const artifactId = randomUUID();
  const path = `${leadId}/${artifactId}-${safeStorageName(file.name)}`;
  const { error: insertError } = await admin.supabase.from("lead_artifacts").insert({
    id: artifactId,
    lead_id: leadId,
    tipo: "upload",
    estado: "pending",
    nome: file.name.trim().slice(0, 180),
    storage_bucket: "lead-files",
    storage_path: path,
    mime_type: file.type,
    size_bytes: file.size,
    criado_por: admin.user.id,
  });
  if (insertError) return { ok: false, error: insertError.message };

  const service = createServiceClient();
  const { data, error } = await service.storage.from("lead-files").createSignedUploadUrl(path);
  if (error || !data) {
    await admin.supabase.from("lead_artifacts").delete().eq("id", artifactId);
    return { ok: false, error: error?.message || "Não foi possível preparar o upload." };
  }
  return { ok: true, id: artifactId, upload: { path, token: data.token } };
}

export async function finalizeLeadUpload(id: string): Promise<LeadActionResult> {
  const admin = await requireCommercialAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };
  const { data: artifact, error } = await admin.supabase
    .from("lead_artifacts")
    .select("id,lead_id,storage_path,estado")
    .eq("id", id)
    .single();
  if (error || !artifact?.storage_path) return { ok: false, error: error?.message || "Arquivo não encontrado." };

  const fileName = artifact.storage_path.split("/").pop() || "";
  const service = createServiceClient();
  const { data: objects, error: listError } = await service.storage
    .from("lead-files")
    .list(artifact.lead_id, { search: fileName, limit: 1 });
  if (listError || !objects?.some((object) => object.name === fileName)) {
    return { ok: false, error: listError?.message || "O upload não foi confirmado no Storage." };
  }

  const { error: updateError } = await admin.supabase
    .from("lead_artifacts")
    .update({ estado: "ready", atualizado_em: new Date().toISOString() })
    .eq("id", id);
  if (updateError) return { ok: false, error: updateError.message };
  await admin.supabase.from("activity_logs").insert({
    user_id: admin.user.id,
    user_name: admin.user.email || "Admin",
    action: "Arquivo enviado ao lead",
    entity_type: "lead",
    entity_id: artifact.lead_id,
    entity_name: `Lead ${artifact.lead_id.slice(0, 8)}`,
    details: { artifact_id: id, tipo: "upload" },
  });
  revalidateLead(artifact.lead_id);
  return { ok: true };
}

export async function cancelLeadUpload(id: string): Promise<LeadActionResult> {
  const admin = await requireCommercialAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };
  const { data, error } = await admin.supabase.rpc("delete_lead_artifact", {
    p_id: id,
    p_pending_only: true,
  });
  if (error) return { ok: false, error: error.message };
  await removeQueuedArtifactObject(data?.[0]);
  return { ok: true };
}

export async function getLeadArtifactUrl(id: string): Promise<LeadActionResult> {
  const admin = await requireCommercialAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };
  const { data: artifact, error } = await admin.supabase
    .from("lead_artifacts")
    .select("external_url,storage_path,estado")
    .eq("id", id)
    .single();
  if (error || !artifact) return { ok: false, error: error?.message || "Arquivo não encontrado." };
  if (artifact.external_url) return { ok: true, url: artifact.external_url };
  if (!artifact.storage_path || artifact.estado !== "ready") return { ok: false, error: "Upload ainda não concluído." };
  const { data, error: signedError } = await createServiceClient()
    .storage.from("lead-files").createSignedUrl(artifact.storage_path, 5 * 60);
  if (signedError || !data) return { ok: false, error: signedError?.message || "Não foi possível abrir o arquivo." };
  return { ok: true, url: data.signedUrl };
}

export async function deleteLeadArtifact(id: string): Promise<LeadActionResult> {
  const admin = await requireCommercialAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };
  const { data, error } = await admin.supabase.rpc("delete_lead_artifact", {
    p_id: id,
    p_pending_only: false,
  });
  if (error || !data?.[0]) return { ok: false, error: error?.message || "Arquivo não encontrado." };
  await removeQueuedArtifactObject(data[0]);
  revalidateLead(data[0].lead_id);
  return { ok: true };
}

async function removeQueuedArtifactObject(
  artifact?: { lead_id: string; bucket: string | null; path: string | null }
): Promise<void> {
  if (!artifact?.bucket || !artifact.path) return;
  const service = createServiceClient();
  const { error } = await service.storage.from(artifact.bucket).remove([artifact.path]);
  if (error) {
    console.error("lead artifact cleanup queued:", error.message);
    return;
  }
  const { error: queueError } = await service
    .from("lead_storage_cleanup")
    .delete()
    .eq("bucket", artifact.bucket)
    .eq("path", artifact.path);
  if (queueError) console.error("lead artifact cleanup dequeue:", queueError.message);
}
