// Queries server-side do quadro de conteúdo (/admin/conteudo)
import "server-only";
import { createClient } from "@/lib/supabase/server";
import { toPauta, type Pauta, type PautaRow } from "@/types/conteudo";

/**
 * Colunas da pauta mais o embed do artigo vinculado.
 *
 * O embed `posts(...)` é o que materializa a regra central do quadro: o card
 * LÊ o status real do artigo numa query só e nunca o escreve. Depende da FK
 * declarada na migration 010 — o PostgREST descobre a relação pelo constraint.
 */
const COLUNAS_PAUTA = `
  id, titulo, tipo, coluna, ordem,
  keyword, intencao, funil, prioridade, trilha, semana, data_alvo,
  insights, pesquisa_conteudo, post_id,
  capa_blog_url, capa_linkedin_url, linkedin_texto, linkedin_briefing,
  plataformas, criado_por, criado_em, atualizado_em,
  posts ( id, slug, title, status, published_at )
`;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface ResultadoPautas {
  pautas: Pauta[];
  /** Mensagem de erro do banco, ou null. */
  erro: string | null;
}

/**
 * Todas as pautas, agrupáveis por coluna e já na ordem do quadro.
 *
 * Devolve `{ pautas, erro }` em vez de `[]` em falha: com array vazio, "o
 * banco caiu" e "ainda não há pauta nenhuma" ficam indistinguíveis, e a tela
 * mostraria um estado vazio convidativo por cima de um erro real.
 */
export async function listarPautas(): Promise<ResultadoPautas> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudo_pautas")
    .select(COLUNAS_PAUTA)
    .order("coluna", { ascending: true })
    .order("ordem", { ascending: true });

  if (error) return { pautas: [], erro: error.message };
  if (!data) return { pautas: [], erro: null };

  return {
    pautas: (data as unknown as PautaRow[]).map(toPauta),
    erro: null,
  };
}

/** Uma pauta pelo id. Null quando o id não existe ou não é UUID. */
export async function getPauta(id: string): Promise<Pauta | null> {
  if (!UUID_PATTERN.test(id)) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudo_pautas")
    .select(COLUNAS_PAUTA)
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return toPauta(data as unknown as PautaRow);
}

/**
 * Artigos que ainda não pertencem a nenhuma pauta, para o seletor de vínculo.
 * Filtra no cliente porque o PostgREST não faz anti-join direto: são dezenas
 * de linhas, não milhares.
 */
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
