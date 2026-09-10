import { comparisonPolicyFor } from "./comparison-policy.mjs";
import type { AnalyticsSnapshot, SnapshotComparability, SnapshotContext } from "@/types/analytics";
import { isExcludedFromSitemap } from "@/lib/seo/thin-content";

export function comparisonAvailability(context: Pick<SnapshotContext, "monthSlug" | "comparability">): SnapshotComparability {
  return comparisonPolicyFor(context.monthSlug, context.comparability) as SnapshotComparability;
}

function withoutGa4Deltas(context: SnapshotContext): SnapshotContext {
  const ga4 = { ...context.ga4 };
  delete ga4.usersMoMText;
  delete ga4.usersMoMPct;
  delete ga4.sessionsMoMText;
  delete ga4.sessionsMoMPct;
  delete ga4.pageviewsMoMText;
  delete ga4.pageviewsMoMPct;
  delete ga4.engagementRateMoMText;
  delete ga4.engagementRateMoMPct;
  delete ga4.avgSessionDurationMoMText;
  delete ga4.avgSessionDurationMoMPct;
  ga4.topPages = ga4.topPages.map(({ momText: _momText, ...page }) => page);

  return {
    ...context,
    ga4,
    summary: context.summary.map((item) => ({
      ...item,
      text: item.text.replace(/\s*\([+-]?\d+(?:[.,]\d+)?%\s+MoM\)/gi, ""),
    })),
  };
}

function isIndexedCoverage(coverageState: string | undefined): boolean {
  const state = (coverageState ?? "").toLowerCase();
  return state.includes("indexed") && !state.includes("not indexed");
}

function withoutExcludedIndexation(context: SnapshotContext): SnapshotContext {
  const originalIndexation = context.indexation ?? [];
  const indexation = originalIndexation.filter((item) => !isExcludedFromSitemap(item.slug));
  const indexedCount = indexation.filter((item) => isIndexedCoverage(item.coverageState)).length;
  const keepAction = (action: { text: string }) =>
    !originalIndexation.some(
      (item) => isExcludedFromSitemap(item.slug) && action.text.includes(item.slug)
    );
  const actionsP0 = (context.actionsP0 ?? []).filter(keepAction);
  const actionsP1 = (context.actionsP1 ?? []).filter(keepAction);
  const actionsP2 = (context.actionsP2 ?? []).filter(keepAction);

  return {
    ...context,
    indexation,
    indexedCount,
    totalArticles: indexation.length,
    summary: context.summary.map((item) => ({
      ...item,
      text: item.text.replace(
        /\d+ de \d+ artigos indexados no Google\./i,
        `${indexedCount} de ${indexation.length} artigos indexados no Google.`
      ),
    })),
    actionsP0,
    actionsP1,
    actionsP2,
    topAction: actionsP0[0] ?? actionsP1[0] ?? actionsP2[0] ?? { text: "Sem ações priorizadas" },
  };
}

/**
 * Aplica a política também a snapshots legados. Assim agosto é corrigido na
 * leitura sem regravar o registro histórico nem alterar sua data de geração.
 */
export function applySnapshotComparisonPolicy(snapshot: AnalyticsSnapshot): AnalyticsSnapshot {
  const comparability = comparisonAvailability(snapshot.context);
  const indexationSafeContext = withoutExcludedIndexation(snapshot.context);
  const context = comparability.ga4MoM
    ? indexationSafeContext
    : withoutGa4Deltas(indexationSafeContext);
  return {
    ...snapshot,
    context: { ...context, comparability },
  };
}
