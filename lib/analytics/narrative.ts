// Geradores de subtítulos dinâmicos que conectam os Atos.
// Princípio: cada Ato N referencia dado do Ato N-1 pra criar fluxo narrativo.
// Sem hedging, sem travessões estilísticos (regra copy-sem-travessao).

import type { SnapshotContext } from "@/types/analytics";
import type { HealthScoreBreakdown } from "./health-score";
import { buildAiBreakdown } from "./ai-sources";

function pctFmt(n: number | undefined): string {
  if (n === undefined || n === null || Number.isNaN(n)) return "0%";
  return `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`;
}

function intFmt(n: number): string {
  return n.toLocaleString("pt-BR");
}

export function narrativeAct0Status(
  ctx: SnapshotContext,
  health: HealthScoreBreakdown,
  win: string | null,
  redFlag: string | null
): string {
  const statusWord = {
    excellent: "está excelente",
    good: "está bom",
    warning: "pede atenção",
    critical: "está em alerta",
  }[health.status];
  const monthName = ctx.partial ? `${ctx.monthLabel} (parcial)` : ctx.monthLabel;
  const parts = [`${monthName} ${statusWord}`];
  if (win) parts.push(`maior ganho: ${win}`);
  if (redFlag) parts.push(`maior risco: ${redFlag}`);
  return parts.join(". ") + ".";
}

export function narrativeAct1Growth(ctx: SnapshotContext): string {
  const usersMoM = ctx.ga4.usersMoMPct;
  const clicksMoM = ctx.gsc.clicksMoMPct;
  const topArea = ctx.ga4.byArea[0];

  if (usersMoM === undefined || clicksMoM === undefined) {
    return `${intFmt(ctx.ga4.users)} usuários neste mês.`;
  }

  const direction = usersMoM >= 0 ? "cresceu" : "caiu";
  const searchDirection = clicksMoM >= 0 ? "subiu" : "caiu";
  let text = `Tráfego ${direction} ${pctFmt(Math.abs(usersMoM))} e search ${searchDirection} ${pctFmt(Math.abs(clicksMoM))} vs mês anterior`;
  if (topArea) {
    text += `. ${topArea.area} concentra ${topArea.pctOfTotal}% dos pageviews`;
  }
  return text + ".";
}

export function narrativeAct2Origin(ctx: SnapshotContext): string {
  const totalSessions = ctx.ga4.topSources.reduce((s, src) => s + src.sessions, 0);
  const totalUsers = ctx.ga4.topSources.reduce((s, src) => s + src.users, 0);
  const ai = buildAiBreakdown(ctx.ga4.topSources, totalUsers, totalSessions);
  const topSource = ctx.ga4.topSources[0];
  const risingQuery = ctx.gsc.risingQueries[0];

  const parts: string[] = [];
  if (topSource) {
    parts.push(`${topSource.label} responde por ${topSource.pctOfTotal}% das sessões`);
  }
  if (ai.totalUsers > 0) {
    parts.push(`IAs trouxeram ${ai.totalUsers} usuários (${ai.pctOfTotal}%)`);
  }
  if (risingQuery && risingQuery.clicksDelta > 0) {
    parts.push(`"${risingQuery.query}" ganhou ${risingQuery.clicksDelta} cliques`);
  }

  return parts.length > 0 ? parts.join(". ") + "." : "Distribuição de origem do tráfego no período.";
}

export interface Act3NarrativeInput {
  bestPost?: { title: string; pageviews: number; retentionPct: number } | null;
  risingCount?: number;
  coldCount?: number;
  engagedCount?: number;
  abandonedCount?: number;
}

export function narrativeAct3Posts(ctx: SnapshotContext, input?: Act3NarrativeInput): string {
  const best = input?.bestPost;
  const parts: string[] = [];

  if (best) {
    parts.push(
      `${best.title} liderou com ${intFmt(best.pageviews)} pageviews e ${best.retentionPct}% de retenção`
    );
  } else {
    const topPage = ctx.ga4.topPages[0];
    if (topPage) {
      parts.push(`${topPage.title || topPage.slug} liderou com ${intFmt(topPage.pageviews)} pageviews`);
    }
  }

  const counts: string[] = [];
  if (input?.engagedCount && input.engagedCount > 0) counts.push(`${input.engagedCount} engajados`);
  if (input?.risingCount && input.risingCount > 0) counts.push(`${input.risingCount} em alta`);
  if (input?.coldCount && input.coldCount > 0) counts.push(`${input.coldCount} em queda`);
  if (input?.abandonedCount && input.abandonedCount > 0)
    counts.push(`${input.abandonedCount} abandonados`);
  if (counts.length > 0) parts.push(counts.join(", "));

  return parts.length > 0 ? parts.join(". ") + "." : "Análise de performance dos posts publicados.";
}

export interface Act4NarrativeInput {
  bestPostTitle?: string | null;
  abandonedCount?: number;
  coldCount?: number;
}

