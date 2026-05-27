/**
 * Bridge between the Maturity assessment and the Architecture builder.
 *
 * The Architecture builder normally asks the user two questions that we can
 * derive automatically from the maturity quiz:
 *   - `concerns[]` (which attacks they fear most)  — derived from their tier
 *   - `maturity` (self-rated nascent/developing/mature) — derived from score
 *
 * That way the user fills one combined questionnaire, but both engines run.
 */

import type { Tier } from '../types';
import type { Concern, Maturity } from '../architecture/lib/types';

/** Translate maturity tier → 3 or 4 architecture-side concerns. */
export function tierToConcerns(tier: Tier): Concern[] {
  switch (tier) {
    case 'Basic':
      // Most exposed — broad attack surface, "lowest-friction" attacks dominate
      return ['phishing_email', 'ransomware', 'ddos', 'data_exfiltration'];
    case 'Developing':
      // Building blocks in place — sophisticated attackers + insider/cloud gaps
      return ['ransomware', 'cloud_misconfig', 'insider_threat', 'phishing_email'];
    case 'Established':
      // Solid baseline — focus shifts to insider abuse, cloud drift, supply chain
      return ['cloud_misconfig', 'insider_threat', 'third_party_risk'];
    case 'Advanced':
      // Top decile — supply chain, OT/IoT, sophisticated cloud attacks
      return ['third_party_risk', 'cloud_misconfig', 'ot_iot_exposure'];
  }
}

/** Translate maturity tier → architecture's 3-level self-rated maturity. */
export function tierToArchitectureMaturity(tier: Tier): Maturity {
  if (tier === 'Basic')       return 'nascent';
  if (tier === 'Developing')  return 'developing';
  return 'mature'; // Established and Advanced both map to "mature"
}
