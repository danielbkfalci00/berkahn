// Queries server-side para o /admin/analytics dashboard
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type {
  AnalyticsSnapshot,
  PostMeta,
  TrendPoint,
} from "@/types/analytics";

/**
 * Lista os meses disponíveis no Supabase, do mais recente ao mais antigo.
 * Retorna slugs no formato "YYYY-MM".
 */
export async function getAvailableMonths(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analytics_snapshots")
    .select("month")
    .order("month", { ascending: false });

  if (error || !data) return [];
  return data.map((row) => (row.month as string).slice(0, 7)); // "YYYY-MM"
}

/**
 * Busca um snapshot específico por monthSlug "YYYY-MM".
 */
export async function getSnapshot(monthSlug: string): Promise<AnalyticsSnapshot | null> {
  if (!/^\d{4}-\d{2}$/.test(monthSlug)) return null;
  const supabase = await createClient();
  const monthDate = `${monthSlug}-01`;
  const { data, error } = await supabase
    .from("analytics_snapshots")
    .select("*")
    .eq("month", monthDate)
    .single();

  if (error || !data) return null;
  return data as AnalyticsSnapshot;
}

/**
 * Busca múltiplos snapshots para construir trend chart e sparklines.
 * @param months array de slugs "YYYY-MM" (ordem qualquer)
 */
export async function getMultipleSnapshots(months: string[]): Promise<AnalyticsSnapshot[]> {
  if (months.length === 0) return [];
  const monthDates = months
    .filter((m) => /^\d{4}-\d{2}$/.test(m))
    .map((m) => `${m}-01`);
  if (monthDates.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analytics_snapshots")
    .select("*")
    .in("month", monthDates)
    .order("month", { ascending: true }); // crescente para trends

  if (error || !data) return [];
  return data as AnalyticsSnapshot[];
}

/**
 * Busca todos os posts publicados, retorna Map slug → metadados para join.
 * Usado pelo Ato 3 (Performance de Posts).
 */
export async function getPublishedPosts(): Promise<Map<string, PostMeta>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("slug, title, category, read_time, published_at")
    .eq("status", "published");

  if (error || !data) return new Map();

  const map = new Map<string, PostMeta>();
  for (const row of data) {
    const r = row as {
      slug: string;
      title: string;
      category: string | null;
      read_time: number | null;
      published_at: string | null;
    };
    if (!r.slug) continue;
    map.set(r.slug, {
      slug: r.slug,
      title: r.title,
      category: r.category ?? "Geral",
      readTimeMin: r.read_time ?? 5,
      publishedAt: r.published_at,
    });
  }
  return map;
}

/**
 * O operador `->` do PostgREST devolve JSON, mas a serialização já chegou como
 * texto em algumas versões. Normalizar aqui evita o modo de falha silencioso:
 * um array virando string faria `page.slug` sair undefined e a matriz renderizar
 * vazia, sem erro nenhum.
 */
function comoArray<T>(valor: unknown): T[] {
  if (Array.isArray(valor)) return valor as T[];
  if (typeof valor === "string") {
    try {
      const parsed = JSON.parse(valor);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

/** `->>` devolve texto; chave ausente vem null. */
function comoNumero(valor: unknown): number {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Mapa { monthSlug → Map<slug, pageviews> } para reconstruir sparklines por post
 * e a matriz artigo × mês. Lê de todos os snapshots disponíveis.
 *
 * Seleciona só `topPages` de dentro do JSONB. Puxar `ga4_data` inteiro de todos
 * os meses custaria ~70 KB por mês depois que os limites de coleta subiram, para
 * ler um único campo — e esta rota é `force-dynamic`, sem cache absorvendo.
 */
export async function getHistoricalPageviewsBySlug(): Promise<Map<string, Map<string, number>>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analytics_snapshots")
    .select("month, topPages:ga4_data->topPages")
    .order("month", { ascending: true });

  if (error || !data) return new Map();

  const result = new Map<string, Map<string, number>>();
  for (const row of data) {
    const r = row as { month: string; topPages: unknown };
    const monthSlug = r.month.slice(0, 7);
    const inner = new Map<string, number>();
    for (const page of comoArray<{ slug?: string; pageviews?: number }>(r.topPages)) {
      if (page.slug) inner.set(page.slug, comoNumero(page.pageviews));
    }
    result.set(monthSlug, inner);
  }
  return result;
}

/**
 * Busca todos os snapshots como TrendPoint[] (formato leve, sem dados crus).
 * Usado por GrowthChart.
 *
 * Cada escalar vem por `->>` em vez de puxar `ga4_data`/`gsc_data` inteiros.
 * Antes, esta query baixava os dois JSONB de todos os meses para extrair cinco
 * números de cada — e depois que os limites de coleta subiram (200 páginas,
 * 1.000 queries), cada snapshot passou de ~30 KB para ~145 KB. Em doze meses
 * isso seria ~1,7 MB por carregamento, numa rota `force-dynamic`.
 */
export async function getAllTrendPoints(): Promise<TrendPoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analytics_snapshots")
    .select(
      [
        "month",
        "users:ga4_data->>users",
        "sessions:ga4_data->>sessions",
        "pageviews:ga4_data->>pageviews",
        "clicks:gsc_data->>clicks",
        "impressions:gsc_data->>impressions",
        "partial:context->>partial",
      ].join(", ")
    )
    .order("month", { ascending: true });

  if (error || !data) return [];

  const PT_BR_MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return data.map((row) => {
    const r = row as unknown as {
      month: string;
      users: string | null;
      sessions: string | null;
      pageviews: string | null;
      clicks: string | null;
      impressions: string | null;
      partial: string | null;
    };
    const monthSlug = r.month.slice(0, 7);
    const [year, m] = monthSlug.split("-");
    const monthIdx = parseInt(m) - 1;
    return {
      monthSlug,
      monthLabel: `${PT_BR_MONTHS[monthIdx]}/${year.slice(2)}`,
      users: comoNumero(r.users),
      sessions: comoNumero(r.sessions),
      pageviews: comoNumero(r.pageviews),
      clicks: comoNumero(r.clicks),
      impressions: comoNumero(r.impressions),
      // ->> devolve texto; snapshots antigos não têm a chave e vêm null.
      partial: r.partial === "true",
    };
  });
}
