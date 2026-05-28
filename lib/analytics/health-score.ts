// Health Score: número único 0-100 que resume a saúde do projeto no mês.
// Fórmula ponderada de 4 componentes (pesos ajustáveis):
//   - Indexação Google (30%): cobertura do catálogo no índice
//   - Crescimento de users MoM (30%): trajetória de tráfego
//   - Crescimento de cliques GSC MoM (20%): performance em search
//   - Engagement rate atual (20%): qualidade do tráfego
//
// Pesos documentados em Berkahn-Vault/10-memory/reference/analytics-methodology.md

import type { SnapshotContext } from "@/types/analytics";

export interface HealthScoreWeights {
  indexation: number;
  usersGrowth: number;
  clicksGrowth: number;
  engagementRate: number;
}

export const DEFAULT_WEIGHTS: HealthScoreWeights = {
  indexation: 0.3,
  usersGrowth: 0.3,
  clicksGrowth: 0.2,
  engagementRate: 0.2,
};

export type HealthStatus = "excellent" | "good" | "warning" | "critical";

export interface HealthScoreBreakdown {
  score: number; // 0-100
  status: HealthStatus;
  components: {
    indexation: { value: number; raw: string };
    usersGrowth: { value: number; raw: string };
    clicksGrowth: { value: number; raw: string };
    engagementRate: { value: number; raw: string };
  };
  weights: HealthScoreWeights;
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Mapeia MoM% pra score 0-100 com sigmoide simples:
//   -50% MoM = 10 / 0% MoM = 50 / +50% MoM = 90 / +100% MoM = ~95
function momToScore(pct: number | undefined): number {
  if (pct === undefined || pct === null || Number.isNaN(pct)) return 50;
  // y = 50 + 40 * tanh(pct/40)
  const tanh = Math.tanh(pct / 40);
  return clampScore(50 + 40 * tanh);
}

// engagementRate já é 0-100. Score direto.
function engagementToScore(rate: number | undefined): number {
  if (rate === undefined || rate === null || Number.isNaN(rate)) return 50;
  return clampScore(rate);
}

// indexation: indexedCount / total → 0-100.
function indexationToScore(indexed: number, total: number): number {
  if (total === 0) return 0;
  return clampScore((indexed / total) * 100);
}

export function statusFromScore(score: number): HealthStatus {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "warning";
  return "critical";
}

export function statusColor(status: HealthStatus): string {
  return {
    excellent: "#1F6F3D",
    good: "#0A0A0A",
    warning: "#B8801F",
    critical: "#B83A3A",
  }[status];
}

export function statusLabel(status: HealthStatus): string {
  return {
    excellent: "Excelente",
    good: "Bom",
    warning: "Atenção",
    critical: "Crítico",
  }[status];
}

export function computeHealthScore(
  ctx: SnapshotContext,
  weights: HealthScoreWeights = DEFAULT_WEIGHTS
): HealthScoreBreakdown {
  const indexationScore = indexationToScore(ctx.indexedCount, ctx.totalArticles);
  const usersScore = momToScore(ctx.ga4.usersMoMPct);
  const clicksScore = momToScore(ctx.gsc.clicksMoMPct);
  const engagementScore = engagementToScore(ctx.ga4.engagementRate);

  const score = clampScore(
    indexationScore * weights.indexation +
      usersScore * weights.usersGrowth +
      clicksScore * weights.clicksGrowth +
      engagementScore * weights.engagementRate
  );

  return {
    score,
    status: statusFromScore(score),
    components: {
      indexation: {
        value: indexationScore,
        raw: `${ctx.indexedCount}/${ctx.totalArticles} indexados`,
      },
      usersGrowth: {
        value: usersScore,
        raw: ctx.ga4.usersMoMText ?? "—",
      },
      clicksGrowth: {
        value: clicksScore,
        raw: ctx.gsc.clicksMoMText ?? "—",
      },
      engagementRate: {
        value: engagementScore,
        raw: `${ctx.ga4.engagementRate}%`,
      },
    },
    weights,
  };
}
