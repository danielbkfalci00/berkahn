import comparisonBreaks from './comparison-breaks.json' with { type: 'json' };

const DEFAULT_COMPARABILITY = Object.freeze({ ga4MoM: true, gscMoM: true });

export function comparisonPolicyFor(monthSlug, explicitPolicy) {
  return explicitPolicy ?? comparisonBreaks[monthSlug] ?? DEFAULT_COMPARABILITY;
}
