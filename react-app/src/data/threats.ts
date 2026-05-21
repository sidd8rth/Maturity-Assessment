import type { Tier, ThreatInfo } from '../types';

export const TIER_THREATS: Record<Tier, ThreatInfo[]> = {
  Basic: [
    { icon: '🎣', name: 'Phishing & credential theft',     desc: 'Without MFA and email controls, a single convincing email can hand attackers full access to internal systems.' },
    { icon: '💰', name: 'Ransomware',                      desc: 'Weak endpoint and backup posture makes you a prime target. Average ransom demand in India now exceeds ₹3 crore.' },
    { icon: '🌊', name: 'DDoS attacks',                    desc: 'Without scrubbing infrastructure, even a low-cost volumetric attack can take your public services offline for hours.' },
    { icon: '🔓', name: 'Undetected data exfiltration',    desc: "Sensitive customer or financial data can be quietly copied and sold — with no alerting in place you may not find out for months." },
  ],
  Developing: [
    { icon: '🎯', name: 'Targeted ransomware',             desc: 'Organised groups like LockBit scout for partially-secured orgs and deploy tailored attacks that bypass standard AV.' },
    { icon: '☁️', name: 'Cloud misconfiguration exploits', desc: 'Exposed S3 buckets and over-permissioned IAM roles are scanned and exploited within hours of appearing online.' },
    { icon: '👤', name: 'Insider threats & account takeover', desc: 'Without PAM and behaviour analytics, compromised accounts — or malicious insiders — can move freely once inside.' },
    { icon: '📧', name: 'Business email compromise',       desc: 'Attackers impersonate executives to approve fraudulent transfers. BEC caused over $2.9 billion in global losses last year.' },
  ],
  Established: [
    { icon: '🕵️', name: 'Advanced persistent threats (APT)', desc: 'Sophisticated groups may target your org over months using low-and-slow techniques that evade standard detection rules.' },
    { icon: '🤖', name: 'AI-assisted attack automation',   desc: 'Adversaries now use AI to craft convincing spear-phishing, generate malware variants, and auto-scan your stack for gaps.' },
    { icon: '🔗', name: 'Supply chain compromise',         desc: 'Your direct controls are strong — third-party software and vendors in your ecosystem are now the more likely entry point.' },
  ],
  Advanced: [
    { icon: '🔬', name: 'Zero-day exploitation',           desc: 'At your maturity, targeted zero-days against your specific tech stack are the most realistic high-impact threat scenario.' },
    { icon: '🌐', name: 'Third-party & supply chain risk', desc: 'Your own environment is hardened — focus shifts to vendors, SaaS tools, and open-source dependencies in your chain.' },
    { icon: '🤖', name: 'AI-powered adversarial attacks',  desc: 'Automated red-teaming and continuous threat modelling are needed to stay ahead of AI-assisted attack speed.' },
  ],
};
