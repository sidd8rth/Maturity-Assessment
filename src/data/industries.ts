import type { Industry } from '../types';

/**
 * Canonical industry set, aligned with architecture/data so the same ID
 * drives both the maturity weighting and the architecture diagram.
 */
export const INDUSTRIES: Industry[] = [
  { id: 'bfsi',             label: 'BFSI',               sub: 'Banking, Financial Services & Insurance', icon: '🏦' },
  { id: 'healthcare',       label: 'Healthcare',         sub: 'Hospitals, pharma, diagnostics',          icon: '🏥' },
  { id: 'govt_psu',         label: 'PSU / Government',   sub: 'Public sector & government bodies',       icon: '🏛️' },
  { id: 'manufacturing_ot', label: 'Manufacturing',      sub: 'Factories, plants & supply chains',       icon: '🏭' },
  { id: 'it_ites',          label: 'IT / ITeS',          sub: 'Tech companies, SaaS, BPO, IT services',  icon: '💻' },
  { id: 'retail_ecomm',     label: 'Retail & eCommerce', sub: 'Stores, eCommerce, logistics',            icon: '🛍️' },
];
