/** Canonical industry IDs, aligned with architecture/data/capabilities.json */
export type IndustryId =
  | 'bfsi'
  | 'manufacturing_ot'
  | 'healthcare'
  | 'it_ites'
  | 'retail_ecomm'
  | 'govt_psu';

export type Environment = 'on_prem' | 'hybrid' | 'multi_cloud';
export type OrgSize = 'small' | 'mid' | 'large' | 'xlarge';

export interface Industry {
  id: IndustryId;
  label: string;
  sub: string;
  icon: string;
}

export interface Term {
  term: string;
  def: string;
}

export interface QuestionOption {
  t: string;
  sub: string;
  /** Plain-English alternative for the sub-text. Optional — falls back to `sub`. */
  plainSub?: string;
  /** Score 1..4 — used for scoring & normalised to 0..100. */
  s: 1 | 2 | 3 | 4;
  /** Marks the "I'm not aware" type option — rendered with softer styling. */
  isUnsure?: boolean;
}

export interface Question {
  domain: Domain;
  q: string;
  terms?: Term[];
  opts: QuestionOption[];
}

export type Domain =
  | 'Identity & Access'
  | 'Network Security'
  | 'Detection & Response'
  | 'Governance & Compliance'
  | 'Workforce Security'
  | 'Workload Security'
  | 'AI Technology';

export type Tier = 'Basic' | 'Developing' | 'Established' | 'Advanced';
export type ResultsView = 'business' | 'technical';

export interface DomainScore {
  name: Domain;
  pct: number;
}

export interface StackInfo {
  title: string;
  desc: string;
  /** Optional — if omitted, the card renders as non-clickable text with no "Explore" link. */
  href?: string;
}

export interface ThreatInfo {
  icon: string;
  name: string;
  desc: string;
}

export interface TierCopy {
  title: string;
  body: string;
  primary: string;
}
