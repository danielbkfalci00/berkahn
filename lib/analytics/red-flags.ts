// Detector inteligente de red flags para o Ato 0.
// Cada detector retorna no máximo uma flag. Resultado é ordenado por severidade.
// Limit visual: 3 mostradas, resto vai pra acordion "+X riscos adicionais".
// Documentação: Berkahn-Vault/10-memory/reference/analytics-methodology.md

import type { AnalyticsSnapshot, SnapshotContext } from "@/types/analytics";

export type RedFlagSeverity = "critical" | "warning";

export interface RedFlag {
  id: string;
  severity: RedFlagSeverity;
  metric: string;
  text: string;
  action?: string;
}

// Thresholds (editáveis):
const CRITICAL_DROP_PCT = -20;
const WARNING_DROP_PCT = -10;
const ENGAGEMENT_WARNING_PCT = -15;
const NO_POSTS_THRESHOLD = 0;
const OPPORTUNITY_IMPRESSIONS_MIN = 500;
const OPPORTUNITY_CTR_MAX = 2;

function fmtPct(n: number): string {
  return `${Math.abs(n).toFixed(0)}%`;
}

function fmtInt(n: number): string {
  return n.toLocaleString("pt-BR");
}

/**
 * Detecta red flags baseado em context atual + snapshot anterior + contagem de posts publicados no mês.
 * @param postsPublishedInMonth contagem de posts com published_at dentro do mês atual
 */
export function detectRedFlags(
  context: SnapshotContext,
  previous: AnalyticsSnapshot | null,
  postsPublishedInMonth?: number
): RedFlag[] {
  const flags: RedFlag[] = [];
  const ga4 = context.ga4;
  const gsc = context.gsc;

  // users-drop
  if (ga4.usersMoMPct !== undefined && ga4.usersMoMPct < CRITICAL_DROP_PCT) {
    flags.push({
      id: "users-drop",
      severity: "critical",
      metric: "Usuários",
      text: `Usuários caíram ${fmtPct(ga4.usersMoMPct)} vs mês anterior (${fmtInt(ga4.users)} este mês).`,
      action: "Investigar quedas em fontes de tráfego e campanhas.",
    });
  } else if (ga4.usersMoMPct !== undefined && ga4.usersMoMPct < WARNING_DROP_PCT) {
    flags.push({
      id: "users-drop",
      severity: "warning",
      metric: "Usuários",
      text: `Usuários caíram ${fmtPct(ga4.usersMoMPct)} vs mês anterior.`,
    });
  }

  // clicks-drop
  if (gsc.clicksMoMPct !== undefined && gsc.clicksMoMPct < CRITICAL_DROP_PCT) {
    flags.push({
      id: "clicks-drop",
      severity: "critical",
      metric: "Cliques GSC",
      text: `Cliques no Google caíram ${fmtPct(gsc.clicksMoMPct)} (${fmtInt(gsc.clicks)} este mês).`,
      action: "Conferir posições em queries top e atualizar SERP snippets.",
    });
  } else if (gsc.clicksMoMPct !== undefined && gsc.clicksMoMPct < WARNING_DROP_PCT) {
    flags.push({
      id: "clicks-drop",
      severity: "warning",
      metric: "Cliques GSC",
      text: `Cliques no Google caíram ${fmtPct(gsc.clicksMoMPct)} vs mês anterior.`,
    });
  }

  // indexation-drop
  if (previous?.context) {
    const prevIndexed = previous.context.indexedCount;
    if (context.indexedCount < prevIndexed) {
      const delta = prevIndexed - context.indexedCount;
      flags.push({
        id: "indexation-drop",
        severity: "critical",
        metric: "Indexação",
        text: `Indexação caiu ${delta} artigo${delta === 1 ? "" : "s"} (${prevIndexed} → ${context.indexedCount}).`,
        action: "Verificar GSC Coverage report e solicitar reindexação dos URLs afetados.",
      });
    }
  }

  // engagement-drop
  if (
    ga4.engagementRateMoMPct !== undefined &&
    ga4.engagementRateMoMPct < ENGAGEMENT_WARNING_PCT
  ) {
    flags.push({
      id: "engagement-drop",
      severity: "warning",
      metric: "Engagement rate",
      text: `Engagement rate caiu ${fmtPct(ga4.engagementRateMoMPct)} (${ga4.engagementRate}% este mês).`,
      action: "Revisar tempo médio em posts top e qualidade do tráfego de novas fontes.",
    });
  }

  // no-posts. Em mês parcial o texto muda mas a flag NÃO é suprimida: semanas
  // sem publicar já são um problema real, mesmo com o mês ainda aberto.
  if (postsPublishedInMonth !== undefined && postsPublishedInMonth === NO_POSTS_THRESHOLD) {
    flags.push({
      id: "no-posts",
      severity: "warning",
      metric: "Conteúdo",
      text: context.partial && context.daysCovered
        ? `Nenhum post publicado nos primeiros ${context.daysCovered} dias do mês.`
        : "Nenhum post novo publicado neste mês.",
      action: "Retomar cadência semanal de publicação.",
    });
  }

  // opportunity-queries: queries com volume mas CTR fraco
  const opportunity = gsc.topQueries
    .filter((q) => q.impressions >= OPPORTUNITY_IMPRESSIONS_MIN && q.ctr < OPPORTUNITY_CTR_MAX)
    .sort((a, b) => b.impressions - a.impressions)[0];

  if (opportunity) {
    flags.push({
      id: "opportunity-queries",
      severity: "warning",
      metric: "Oportunidade SEO",
      text: `"${opportunity.query}" tem ${fmtInt(opportunity.impressions)} impressões mas só ${opportunity.ctr.toFixed(1)}% de CTR.`,
      action: "Reescrever meta title/description do post que rankeia pra essa query.",
    });
  }

  // Ordena: critical primeiro
  flags.sort((a, b) => (a.severity === "critical" ? -1 : 1) - (b.severity === "critical" ? -1 : 1));
  return flags;
}
