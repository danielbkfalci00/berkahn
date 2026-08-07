// Queries server-side do quadro de conteúdo (/admin/conteudo)
import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  toPauta,
  type AcaoAutomacao,
  type JobAutomacao,
  type Pauta,
  type PautaRow,
  type StatusAutomacao,
  type TagCatalogo,
  type TagConteudo,
} from "@/types/conteudo";

const COLUNAS_PAUTA = `
  id, titulo, tipo,
  status_blog, status_linkedin, ordem_blog, ordem_linkedin,
  draft_path, linkedin_url, linkedin_publicado_em,
  keyword, intencao, funil, prioridade, trilha, semana, data_alvo,
  insights, pesquisa_conteudo, post_id,
  capa_blog_url, capa_linkedin_url, linkedin_texto, linkedin_briefing,
  linkedin_imagem_prompt, linkedin_imagem_briefing,
  plataformas, criado_por, criado_em, atualizado_em,
  posts ( id, slug, title, status, published_at )
`;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ResultadoPautas {
  pautas: Pauta[];
  erro: string | null;
}

interface TagRow { pauta_id: string; tag_slug: TagConteudo }
interface JobRow {
  id: string;
  pauta_id: string;
  acao: AcaoAutomacao;
  status: StatusAutomacao;
  tentativas: number;
  erro: string | null;
  criado_em: string;
  atualizado_em: string;
}

function toJob(row: JobRow): JobAutomacao {
  return {
    id: row.id,
    acao: row.acao,
    status: row.status,
    tentativas: row.tentativas,
    erro: row.erro,
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em,
  };
}

async function enriquecerPautas(
  supabase: Awaited<ReturnType<typeof createClient>>,
  pautas: Pauta[]
): Promise<Pauta[]> {
  if (pautas.length === 0) return pautas;
  const ids = pautas.map((pauta) => pauta.id);
  const [{ data: tags }, { data: jobs }] = await Promise.all([
    supabase
      .from("conteudo_pauta_tags")
      .select("pauta_id,tag_slug")
      .in("pauta_id", ids),
    supabase
      .from("conteudo_automation_jobs")
      .select("id,pauta_id,acao,status,tentativas,erro,criado_em,atualizado_em")
      .in("pauta_id", ids)
      .order("criado_em", { ascending: false }),
  ]);

  const tagsPorPauta = new Map<string, TagConteudo[]>();
  for (const row of (tags ?? []) as unknown as TagRow[]) {
    const atuais = tagsPorPauta.get(row.pauta_id) ?? [];
    atuais.push(row.tag_slug);
    tagsPorPauta.set(row.pauta_id, atuais);
  }

  const jobPorPauta = new Map<string, JobAutomacao>();
  for (const row of (jobs ?? []) as unknown as JobRow[]) {
    if (!jobPorPauta.has(row.pauta_id)) jobPorPauta.set(row.pauta_id, toJob(row));
  }

  return pautas.map((pauta) => ({
    ...pauta,
    tags: tagsPorPauta.get(pauta.id) ?? [],
    automationJob: jobPorPauta.get(pauta.id) ?? null,
  }));
}

export async function listarPautas(): Promise<ResultadoPautas> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudo_pautas")
    .select(COLUNAS_PAUTA)
    .order("data_alvo", { ascending: true, nullsFirst: false })
    .order("ordem_blog", { ascending: true, nullsFirst: false });

  if (error) return { pautas: [], erro: error.message };
  if (!data) return { pautas: [], erro: null };

  const pautas = (data as unknown as PautaRow[]).map(toPauta);
  return { pautas: await enriquecerPautas(supabase, pautas), erro: null };
}

export async function getPauta(id: string): Promise<Pauta | null> {
  if (!UUID_PATTERN.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudo_pautas")
    .select(COLUNAS_PAUTA)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  const [pauta] = await enriquecerPautas(supabase, [toPauta(data as unknown as PautaRow)]);
  return pauta ?? null;
}

export async function listarTagsConteudo(): Promise<TagCatalogo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conteudo_tags")
    .select("slug,label,ativo,ordem")
    .eq("ativo", true)
    .order("ordem");
  return (data ?? []) as unknown as TagCatalogo[];
}

export async function listarArtigosVinculaveis(): Promise<
  { id: string; slug: string; titulo: string; status: string }[]
> {
  const supabase = await createClient();

  const [{ data: posts }, { data: pautas }] = await Promise.all([
    supabase
      .from("posts")
      .select("id, slug, title, status")
      .order("created_at", { ascending: false }),
    supabase.from("conteudo_pautas").select("post_id").not("post_id", "is", null),
  ]);

  if (!posts) return [];
  const tomados = new Set((pautas ?? []).map((p) => (p as { post_id: string }).post_id));

  return (posts as { id: string; slug: string; title: string; status: string }[])
    .filter((p) => !tomados.has(p.id))
    .map((p) => ({ id: p.id, slug: p.slug, titulo: p.title, status: p.status }));
}
