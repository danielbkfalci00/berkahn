// Helpers de performance individual de posts.
// Cruza GA4 topPages (mês atual + anterior) com Supabase posts (title, read_time, etc).

import type {
  AnalyticsSnapshot,
  Ga4PageRow,
  PostMeta,
  PostPerformance,
  PostStatus,
} from "@/types/analytics";

const ENGAGED_RETENTION_THRESHOLD = 60;
const RISING_GROWTH_THRESHOLD = 30;
const COLD_DROP_THRESHOLD = -30;
const ABANDONED_TIME_THRESHOLD = 15; // segundos
const ABANDONED_BOUNCE_THRESHOLD = 80; // %

/**
 * Retorna retenção 0-100 dado o tempo médio engajado e o read_time esperado.
 */
export function computeRetention(avgEngagementTimeSec: number, readTimeMin: number): number {
  const readSec = Math.max(1, readTimeMin * 60);
  return Math.min(100, Math.round((avgEngagementTimeSec / readSec) * 100));
}

/**
 * Classifica o post em uma das 5 categorias (prioridade em cascata).
 */
export function classifyPost(perf: Omit<PostPerformance, "status">): PostStatus {
  if (perf.retentionPct >= ENGAGED_RETENTION_THRESHOLD) return "engaged";
  if (
    perf.pageviewsMoMPct !== null &&
    perf.pageviewsMoMPct >= RISING_GROWTH_THRESHOLD
  )
    return "rising";
  if (
    perf.pageviewsMoMPct !== null &&
    perf.pageviewsMoMPct <= COLD_DROP_THRESHOLD
  )
    return "cold";
  if (
    perf.avgEngagementTime < ABANDONED_TIME_THRESHOLD ||
    (perf.bounceRate !== null && perf.bounceRate > ABANDONED_BOUNCE_THRESHOLD)
  )
    return "abandoned";
  return "neutral";
}

/**
 * Calcula idade em dias dado um ISO date.
 */
function ageInDays(publishedAt: string | null): number | null {
  if (!publishedAt) return null;
  const pub = new Date(publishedAt);
  if (Number.isNaN(pub.getTime())) return null;
  const days = Math.floor((Date.now() - pub.getTime()) / (1000 * 60 * 60 * 24));
  return days;
}

/**
 * Constrói a tabela de performance por post a partir do snapshot atual,
 * snapshot anterior (opcional) e mapa de metadados do Supabase.
 *
 * Inclui só páginas que casam com slug do Supabase (descarta home, pillar, etc).
 *
 * @param historicalByMonthAndSlug map { "2026-02": { slug → pageviews, ... }, ... }
 *        Usado para o sparkline. Pode estar vazio (sparkline vira [valor atual]).
 */
