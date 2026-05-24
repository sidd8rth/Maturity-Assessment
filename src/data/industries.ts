import type { Industry } from '../types';

export const INDUSTRIES: Industry[] = [
  { id: 'bfsi',   label: 'BFSI',               sub: 'Banking, Financial Services & Insurance',     icon: '🏦' },
  { id: 'health', label: 'Healthcare',         sub: 'Hospitals, pharma, diagnostics',              icon: '🏥' },
  { id: 'psu',    label: 'PSU / Government',   sub: 'Public sector undertakings & govt bodies',    icon: '🏛️' },
  { id: 'mfg',    label: 'Manufacturing',      sub: 'Factories, plants & supply chains',           icon: '🏭' },
  { id: 'it',     label: 'IT / ITeS',          sub: 'Tech companies, SaaS, BPO, IT services',      icon: '💻' },
  { id: 'other',  label: 'Other',              sub: 'Retail, logistics, education & more',         icon: '🏢' },
];
