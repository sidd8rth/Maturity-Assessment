import type { Domain, IndustryId } from '../types';

export const WEIGHTS: Record<IndustryId, Record<Domain, number>> = {
  bfsi:   { 'Governance & Compliance': 0.25, 'Identity & Access': 0.20, 'Network Security': 0.10, 'Detection & Response': 0.15, 'Workforce Security': 0.05, 'Workload Security': 0.20, 'AI Technology': 0.05 },
  health: { 'Governance & Compliance': 0.20, 'Identity & Access': 0.15, 'Network Security': 0.10, 'Detection & Response': 0.15, 'Workforce Security': 0.10, 'Workload Security': 0.25, 'AI Technology': 0.05 },
  psu:    { 'Governance & Compliance': 0.25, 'Identity & Access': 0.15, 'Network Security': 0.20, 'Detection & Response': 0.20, 'Workforce Security': 0.05, 'Workload Security': 0.10, 'AI Technology': 0.05 },
  mfg:    { 'Governance & Compliance': 0.15, 'Identity & Access': 0.10, 'Network Security': 0.25, 'Detection & Response': 0.20, 'Workforce Security': 0.15, 'Workload Security': 0.10, 'AI Technology': 0.05 },
  it:     { 'Governance & Compliance': 0.10, 'Identity & Access': 0.20, 'Network Security': 0.10, 'Detection & Response': 0.15, 'Workforce Security': 0.10, 'Workload Security': 0.25, 'AI Technology': 0.10 },
  other:  { 'Governance & Compliance': 0.15, 'Identity & Access': 0.15, 'Network Security': 0.15, 'Detection & Response': 0.15, 'Workforce Security': 0.13, 'Workload Security': 0.15, 'AI Technology': 0.12 },
};

export const DOMAIN_COLORS: Record<Domain, string> = {
  'Identity & Access':       'linear-gradient(90deg,#d40000,#ff6060)',
  'Network Security':     'linear-gradient(90deg,#ff8c00,#ffb84d)',
  'Detection & Response':    'linear-gradient(90deg,#06b6d4,#67e8f9)',
  'Governance & Compliance': 'linear-gradient(90deg,#8b5cf6,#c4b5fd)',
  'Workforce Security':    'linear-gradient(90deg,#2ecc71,#6ee8a6)',
  'Workload Security':            'linear-gradient(90deg,#ec4899,#f9a8d4)',
  'AI Technology':           'linear-gradient(90deg,#f59e0b,#fde68a)',
};
