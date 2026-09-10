import comparisonBreaks from './comparison-breaks.json' with { type: 'json' };

const DEFAULT_COMPARABILITY = Object.freeze({ ga4MoM: true, gscMoM: true });

export function comparisonPolicyFor(monthSlug, explicitPolicy) {
  const centralPolicy = comparisonBreaks[monthSlug];
  if (centralPolicy) {
    // A regra central é autoritativa inclusive para snapshots já gravados com
    // comparabilidade incorreta. Campos novos ainda podem vir do snapshot.
    return { ...DEFAULT_COMPARABILITY, ...(explicitPolicy ?? {}), ...centralPolicy };
  }
  return explicitPolicy ?? DEFAULT_COMPARABILITY;
}
