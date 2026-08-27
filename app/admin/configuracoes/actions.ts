"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/supabase/sessao";
import { ADMIN_ROLES } from "@/lib/admin/access";
import type { AdminRole } from "@/types/analytics";

interface ActionResult {
  ok: boolean;
  error?: string;
}

async function requireOwner() {
  const session = await getAdminSession();
  return session?.membership.role === "owner" ? session : null;
}

export async function inviteAdminMember(input: {
  nome: string;
  email: string;
  role: AdminRole;
}): Promise<ActionResult> {
  const owner = await requireOwner();
  if (!owner) return { ok: false, error: "Apenas proprietários podem convidar pessoas." };
  const nome = input.nome.trim();
  const email = input.email.trim().toLowerCase();
  if (nome.length < 2 || nome.length > 80) return { ok: false, error: "Informe um nome entre 2 e 80 caracteres." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "Informe um email válido." };
  if (!ADMIN_ROLES.includes(input.role)) return { ok: false, error: "Papel inválido." };

  const service = createServiceClient();
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim() || "https://admin.berkahn.com.br";
  const { data: invite, error: inviteError } = await service.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${adminUrl}/auth/callback?next=/admin/definir-senha`,
    data: { full_name: nome },
  });
  if (inviteError || !invite.user) return { ok: false, error: inviteError?.message || "Não foi possível enviar o convite." };

  const { error } = await service.from("lead_responsaveis").upsert({
    nome,
    email,
    user_id: invite.user.id,
    role: input.role,
    ativo: true,
    recebe_leads: input.role === "owner" || input.role === "comercial",
    atualizado_em: new Date().toISOString(),
  }, { onConflict: "email" });
  if (error) {
    await service.auth.admin.deleteUser(invite.user.id);
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin/configuracoes");
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function updateAdminMember(input: {
  id: string;
  role: AdminRole;
  ativo: boolean;
  recebeLeads: boolean;
}): Promise<ActionResult> {
  const owner = await requireOwner();
  if (!owner) return { ok: false, error: "Apenas proprietários podem alterar a equipe." };
  if (!ADMIN_ROLES.includes(input.role)) return { ok: false, error: "Papel inválido." };
  const service = createServiceClient();
  const { data: target, error: targetError } = await service.from("lead_responsaveis").select("user_id").eq("id", input.id).single();
  if (targetError || !target) return { ok: false, error: "Membro não encontrado." };
  if (target.user_id === owner.user.id && (input.role !== "owner" || !input.ativo)) {
    return { ok: false, error: "Você não pode remover o próprio acesso de proprietário." };
  }
  const { error } = await service.from("lead_responsaveis").update({
    role: input.role,
    ativo: input.ativo,
    recebe_leads: input.recebeLeads && (input.role === "owner" || input.role === "comercial"),
    atualizado_em: new Date().toISOString(),
  }).eq("id", input.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/configuracoes");
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function updateOwnNotificationPreferences(input: {
  novosLeads: boolean;
  acoesVencidas: boolean;
}): Promise<ActionResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, error: "Não autorizado." };
  const { error } = await createServiceClient().from("lead_responsaveis").update({
    notificar_novos_leads: input.novosLeads,
    notificar_acoes_vencidas: input.acoesVencidas,
    atualizado_em: new Date().toISOString(),
  }).eq("id", session.membership.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/configuracoes");
  return { ok: true };
}
