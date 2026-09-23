import { LeadsQueue, type LeadKpis, type LeadListItem } from "@/components/admin/analytics/LeadsQueue";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { AdminDataResult, LeadChannel, LeadPriority, LeadResponsible, LeadSegment, LeadStatus } from "@/types/analytics";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;
// Estados que encerram o funil: ação vencida neles não é pendência, igual ao push (028).
const CLOSED_STATUSES = "(convertido,desqualificado)";
// Qualificado pelo estado atual: qualificado_em nunca é limpo pela RPC (024), então
// contar pelo carimbo somaria leads que depois foram desqualificados ou voltaram atrás.
const QUALIFIED_STATUSES: LeadStatus[] = ["qualificado", "proposta_enviada", "convertido"];
// A fila não precisa transportar mensagem, atribuição, UTM ou histórico de cada
// lead. Esses campos continuam disponíveis na rota de detalhe.
const LEAD_COLUMNS = "id,nome,email,telefone,status,prioridade,resumo_status,proxima_acao_em,visualizado_em,lead_responsaveis(id,nome),lead_artifacts(count)";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: LeadStatus;
    canal?: LeadChannel;
    segmento?: LeadSegment;
    prioridade?: LeadPriority;
    responsavel?: string;
    periodo?: string;
    vencida?: string;
    semResponsavel?: string;
    semAcao?: string;
    arquivados?: string;
    page?: string;
    view?: "inbox" | "kanban";
  }>;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const requestHeaders = await headers();
  const mobileDevice = requestHeaders.get("sec-ch-ua-mobile") === "?1"
    || /iPhone|iPod|Android.*Mobile|Mobile/i.test(requestHeaders.get("user-agent") ?? "");
  // Um link Kanban salvo no celular precisa receber a Inbox paginada já no
  // primeiro request. A checagem no cliente cobre janelas pequenas em desktop.
  const view = params.view === "kanban" && !mobileDevice ? "kanban" : "inbox";
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select(LEAD_COLUMNS, { count: "exact" })
    .order("criado_em", { ascending: false });

  const safeSearch = params.q?.trim().slice(0, 120).replace(/[,()%]/g, " ");
  if (safeSearch) {
    const normalizedPhone = safeSearch.replace(/\D/g, "");
    const filters = [
      `nome.ilike.%${safeSearch}%`,
      `email.ilike.%${safeSearch}%`,
      `telefone.ilike.%${safeSearch}%`,
    ];
    if (normalizedPhone.length >= 3) {
      filters.push(`telefone_normalizado.ilike.%${normalizedPhone}%`);
    }
    query = query.or(filters.join(","));
  }
  if (params.status) query = query.eq("status", params.status);
  if (params.canal) query = query.eq("canal", params.canal);
  if (params.segmento) query = query.eq("segmento", params.segmento);
  if (params.prioridade) query = query.eq("prioridade", params.prioridade);
  if (params.semResponsavel === "1") query = query.is("responsavel_id", null);
  else if (params.responsavel) query = query.eq("responsavel_id", params.responsavel);
  if (params.periodo && ["7", "28", "90"].includes(params.periodo)) {
    const from = new Date();
    from.setUTCDate(from.getUTCDate() - Number(params.periodo));
    query = query.gte("criado_em", from.toISOString());
  }
  if (params.vencida === "1") {
    query = query.lt("proxima_acao_em", new Date().toISOString()).not("status", "in", CLOSED_STATUSES);
  }
  if (params.semAcao === "1") query = query.is("proxima_acao_em", null);
  // Anonimizado não é lead operável e já fica fora dos KPIs; a lista segue a mesma regra.
  query = query.is("anonimizado_em", null);
  query = params.arquivados === "1" ? query.not("arquivado_em", "is", null) : query.is("arquivado_em", null);

  const from = view === "kanban" ? 0 : (page - 1) * PAGE_SIZE;
  const limit = view === "kanban" ? 150 : PAGE_SIZE;
  const [{ data, count, error }, kpis, responsiblesResult] = await Promise.all([
    query.range(from, from + limit - 1),
    getLeadKpis(supabase),
    supabase.from("lead_responsaveis").select("id,nome,ativo,ordem").eq("ativo", true).eq("recebe_leads", true).order("ordem").order("nome"),
  ]);
  // Página além do fim (link antigo, filtro que encolheu a lista): o PostgREST responde
  // 416 (PGRST103). Volta para a última página válida em vez de derrubar a tela.
  if (error?.code === "PGRST103") {
    const { count: realCount } = await query.range(0, 0);
    const lastPage = Math.max(1, Math.ceil((realCount ?? 0) / PAGE_SIZE));
    const next = new URLSearchParams(Object.entries(params).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
    next.set("page", String(lastPage));
    redirect(`/admin/leads?${next.toString()}`);
  }
  if (error) throw new Error(`Falha ao carregar leads: ${error.message}`);
  if (responsiblesResult.error) throw new Error(`Falha ao carregar responsáveis: ${responsiblesResult.error.message}`);

  const total = count ?? 0;
  const leads = (data ?? []).map((row) => {
    const raw = row as unknown as Omit<LeadListItem, "responsavel" | "artifact_count"> & {
      lead_responsaveis: { id: string; nome: string } | null;
      lead_artifacts: Array<{ count: number }>;
    };
    return {
      ...raw,
      responsavel: raw.lead_responsaveis,
      artifact_count: raw.lead_artifacts?.[0]?.count ?? 0,
    } as LeadListItem;
  });
  return (
    <LeadsQueue
      initialLeads={leads}
      total={total}
      page={page}
      pageCount={Math.ceil(total / PAGE_SIZE)}
      kpis={kpis}
      responsibles={(responsiblesResult.data ?? []) as LeadResponsible[]}
      view={view}
    />
  );
}

type ServerClient = Awaited<ReturnType<typeof createClient>>;

// Contagem agregada no banco (head + count) em vez de trazer as linhas para o Node:
// select sem range trunca em silêncio no max-rows do PostgREST.
// Arquivar é faxina da fila, não apaga o fato de o lead ter chegado; por isso os KPIs
// de 28 dias só excluem anonimizados. Sem isso, arquivar desqualificados inflava a Taxa.
async function getLeadKpis(supabase: ServerClient): Promise<AdminDataResult<LeadKpis>> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 28);
  const base = () => supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .gte("criado_em", since.toISOString())
    .is("anonimizado_em", null);
  const results = await Promise.all([
    base(),
    base().eq("status", "novo"),
    base().in("status", QUALIFIED_STATUSES),
    base().not("convertido_em", "is", null),
  ]);
  const failed = results.find((result) => result.error);
  if (failed) {
    console.error("Falha ao carregar KPIs de leads", failed.error);
    return { status: "unavailable", reason: "Não foi possível consultar os indicadores do CRM agora." };
  }
  const [received, novos, qualified, converted] = results.map((result) => result.count ?? 0);
  return {
    status: "ok",
    data: { received, new: novos, qualified, converted, eligible: received },
  };
}
