import { notFound } from "next/navigation";
import {
  LeadDetail,
  type LeadActivity,
  type LeadContextLinks,
  type LinkedCommercialRecord,
} from "@/components/admin/analytics/LeadsQueue";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsLead, LeadArtifact, LeadResponsible } from "@/types/analytics";

export const dynamic = "force-dynamic";

const LEAD_COLUMNS = "id,nome,email,telefone,telefone_normalizado,segmento,mensagem,canal,status,prioridade,responsavel_id,resumo_status,resumo_status_em,tipo_projeto,empresa,cargo,pagina_origem,landing_page,referrer,slug_origem,cta_location,utm,post_id,pauta_id,visualizado_em,ultimo_contato_em,proxima_acao_em,motivo_desqualificacao,qualificado_em,desqualificado_em,convertido_em,arquivado_em,anonimizado_em,origem_legado,importado_em,sheet_sync_status,sheet_sync_tentativas,sheet_sync_error,criado_em,lead_responsaveis(id,nome)";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [leadResult, activityResult, budgetResult, proposalResult, artifactsResult, responsiblesResult] = await Promise.all([
    supabase.from("leads").select(LEAD_COLUMNS).eq("id", id).maybeSingle(),
    supabase
      .from("activity_logs")
      .select("id,action,details,created_at,user_name")
      .eq("entity_type", "lead")
      .eq("entity_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.from("orcamentos").select("id,numero,status").eq("lead_id", id).order("criado_em", { ascending: false }),
    supabase.from("proposals").select("id,proposal_number,status").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("lead_artifacts").select("id,lead_id,tipo,estado,nome,external_url,storage_bucket,storage_path,mime_type,size_bytes,criado_em").eq("lead_id", id).order("criado_em", { ascending: false }),
    supabase.from("lead_responsaveis").select("id,nome,ativo,ordem").eq("recebe_leads", true).order("ativo", { ascending: false }).order("ordem").order("nome"),
  ]);

  if (leadResult.error || !leadResult.data) notFound();
  if (activityResult.error) throw new Error(`Falha ao carregar timeline: ${activityResult.error.message}`);
  if (budgetResult.error) throw new Error(`Falha ao carregar orçamentos: ${budgetResult.error.message}`);
  if (proposalResult.error) throw new Error(`Falha ao carregar propostas: ${proposalResult.error.message}`);
  if (artifactsResult.error) throw new Error(`Falha ao carregar arquivos: ${artifactsResult.error.message}`);
  if (responsiblesResult.error) throw new Error(`Falha ao carregar responsáveis: ${responsiblesResult.error.message}`);

  const rawLead = leadResult.data as unknown as Omit<AnalyticsLead, "responsavel" | "artifact_count"> & {
    lead_responsaveis: { id: string; nome: string } | null;
  };
  const lead: AnalyticsLead = {
    ...rawLead,
    responsavel: rawLead.lead_responsaveis,
    artifact_count: artifactsResult.data?.length ?? 0,
  };

  const [postResult, pautaResult] = await Promise.all([
    lead.post_id ? supabase.from("posts").select("slug,title").eq("id", lead.post_id).maybeSingle() : Promise.resolve({ data: null, error: null }),
    lead.pauta_id ? supabase.from("conteudo_pautas").select("id,titulo").eq("id", lead.pauta_id).maybeSingle() : Promise.resolve({ data: null, error: null }),
  ]);
  const contextLinks: LeadContextLinks = {
    post: postResult.data ? { label: postResult.data.title, href: `/atualidades/${postResult.data.slug}` } : null,
    pauta: pautaResult.data ? { label: pautaResult.data.titulo, href: `/admin/conteudo/${pautaResult.data.id}` } : null,
  };

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
      lead={lead}
      activities={(activityResult.data ?? []) as unknown as LeadActivity[]}
      budgets={budgets}
      proposals={proposals}
      artifacts={(artifactsResult.data ?? []) as LeadArtifact[]}
      responsibles={(responsiblesResult.data ?? []) as LeadResponsible[]}
      contextLinks={contextLinks}
    />
  );
}
