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
 * Mapa { monthSlug → Map<slug, pageviews> } para reconstruir sparklines por post.
 * Lê de todos os snapshots disponíveis.
 */
export async function getHistoricalPageviewsBySlug(): Promise<Map<string, Map<string, number>>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analytics_snapshots")
    .select("month, ga4_data")
    .order("month", { ascending: true });

  if (error || !data) return new Map();

  const result = new Map<string, Map<string, number>>();
  for (const row of data) {
    const r = row as { month: string; ga4_data: { topPages?: Array<{ slug: string; pageviews: number }> } };
    const monthSlug = r.month.slice(0, 7);
    const inner = new Map<string, number>();
    for (const page of r.ga4_data?.topPages ?? []) {
      if (page.slug) inner.set(page.slug, page.pageviews);
    }
    result.set(monthSlug, inner);
  }
  return result;
}

/**
 * Busca todos os snapshots como TrendPoint[] (formato leve, sem dados crus).
 * Usado por GrowthChart.
 */
export async function getAllTrendPoints(): Promise<TrendPoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analytics_snapshots")
    // partial vem de dentro do JSONB via operador do PostgREST, evitando puxar
    // o context inteiro de todos os meses só pra ler um boolean.
    .select("month, ga4_data, gsc_data, partial:context->>partial")
    .order("month", { ascending: true });

  if (error || !data) return [];

  const PT_BR_MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return data.map((row: { month: string; ga4_data: any; gsc_data: any; partial: string | null }) => {
    const monthSlug = row.month.slice(0, 7);
    const [year, m] = monthSlug.split("-");
    const monthIdx = parseInt(m) - 1;
    return {
      monthSlug,
      monthLabel: `${PT_BR_MONTHS[monthIdx]}/${year.slice(2)}`,
      users: row.ga4_data?.users ?? 0,
      sessions: row.ga4_data?.sessions ?? 0,
      pageviews: row.ga4_data?.pageviews ?? 0,
      clicks: row.gsc_data?.clicks ?? 0,
      impressions: row.gsc_data?.impressions ?? 0,
      // ->> devolve texto; snapshots antigos não têm a chave e vêm null.
      partial: row.partial === "true",
    };
  });
}
