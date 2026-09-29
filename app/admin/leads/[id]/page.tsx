import { notFound } from "next/navigation";
import {
  LeadDetail,
  type LeadActivity,
  type LeadContextLinks,
  type LinkedCommercialRecord,
} from "@/components/admin/analytics/LeadsQueue";
import { LeadPrivacyPanel } from "@/components/admin/analytics/LeadPrivacyPanel";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/supabase/sessao";
import type { AnalyticsLead, LeadArtifact, LeadResponsible } from "@/types/analytics";

export const dynamic = "force-dynamic";

const LEAD_COLUMNS = "id,nome,email,telefone,telefone_normalizado,segmento,mensagem,canal,tipo_captacao,status,prioridade,responsavel_id,resumo_status,resumo_status_em,tipo_projeto,empresa,cargo,pagina_origem,landing_page,referrer,slug_origem,cta_location,utm,post_id,pauta_id,visualizado_em,ultimo_contato_em,proxima_acao_em,motivo_desqualificacao,qualificado_em,desqualificado_em,convertido_em,arquivado_em,anonimizado_em,retencao_excecao,retencao_excecao_motivo,origem_legado,importado_em,criado_em,lead_responsaveis(id,nome)";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const session = await getAdminSession();
  const isOwner = session?.membership.role === "owner";
  const [leadResult, activityResult, budgetResult, proposalResult, artifactsResult, responsiblesResult] = await Promise.all([
    supabase.from("leads").select(LEAD_COLUMNS).eq("id", id).maybeSingle(),
    supabase
      .from("activity_logs")
      .select("id,action,details,created_at,user_name")
      .eq("entity_type", "lead")
      .eq("entity_id", id)
      .order("created_at", { ascending: false }).order("id", { ascending: false })
      .limit(26),
    supabase.from("orcamentos").select("id,numero,status").eq("lead_id", id).order("criado_em", { ascending: false }),
    supabase.from("proposals").select("id,proposal_number,status").eq("lead_id", id).order("created_at", { ascending: false }),
    supabase.from("lead_artifacts").select("id,lead_id,tipo,estado,nome,external_url,storage_bucket,storage_path,mime_type,size_bytes,criado_em").eq("lead_id", id).order("criado_em", { ascending: false }),
    supabase.from("lead_responsaveis").select("id,nome,ativo,ordem").eq("recebe_leads", true).order("ativo", { ascending: false }).order("ordem").order("nome"),
  ]);

  if (leadResult.error) throw new Error(`Falha ao carregar lead: ${leadResult.error.message}`);
  if (!leadResult.data) notFound();
  const sectionErrors = [
    activityResult.error && "A linha do tempo está indisponível. Os dados do contato continuam acessíveis.",
    budgetResult.error && "Não foi possível carregar os orçamentos vinculados.",
    proposalResult.error && "Não foi possível carregar as propostas anteriores.",
    artifactsResult.error && "Não foi possível carregar os arquivos do lead.",
    responsiblesResult.error && "Não foi possível carregar os responsáveis. Aguarde antes de alterar a atribuição.",
  ].filter((message): message is string => Boolean(message));

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
      key={lead.id}
      lead={lead}
      activities={(activityResult.data ?? []).slice(0, 25) as unknown as LeadActivity[]}
      hasMoreActivities={(activityResult.data?.length || 0) > 25}
      sectionErrors={sectionErrors}
      budgets={budgets}
      proposals={proposals}
      artifacts={(artifactsResult.data ?? []) as LeadArtifact[]}
      responsibles={(responsiblesResult.data ?? []) as LeadResponsible[]}
      contextLinks={contextLinks}
      privacyPanel={isOwner ? <LeadPrivacyPanel lead={lead} /> : null}
    />
  );
}
