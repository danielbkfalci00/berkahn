import { notFound } from "next/navigation";
import {
  LeadDetail,
  type LeadActivity,
  type LinkedCommercialRecord,
} from "@/components/admin/analytics/LeadsQueue";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsLead } from "@/types/analytics";

export const dynamic = "force-dynamic";

const LEAD_COLUMNS = "id,nome,email,telefone,telefone_normalizado,segmento,mensagem,canal,status,tipo_projeto,empresa,cargo,pagina_origem,landing_page,referrer,slug_origem,cta_location,utm,post_id,pauta_id,visualizado_em,ultimo_contato_em,proxima_acao_em,motivo_desqualificacao,qualificado_em,desqualificado_em,convertido_em,arquivado_em,anonimizado_em,origem_legado,importado_em,sheet_sync_status,sheet_sync_tentativas,sheet_sync_error,criado_em";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [leadResult, activityResult, budgetResult, proposalResult] = await Promise.all([
    supabase.from("leads").select(LEAD_COLUMNS).eq("id", id).maybeSingle(),
    supabase
      .from("activity_logs")
      .select("id,action,details,created_at,user_name")
      .eq("entity_type", "lead")
      .eq("entity_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("orcamentos").select("id,numero,status").eq("lead_id", id).order("criado_em", { ascending: false }),
    supabase.from("proposals").select("id,proposal_number,status").eq("lead_id", id).order("created_at", { ascending: false }),
  ]);

  if (leadResult.error || !leadResult.data) notFound();
  if (activityResult.error) throw new Error(`Falha ao carregar timeline: ${activityResult.error.message}`);
  if (budgetResult.error) throw new Error(`Falha ao carregar orçamentos: ${budgetResult.error.message}`);
  if (proposalResult.error) throw new Error(`Falha ao carregar propostas: ${proposalResult.error.message}`);

  const budgets: LinkedCommercialRecord[] = (budgetResult.data ?? []).map((budget) => ({
    id: budget.id,
    label: budget.numero,
    status: budget.status,
    href: `/admin/orcamentos/${budget.id}`,
  }));
  const proposals: LinkedCommercialRecord[] = (proposalResult.data ?? []).map((proposal) => ({
    id: proposal.id,
    label: proposal.proposal_number,
    status: proposal.status,
    href: null,
  }));

  return (
    <LeadDetail
      lead={leadResult.data as unknown as AnalyticsLead}
      activities={(activityResult.data ?? []) as unknown as LeadActivity[]}
      budgets={budgets}
      proposals={proposals}
    />
  );
}
