import type { Tier, TierCopy, ResultsView } from '../types';

export const TIER_MESSAGES: Record<Tier, Record<ResultsView, string>> = {
  Basic: {
    business:  "You're highly exposed. The basic protections most attackers expect are missing or fragmented — even a routine ransomware or phishing attack could cause significant downtime, customer impact, and regulatory fallout. The good news: this is where Airtel Secure delivers the fastest, most visible improvement.",
    technical: 'Foundational controls are missing or fragmented across multiple domains. Attack surface is wide; detection coverage is minimal. Priority: identity layer (MFA + ZTNA), endpoint EDR, and a managed SOC for round-the-clock monitoring before adding anything else.',
  },
  Developing: {
    business:  'You have building blocks in place, but real gaps remain. A targeted ransomware attempt or insider misuse could still cause days of downtime and meaningful financial cost. Consolidation under a managed SOC will dramatically reduce risk — without adding headcount or new tools.',
    technical: 'Tooling exists across most domains but is fragmented and underutilised. SIEM signal-to-noise is poor, response times are inconsistent, and cloud posture has visible gaps. Focus: tool consolidation, MDR engagement, and tightening identity governance.',
  },
  Established: {
    business:  "You're better protected than most Indian enterprises. The next leap is moving from reactive to predictive — AI-assisted detection, zero-trust at scale, and outcome-based managed services that compress incident response from hours to minutes.",
    technical: 'Solid baseline across core domains. Marginal gains now come from advanced detection (XDR/MDR with AI triage), continuous validation (red team retainer), and full zero-trust beyond just the identity layer.',
  },
  Advanced: {
    business:  "You're operating in the top decile. Most threats targeting Indian organisations are no longer your primary risk — focus shifts to nation-state actors, AI-powered attacks, and your supply chain. Resilience engineering and continuous red-teaming matter more than adding controls.",
    technical: 'Top-decile maturity. Threat model shifts to APTs, zero-day exploitation, and supply chain risk. Investment areas: continuous adversarial validation, AI/ML threat modelling, and OT/IoT visibility where relevant.',
  },
};

export const TIER_CTA: Record<Tier, TierCopy> = {
  Basic: {
    title:   "Your foundation is exposed. Let's fix that fast.",
    body:    "A 30-min session with an Airtel Secure architect. We'll prioritise the 2–3 controls that close the most risk in 90 days, with commercial range within 3 business days.",
    primary: 'Talk to an expert →',
  },
  Developing: {
    title:   "You're on track. Now compress the timeline.",
    body:    "A 30-min session with our practice team. We'll turn this score into a concrete blueprint with SLA targets and commercial range within 3 business days.",
    primary: 'Talk to an expert →',
  },
  Established: {
    title:   "You've earned the right to think bigger.",
    body:    "A 45-min strategy review with our practice lead. We'll map your next leap — managed services, zero-trust at scale, or AI-assisted detection — to commercial outcomes.",
    primary: 'Talk to an expert →',
  },
  Advanced: {
    title:   "You don't need basics. You need a strategic resilience review.",
    body:    'A peer-level conversation with senior Airtel Secure practitioners. Adversary emulation, supply chain risk, AI security, or resilience engineering — wherever your real exposure now sits.',
    primary: 'Book a CISO advisory call →',
  },
};
