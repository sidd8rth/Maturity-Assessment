import type { Domain, DomainScore, IndustryId, Tier } from '../types';
import { ADVANCED_PICKS, DOMAIN_STACK, type StackKey } from '../data/stacks';
import { WEIGHTS } from '../data/weights';

/**
 * Returns top-3 Airtel Secure stack recommendations.
 * - Advanced tier: hand-picked per industry (resilience / advisory / red-team etc).
 * - Other tiers: weakest weighted domains → mapped to primary stacks, with PS override at score < 45.
 */
export function buildRecommendations(
  domainScores: DomainScore[],
  overall: number,
  industry: IndustryId,
  tier: Tier,
): StackKey[] {
  if (tier === 'Advanced') {
    return (ADVANCED_PICKS[industry] ?? ADVANCED_PICKS.other).slice(0, 3);
  }

  const weights = WEIGHTS[industry] ?? WEIGHTS.other;
  const weighted = domainScores
    .map(d => ({ name: d.name, weightedPct: d.pct * (weights[d.name as Domain] ?? 0) }))
    .sort((a, b) => a.weightedPct - b.weightedPct);

  const output: StackKey[] = [];
  const seen = new Set<StackKey>();

  for (const d of weighted) {
    if (output.length >= 3) break;
    const k = DOMAIN_STACK[d.name as Domain]?.primary;
    if (k && !seen.has(k)) { output.push(k); seen.add(k); }
  }

  // PS override at very low scores
  if (overall < 45 && !seen.has('Professional Services')) {
    if (output.length >= 3) output[2] = 'Professional Services';
    else output.push('Professional Services');
    seen.add('Professional Services');
  }

  // Fallback to secondaries
  if (output.length < 3) {
    for (const d of weighted) {
      if (output.length >= 3) break;
      const k = DOMAIN_STACK[d.name as Domain]?.secondary;
      if (k && !seen.has(k)) { output.push(k); seen.add(k); }
    }
  }

  return output.slice(0, 3);
}
