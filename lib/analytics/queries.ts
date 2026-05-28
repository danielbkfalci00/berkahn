// Queries server-side para o /admin/analytics dashboard
import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AnalyticsSnapshot, TrendPoint } from "@/types/analytics";

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
 * Busca todos os snapshots como TrendPoint[] (formato leve, sem dados crus).
 * Usado por GrowthChart.
 */
export async function getAllTrendPoints(): Promise<TrendPoint[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("analytics_snapshots")
    .select("month, ga4_data, gsc_data")
    .order("month", { ascending: true });

  if (error || !data) return [];

  const PT_BR_MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  return data.map((row: { month: string; ga4_data: any; gsc_data: any }) => {
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
    };
  });
}
