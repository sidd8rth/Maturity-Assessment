export type IndustryId = 'bfsi' | 'health' | 'psu' | 'mfg' | 'it' | 'other';

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
  | 'Network & Perimeter'
  | 'Detection & Response'
  | 'Governance & Compliance'
  | 'Endpoint & Workforce'
  | 'Data & Cloud'
  | 'AI & Emerging';

export type Tier = 'Basic' | 'Developing' | 'Established' | 'Advanced';
export type ResultsView = 'business' | 'technical';

export interface DomainScore {
  name: Domain;
  pct: number;
}

export interface StackInfo {
  title: string;
  desc: string;
  href: string;
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
