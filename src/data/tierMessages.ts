import type { Tier, TierCopy, ResultsView } from '../types';

export const TIER_MESSAGES: Record<Tier, Record<ResultsView, string>> = {
  Basic: {
    business:  "You're wide open. The controls every attacker assumes are in place aren't, or they're scattered across teams that don't talk. One phishing click ends in days of downtime, a DPDPA disclosure, and a board call you don't want to take. The good news: at this stage, 90 days of focused work moves the needle further than two years of incremental fixes ever will.",
    technical: "Multiple domains either have no controls or fragmented ones. Attack surface is wide. MTTD is effectively unknown. Priority order: identity (MFA, then ZTNA), endpoint EDR, then 24x7 monitoring. Everything else can wait.",
  },
  Developing: {
    business:  "You've got the foundations. Where it falls apart is during a real incident: a targeted ransomware run or a compromised executive account, and suddenly the tools you own can't keep up with each other. The cheapest meaningful move from here is consolidating what you already have under a 24x7 SOC. Same tools, faster response, no new headcount.",
    technical: "You have the tooling. You're not getting full value from it. SIEM signal-to-noise is poor, response times are inconsistent, and cloud posture drifts between scans. High-leverage moves: consolidate the SIEM/SOAR stack, engage an MDR to flatten triage time, and tighten identity governance.",
  },
  Established: {
    business:  "You're ahead of most Indian enterprises. The work now isn't adding more controls, it's cutting response time. AI-assisted triage, zero-trust applied beyond just identity, managed services priced on outcomes instead of seats. The goal is incidents that end in minutes, not hours.",
    technical: "Baseline is solid across core domains. Marginal gains come from advanced detection (XDR or MDR with AI triage), continuous adversarial validation via a red team retainer, and extending zero-trust past identity into workloads and APIs.",
  },
  Advanced: {
    business:  "Top decile. Routine attacks aren't really your problem anymore. What should concern you is nation-state targeting, supply chain compromise, and AI-augmented adversaries operating at machine speed. The move now is proving your defences actually survive sustained pressure, not stacking more of them.",
    technical: "Top-decile maturity. Threat model now centres on APTs, targeted zero-days against your specific stack, and supply chain. Where to invest: continuous adversarial validation, AI/ML threat modelling, and OT/IoT visibility if your sector has it.",
  },
};

export const TIER_CTA: Record<Tier, TierCopy> = {
  Basic: {
    title:   "You're one bad email away from a board-level incident.",
    body:    "A 30-min session with an Airtel Secure architect. We'll prioritise the 2 or 3 controls that shut the loudest doors in your first 90 days, with a commercial range inside 3 business days.",
    primary: 'Talk to an expert →',
  },
  Developing: {
    title:   "You're on track. Now compress the timeline.",
    body:    "A 30-min session with our practice team. We'll turn this score into a concrete blueprint with SLA targets and a commercial range within 3 business days.",
    primary: 'Talk to an expert →',
  },
  Established: {
    title:   "You've earned the right to think bigger.",
    body:    "A 45-min strategy review with our practice lead. We'll work through what your next investment should be (managed services, zero-trust at scale, or AI-assisted detection) and what it costs.",
    primary: 'Talk to an expert →',
  },
  Advanced: {
    title:   "You don't need basics. You need a strategic resilience review.",
    body:    'A peer-level conversation with senior Airtel Secure practitioners. Adversary emulation, supply chain risk, AI security, or resilience engineering, wherever your real exposure now sits.',
    primary: 'Book a CISO advisory call →',
  },
};