export function buildPostPerformance(
  current: AnalyticsSnapshot,
  previous: AnalyticsSnapshot | null,
  postsMap: Map<string, PostMeta>,
  historicalByMonthAndSlug: Map<string, Map<string, number>>
): PostPerformance[] {
  const currentPages = current.ga4_data?.topPages ?? [];
  const prevPagesMap = new Map<string, Ga4PageRow>();
  if (previous?.ga4_data?.topPages) {
    for (const p of previous.ga4_data.topPages) {
      prevPagesMap.set(p.slug, p);
    }
  }

  // Lista ordenada de meses pra reconstruir sparkline em ordem cronológica
  const sortedMonths = Array.from(historicalByMonthAndSlug.keys()).sort();

  const results: PostPerformance[] = [];

  for (const page of currentPages) {
    const meta = postsMap.get(page.slug);
    if (!meta) continue; // descarta páginas não-blog (home, pillar, etc)

    const prevPage = prevPagesMap.get(page.slug);
    const pageviewsPrev = prevPage?.pageviews ?? null;
    const pageviewsMoMPct =
      pageviewsPrev !== null && pageviewsPrev > 0
        ? parseFloat((((page.pageviews - pageviewsPrev) / pageviewsPrev) * 100).toFixed(1))
        : null;

    const sparkline = sortedMonths
      .map((m) => historicalByMonthAndSlug.get(m)?.get(page.slug) ?? 0)
      .filter((_, i, arr) => arr[i] > 0 || arr.slice(i).some((v) => v > 0)); // remove zeros iniciais
    if (sparkline.length === 0) sparkline.push(page.pageviews);

    const retentionPct = computeRetention(page.avgEngagementTime, meta.readTimeMin);

    const withoutStatus: Omit<PostPerformance, "status"> = {
      slug: page.slug,
      title: meta.title,
      category: meta.category,
      readTimeMin: meta.readTimeMin,
      ageInDays: ageInDays(meta.publishedAt),
      pageviews: page.pageviews,
      pageviewsPrev,
      pageviewsMoMPct,
      pageviewsSparkline: sparkline,
      users: page.users,
      avgEngagementTime: page.avgEngagementTime,
      bounceRate: page.bounceRate ?? null,
      engagementRate: page.engagementRate ?? null,
      retentionPct,
    };

    results.push({
      ...withoutStatus,
      status: classifyPost(withoutStatus),
    });
  }

  // Ordena por pageviews desc (default)
  results.sort((a, b) => b.pageviews - a.pageviews);
  return results;
}

/**
 * Identifica o "melhor post" do mês: pageviews × retention/100.
 */
export function findBestPost(posts: PostPerformance[]): PostPerformance | null {
  if (posts.length === 0) return null;
  return [...posts].sort(
    (a, b) => b.pageviews * (b.retentionPct / 100) - a.pageviews * (a.retentionPct / 100)
  )[0];
}

/**
 * Identifica a "maior oportunidade": pageviews acima da mediana E retention < 30%.
 */
export function findOpportunityPost(posts: PostPerformance[]): PostPerformance | null {
  if (posts.length === 0) return null;
  const sortedByViews = [...posts].sort((a, b) => b.pageviews - a.pageviews);
  const median =
    sortedByViews[Math.floor(sortedByViews.length / 2)]?.pageviews ?? 0;
  const candidates = posts.filter(
    (p) => p.pageviews >= median && p.retentionPct < 30
  );
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.pageviews - a.pageviews)[0];
}

/**
 * Conta posts por status.
 */
export function countByStatus(posts: PostPerformance[]): Record<PostStatus, number> {
  const counts: Record<PostStatus, number> = {
    engaged: 0,
    rising: 0,
    cold: 0,
    abandoned: 0,
    neutral: 0,
  };
  for (const p of posts) counts[p.status]++;
  return counts;
}

/**
 * Formata segundos para "M:SS" (ex: 135 → "2:15").
 */
export function formatTimeMinSec(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Labels e cores por status.
 */
export const STATUS_META: Record<
  PostStatus,
  { label: string; color: string; bg: string; description: string }
> = {
  engaged: {
    label: "Engajado",
    color: "#1F6F3D",
    bg: "#E8F3EC",
    description: "Retenção de 60% ou mais do read time configurado do post.",
  },
  rising: {
    label: "Em alta",
    color: "#1A5FB4",
    bg: "#E4EEF8",
    description: "Pageviews subiram 30% ou mais vs o mês anterior.",
  },
  cold: {
    label: "Em queda",
    color: "#B8801F",
    bg: "#FDF4D8",
    description: "Pageviews caíram 30% ou mais vs o mês anterior.",
  },
  abandoned: {
    label: "Abandonado",
    color: "#B83A3A",
    bg: "#F8E8E8",
    description: "Tempo médio abaixo de 15s ou taxa de rejeição acima de 80%.",
  },
  neutral: {
    label: "Estável",
    color: "#4A4A4A",
    bg: "#F4F2EC",
    description: "Sem critério dominante de engajamento, alta ou queda.",
  },
};
