import comparisonBreaks from './comparison-breaks.json' with { type: 'json' };

const DEFAULT_COMPARABILITY = Object.freeze({ ga4MoM: true, gscMoM: true });

export function comparisonPolicyFor(monthSlug, explicitPolicy) {
  const centralPolicy = comparisonBreaks[monthSlug];
  if (centralPolicy) {
    // `false` sempre vence: a regra central corrige snapshots antigos que
    // diziam `true`, enquanto uma falha de baseline registrada no snapshot
    // também não pode ser reativada por um `true` central.
    return {
      ...DEFAULT_COMPARABILITY,
      ...(explicitPolicy ?? {}),
      ...centralPolicy,
      ga4MoM: centralPolicy.ga4MoM !== false && explicitPolicy?.ga4MoM !== false,
      gscMoM: centralPolicy.gscMoM !== false && explicitPolicy?.gscMoM !== false,
      reason: explicitPolicy?.reason ?? centralPolicy.reason,
    };
  }
  return explicitPolicy ?? DEFAULT_COMPARABILITY;
}
