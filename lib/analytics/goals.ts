// Sistema de metas dinâmicas: meta = média rolling N meses × multiplier.
// Editar constantes abaixo para ajustar ambição.
// Documentação: Berkahn-Vault/10-memory/reference/analytics-methodology.md

import type { TrendPoint } from "@/types/analytics";

/** Multiplier de crescimento aplicado sobre a média histórica. */
export const MOM_GROWTH_MULTIPLIER = 1.3;

/** Quantos meses olhar para trás ao calcular a média. */
export const LOOKBACK_MONTHS = 3;

/** Mínimo de meses necessários antes de ter uma média confiável. Abaixo disso, meta = current × multiplier. */
export const MIN_LOOKBACK_MONTHS = 1;

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
 * Computa metas a partir do histórico, EXCLUINDO o mês corrente.
 * Se não houver histórico suficiente, usa o próprio mês corrente como base.
 */
export function computeMonthlyGoals(
  allSnapshots: TrendPoint[],
  currentMonthSlug: string
): MonthlyGoals {
  const past = allSnapshots
    .filter((p) => p.monthSlug < currentMonthSlug)
    .slice(-LOOKBACK_MONTHS);

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

  const avg = (key: keyof Pick<TrendPoint, "users" | "sessions" | "pageviews" | "clicks" | "impressions">) =>
    past.reduce((sum, p) => sum + (p[key] as number), 0) / past.length;

  return {
    users: Math.round(avg("users") * MOM_GROWTH_MULTIPLIER),
    sessions: Math.round(avg("sessions") * MOM_GROWTH_MULTIPLIER),
    pageviews: Math.round(avg("pageviews") * MOM_GROWTH_MULTIPLIER),
    clicks: Math.round(avg("clicks") * MOM_GROWTH_MULTIPLIER),
    impressions: Math.round(avg("impressions") * MOM_GROWTH_MULTIPLIER),
    indexationPct: INDEXATION_TARGET_PCT,
    basedOnMonths: past.length,
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
  return `meta = média ${basedOnMonths}m × ${MOM_GROWTH_MULTIPLIER}`;
}

/**
 * Cor da progress bar conforme status.
 */
export function goalStatusColor(status: GoalStatus): string {
  return { "on-track": "#1F6F3D", "at-risk": "#B8801F", "off-track": "#B83A3A" }[status];
}
