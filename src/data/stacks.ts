import type { Domain, IndustryId, StackInfo } from '../types';

export type StackKey =
  | 'Secure Workforce'
  | 'Network Security'
  | 'Secure Workload'
  | 'Managed Services'
  | 'Professional Services'
  | 'Red Team Retainer'
  | 'Supply Chain Risk'
  | 'AI Security'
  | 'Cyber Resilience'
  | 'Threat Intelligence'
  | 'CISO Advisory';

export const STACK_COPY: Record<StackKey, StackInfo> = {
  'Secure Workforce':     { title: 'Secure Workforce',     desc: "Your identity and endpoint posture is your biggest exposure. ZTNA, PAM, EDR and managed XDR, delivered as a service from Airtel's iSOC.", href: 'https://www.airtel.in/b2b/secure-workforce' },
  'Network Security':     { title: 'Network Security',     desc: "Your perimeter has gaps a threat actor can exploit. NGFW, India's largest DDoS scrubbing infrastructure, and SD-WAN security, built into the network layer.", href: 'https://www.airtel.in/b2b/network-security' },
  'Secure Workload':      { title: 'Secure Workload',      desc: "Your cloud and data posture needs attention. CNAPP, DSPM, CSPM and API protection, run by Airtel's cloud security pod.", href: 'https://www.airtel.in/b2b/secure-workload' },
  'Managed Services':     { title: 'Managed Services',     desc: "You need 24x7 eyes on glass, not just tools. Airtel's AI-assisted iSOC with CERT-In aligned playbooks, MDR and an IR retainer.", href: 'https://www.airtel.in/b2b/managed-services' },
  'Professional Services':{ title: 'Professional Services',desc: 'Before adding more tools, you need a structured foundation. VAPT, risk assessments, compliance gap analysis and a programme roadmap, done with you, not handed over.', href: 'https://www.airtel.in/b2b/professional-services' },

  'Red Team Retainer':    { title: 'Adversary Emulation & Red Team',    desc: "You don't need more controls, you need proof they hold under real attacker pressure. Continuous breach & attack simulation, assumed-breach exercises, and purple-team engagements run by Airtel's offensive security pod." },
  'Supply Chain Risk':    { title: 'Supply Chain & Third-Party Risk',   desc: "Your perimeter is hard. The next breach won't come through it, it will come through a vendor or dependency. Continuous third-party monitoring, SCRM tooling, and vendor security attestation programmes." },
  'AI Security':          { title: 'AI Security & Model Risk',          desc: 'If you ship AI in your products, you have a new attack surface few teams understand. Model integrity scanning, prompt-injection defence, AI-IAM, and runtime monitoring of the models themselves.' },
  'Cyber Resilience':     { title: 'Cyber Resilience Engineering',      desc: "Resilience isn't backups, it's recovering operations under coordinated attack. Ransomware-proof recovery architecture, chaos engineering for security, and regulatory crisis tabletops." },
  'Threat Intelligence':  { title: 'Threat Intelligence & Sector ISAC', desc: "Generic feeds aren't enough at your maturity. Proprietary intelligence, dark-web monitoring, and sector-specific ISAC participation tuned to the threat actors that actually target your industry." },
  'CISO Advisory':        { title: 'vCISO & Strategic Advisory',        desc: 'Where should the next ₹X crore go? Board-grade reporting, cyber insurance optimisation, regulatory engagement, and strategic security investment guidance from senior practitioners.' },
};

/** For tiers Basic/Developing/Established, picks driven by weakest weighted domain. */
export const DOMAIN_STACK: Record<Domain, { primary: StackKey; secondary: StackKey }> = {
  'Identity & Access':       { primary: 'Secure Workforce',      secondary: 'Managed Services' },
  'Workforce Security':    { primary: 'Secure Workforce',      secondary: 'Managed Services' },
  'Network Security':     { primary: 'Network Security',      secondary: 'Managed Services' },
  'Workload Security':            { primary: 'Secure Workload',       secondary: 'Managed Services' },
  'Detection & Response':    { primary: 'Managed Services',      secondary: 'Professional Services' },
  'Governance & Compliance': { primary: 'Professional Services', secondary: 'Managed Services' },
  'AI Technology':           { primary: 'Secure Workload',       secondary: 'Secure Workforce' },
};

/** For tier === Advanced: hand-picked per industry, not domain-gap driven. */
export const ADVANCED_PICKS: Record<IndustryId, StackKey[]> = {
  bfsi:   ['Red Team Retainer', 'Threat Intelligence', 'CISO Advisory'],
  health: ['Supply Chain Risk', 'Cyber Resilience',    'AI Security'],
  psu:    ['Threat Intelligence','Cyber Resilience',   'CISO Advisory'],
  mfg:    ['Cyber Resilience',   'Supply Chain Risk',  'Red Team Retainer'],
  it:     ['AI Security',        'Red Team Retainer',  'Supply Chain Risk'],
  other:  ['Red Team Retainer',  'Supply Chain Risk',  'CISO Advisory'],
};
