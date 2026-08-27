import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AdminMembership, AdminRole } from "@/types/analytics";

export async function getAdminSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: membership, error } = await supabase
    .from("lead_responsaveis")
    .select("id,nome,email,role,ativo,recebe_leads,notificar_novos_leads,notificar_acoes_vencidas")
    .eq("user_id", user.id)
    .eq("ativo", true)
    .maybeSingle();
  if (error || !membership) return null;
  return { supabase, user, membership: membership as AdminMembership };
}

/**
 * Barreira de autenticação para route handlers sob /api/admin.
 *
 * O middleware já barra essas rotas, mas ele depende de um `matcher` estar
 * correto — e essa configuração já falhou uma vez: o matcher era
 * `['/', '/admin/:path*']` e não cobria `/api/admin/*`, deixando seis rotas
 * abertas na internet, três delas usando service key. Esta checagem local é a
 * segunda barreira, para que a garantia não dependa de um arquivo distante.
 *
 * Devolve `null` quando há sessão, ou a resposta 401 pronta para retornar:
 *
 *   const barrado = await exigirSessao()
 *   if (barrado) return barrado
 */
export async function exigirSessao(
  roles: AdminRole[] = ["owner", "comercial"]
): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session || !roles.includes(session.membership.role)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return null;
}
