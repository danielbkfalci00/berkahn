// Sistema de metas dinâmicas: meta = último mês fechado × multiplier.
// Editar constantes abaixo para ajustar ambição.
// Documentação: Berkahn-Vault/10-memory/reference/analytics-methodology.md
//
// Calibração 2026-07-29 (série fev-jul/2026): a média rolling de 3 meses foi
// trocada pelo último mês fechado. Com crescimento rápido, a média de 3 meses
// fica muito abaixo do mês mais recente e produz metas MENORES que o realizado
// anterior — em julho a meta de users era 945 contra 1179 realizados em junho.
// O resultado é que todo KPI marcava 150-850% de atingimento e "on-track" o
// tempo todo, ou seja, a barra não distinguia mês bom de mês ótimo.
// Com o último mês fechado como base, o atingimento vira 162% / 134% / 109%
// em mai/jun/jul — informativo e refletindo a desaceleração real.

import type { TrendPoint } from "@/types/analytics";

/** Multiplier de crescimento aplicado sobre o último mês fechado. */
export const MOM_GROWTH_MULTIPLIER = 1.3;

/** Meta absoluta de indexação (% do catálogo). */
export const INDEXATION_TARGET_PCT = 100;

export type GoalStatus = "on-track" | "at-risk" | "off-track";

export interface MonthlyGoals {
  users: number;
  sessions: number;
  pageviews: number;
  clicks: number;
  impressions: number;
  indexationPct: number;
  /** Quantos meses históricos a média usa. Útil pro tooltip explicar a confiança. */
  basedOnMonths: number;
}

export interface GoalProgress {
  pct: number;
  status: GoalStatus;
}

/**
 * Computa metas a partir do último mês FECHADO anterior ao corrente.
 * Se não houver histórico, usa o próprio mês corrente como base.
 */
export function computeMonthlyGoals(
  allSnapshots: TrendPoint[],
  currentMonthSlug: string
): MonthlyGoals {
  // Mês parcial não serve de base: é um prefixo do fechamento e puxaria a meta
  // do mês seguinte pra baixo.
  const past = allSnapshots.filter((p) => p.monthSlug < currentMonthSlug && !p.partial);

  if (past.length === 0) {
    // Sem histórico — usa o próprio mês corrente como baseline
    const current = allSnapshots.find((p) => p.monthSlug === currentMonthSlug);
    if (!current) {
      return {
        users: 0,
        sessions: 0,
        pageviews: 0,
        clicks: 0,
        impressions: 0,
        indexationPct: INDEXATION_TARGET_PCT,
        basedOnMonths: 0,
      };
    }
    return {
      users: Math.round(current.users * MOM_GROWTH_MULTIPLIER),
      sessions: Math.round(current.sessions * MOM_GROWTH_MULTIPLIER),
      pageviews: Math.round(current.pageviews * MOM_GROWTH_MULTIPLIER),
      clicks: Math.round(current.clicks * MOM_GROWTH_MULTIPLIER),
      impressions: Math.round(current.impressions * MOM_GROWTH_MULTIPLIER),
      indexationPct: INDEXATION_TARGET_PCT,
      basedOnMonths: 0,
    };
  }

  const baseline = past[past.length - 1];

  return {
    users: Math.round(baseline.users * MOM_GROWTH_MULTIPLIER),
    sessions: Math.round(baseline.sessions * MOM_GROWTH_MULTIPLIER),
    pageviews: Math.round(baseline.pageviews * MOM_GROWTH_MULTIPLIER),
    clicks: Math.round(baseline.clicks * MOM_GROWTH_MULTIPLIER),
    impressions: Math.round(baseline.impressions * MOM_GROWTH_MULTIPLIER),
    indexationPct: INDEXATION_TARGET_PCT,
    basedOnMonths: 1,
  };
}

/**
 * Calcula progresso vs meta (clamped 0-200% para evitar números absurdos).
 */
export function computeGoalProgress(current: number, target: number): GoalProgress {
  if (target <= 0) return { pct: 0, status: "off-track" };
  const pctRaw = (current / target) * 100;
  const pct = Math.max(0, Math.min(200, Math.round(pctRaw)));
  const status: GoalStatus = pct >= 80 ? "on-track" : pct >= 50 ? "at-risk" : "off-track";
  return { pct, status };
}

/**
 * Formata "X de Y meta (P%)" pra texto compacto.
 */
export function formatGoalLabel(current: number, target: number): string {
  const { pct } = computeGoalProgress(current, target);
  return `de ${target.toLocaleString("pt-BR")} (${pct}%)`;
}

/**
 * Curta descrição da fórmula, usada como footer no card e tooltip.
 */
export function formulaLabel(basedOnMonths: number): string {
  if (basedOnMonths === 0) return `meta = atual × ${MOM_GROWTH_MULTIPLIER}`;
  return `meta = mês anterior × ${MOM_GROWTH_MULTIPLIER}`;
}

/**
 * Cor da progress bar conforme status.
 */
export function goalStatusColor(status: GoalStatus): string {
  return { "on-track": "#1F6F3D", "at-risk": "#B8801F", "off-track": "#B83A3A" }[status];
}
