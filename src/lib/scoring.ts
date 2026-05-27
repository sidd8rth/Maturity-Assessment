import type { Domain, DomainScore, IndustryId, Tier } from '../types';
import { QUESTIONS } from '../data/questions';
import { WEIGHTS } from '../data/weights';

/**
 * Computes per-domain percentages and overall weighted score from raw answers.
 * @param answers - array of selected option indices (or null), parallel to QUESTIONS.
 * @param industry - selected industry id, defaults to 'other'.
 */
export function computeScores(
  answers: (number | null)[],
  industry: IndustryId,
): { domainScores: DomainScore[]; overall: number; tier: Tier } {
  const weights = WEIGHTS[industry] ?? WEIGHTS.it_ites;

  // Aggregate raw scores per domain
  const raw: Partial<Record<Domain, { total: number; count: number }>> = {};
  QUESTIONS.forEach((q, i) => {
    const idx = answers[i];
    if (idx === null || idx === undefined) return;
    const opt = q.opts[idx];
    if (!opt) return;
    const bucket = raw[q.domain] ?? { total: 0, count: 0 };
    bucket.total += opt.s;
    bucket.count += 1;
    raw[q.domain] = bucket;
  });

  // Normalise each domain to 0..100
  const domainScores: DomainScore[] = (Object.entries(raw) as [Domain, { total: number; count: number }][])
    .map(([name, v]) => ({
      name,
      pct: Math.round(((v.total / v.count) - 1) / 3 * 100),
    }));

  // Weighted overall
  let overall = 0;
  domainScores.forEach(d => { overall += d.pct * (weights[d.name] ?? 0); });
  overall = Math.round(overall);

  // Tier
  let tier: Tier;
  if (overall < 35)      tier = 'Basic';
  else if (overall < 60) tier = 'Developing';
  else if (overall < 80) tier = 'Established';
  else                   tier = 'Advanced';

  return { domainScores, overall, tier };
}