export function narrativeAct4Action(ctx: SnapshotContext, input?: Act4NarrativeInput): string {
  const p0 = ctx.actionsP0.length;
  const p1 = ctx.actionsP1.length;
  const notIndexed = ctx.totalArticles - ctx.indexedCount;
  const parts: string[] = [];

  const bridge = (() => {
    if (input?.abandonedCount && input.abandonedCount > 0) {
      const word = input.abandonedCount === 1 ? "post abandonado" : "posts abandonados";
      return `${input.abandonedCount} ${word} pedem revisão`;
    }
    if (input?.coldCount && input.coldCount > 0) {
      const word = input.coldCount === 1 ? "post em queda" : "posts em queda";
      return `${input.coldCount} ${word} a investigar`;
    }
    if (input?.bestPostTitle) {
      return `Após "${input.bestPostTitle}" liderar a leitura`;
    }
    return null;
  })();

  if (bridge) parts.push(bridge);
  if (p0 > 0) parts.push(`${p0} ${p0 === 1 ? "ação P0" : "ações P0"} esta semana`);
  if (p1 > 0) parts.push(`${p1} P1 nas próximas duas semanas`);
  if (notIndexed > 0) parts.push(`${notIndexed} artigos aguardando indexação`);
  if (parts.length === 0) {
    parts.push("Nenhuma ação urgente. Foco em P1 e novos conteúdos");
  } else if (notIndexed === 0 && p0 === 0 && !bridge) {
    parts.push("Nenhuma ação urgente. Foco em P1 e novos conteúdos");
  }
  return parts.length > 0 ? parts.join(". ") + "." : "Próximos passos do período.";
}

/**
 * Detecta o maior ganho do mês — usado pelo WinCard.
 * Retorna a métrica de maior crescimento MoM ou null se nada subiu significativamente.
 */
export function detectWin(ctx: SnapshotContext): string | null {
  const candidates: { label: string; pct: number; absolute: string }[] = [];
  const ga4 = ctx.ga4;
  const gsc = ctx.gsc;

  if (ga4.usersMoMPct !== undefined && ga4.usersMoMPct > 10) {
    candidates.push({
      label: "usuários",
      pct: ga4.usersMoMPct,
      absolute: `${intFmt(ga4.users)} users`,
    });
  }
  if (gsc.clicksMoMPct !== undefined && gsc.clicksMoMPct > 10) {
    candidates.push({
      label: "cliques no Google",
      pct: gsc.clicksMoMPct,
      absolute: `${intFmt(gsc.clicks)} cliques`,
    });
  }
  if (gsc.impressionsMoMPct !== undefined && gsc.impressionsMoMPct > 10) {
    candidates.push({
      label: "impressões",
      pct: gsc.impressionsMoMPct,
      absolute: `${intFmt(gsc.impressions)} impressões`,
    });
  }
  if (ga4.pageviewsMoMPct !== undefined && ga4.pageviewsMoMPct > 10) {
    candidates.push({
      label: "pageviews",
      pct: ga4.pageviewsMoMPct,
      absolute: `${intFmt(ga4.pageviews)} pageviews`,
    });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.pct - a.pct);
  const top = candidates[0];
  return `${top.label} subiu ${pctFmt(top.pct)} (${top.absolute})`;
}

/**
 * Detecta a maior queda do mês — usado pelo RedFlagCard.
 * Retorna null se nada caiu mais de 15%.
 */
export function detectRedFlag(ctx: SnapshotContext): string | null {
  const candidates: { label: string; pct: number; absolute: string }[] = [];
  const ga4 = ctx.ga4;
  const gsc = ctx.gsc;

  if (ga4.usersMoMPct !== undefined && ga4.usersMoMPct < -15) {
    candidates.push({
      label: "usuários",
      pct: ga4.usersMoMPct,
      absolute: `${intFmt(ga4.users)} users`,
    });
  }
  if (gsc.clicksMoMPct !== undefined && gsc.clicksMoMPct < -15) {
    candidates.push({
      label: "cliques no Google",
      pct: gsc.clicksMoMPct,
      absolute: `${intFmt(gsc.clicks)} cliques`,
    });
  }
  if (ga4.engagementRateMoMPct !== undefined && ga4.engagementRateMoMPct < -10) {
    candidates.push({
      label: "engagement rate",
      pct: ga4.engagementRateMoMPct,
      absolute: `${ga4.engagementRate}%`,
    });
  }

  // Indexação caindo (proxy: se indexed < total e era 100% antes — fase 2 com snapshot anterior)
  if (ctx.totalArticles > 0 && ctx.indexedCount / ctx.totalArticles < 0.5) {
    candidates.push({
      label: "indexação",
      pct: -50,
      absolute: `${ctx.indexedCount} de ${ctx.totalArticles} artigos`,
    });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => a.pct - b.pct);
  const worst = candidates[0];
  return `${worst.label} caiu ${pctFmt(Math.abs(worst.pct))} (${worst.absolute})`;
}
