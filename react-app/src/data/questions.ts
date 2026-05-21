import type { Question } from '../types';

export const QUESTIONS: Question[] = [
  {
    domain: 'Identity & Access',
    q: 'How do your employees access internal and cloud applications remotely?',
    terms: [
      { term: 'ZTNA', def: 'Zero Trust Network Access — grants per-app access based on who you are and your device health, rather than a blanket VPN tunnel. Much harder for attackers to exploit.' },
      { term: 'VPN',  def: 'Virtual Private Network — creates an encrypted tunnel to your network. Gives broad network access once connected, which is the risk.' },
    ],
    opts: [
      { t: 'VPN only',                                                  sub: 'Everyone connects through a fixed tunnel back to your datacenter, regardless of what app they\'re opening',                  plainSub: 'If an attacker steals one employee\'s password, they reach your whole internal network — like one master key opening every door in the office.', s: 1 },
      { t: 'VPN + MFA',                                                 sub: 'Same tunnel, but with an OTP or authenticator app layered on top',                                                          plainSub: 'Better — but attackers still trick employees into approving OTP codes (and modern phishing kits automate this).', s: 2 },
      { t: 'ZTNA for critical apps (Zscaler, Netskope, Prisma Access)', sub: 'Access is granted per app based on who you are and your device health — not a blanket network tunnel',                     plainSub: 'Each critical app verifies who you are before opening. Even if a password is stolen, damage is limited to specific apps.', s: 3 },
      { t: 'Full ZTNA — no VPN dependency',                             sub: 'Every app is identity-gated and session-inspected. Network-level trust doesn\'t exist',                                     plainSub: 'Stolen credentials are almost useless to attackers — they can only see what that one user was allowed to see, nothing more.', s: 4 },
    ],
  },
  {
    domain: 'Identity & Access',
    q: 'How do you manage admin and privileged accounts?',
    terms: [
      { term: 'PAM',       def: 'Privileged Access Management — tools like CyberArk or BeyondTrust that vault admin credentials, record sessions, and enforce least-privilege access.' },
      { term: 'AD / LDAP', def: 'Active Directory / Lightweight Directory Access Protocol — Microsoft\'s systems for managing user accounts, groups, and access policies across your org.' },
    ],
    opts: [
      { t: 'Shared credentials or static passwords',              sub: 'Multiple people use the same login for critical systems',                                plainSub: 'When something goes wrong, there\'s no way to know who did what. Everyone with the password is a suspect.', s: 1 },
      { t: 'Individual accounts + basic AD/LDAP controls',        sub: 'Everyone has their own login but access reviews are manual and infrequent',              plainSub: 'People have their own logins, but stale accounts and old privileges pile up. A former employee\'s account could still be active.', s: 2 },
      { t: 'Dedicated PAM tool (CyberArk, BeyondTrust, Delinea)', sub: 'Privileged sessions are vaulted, recorded, and access is role-controlled',               plainSub: 'Admin access is locked away and recorded. Every privileged action is logged — full audit trail when something goes wrong.', s: 3 },
      { t: 'Just-in-time access + zero standing privilege',       sub: 'Admin rights are granted only when needed, auto-expire, and every session is audited',  plainSub: 'Nobody has standing admin rights. Access is granted briefly when needed and revoked automatically — minimising the attack window.', s: 4 },
    ],
  },
  {
    domain: 'Network & Perimeter',
    q: "What's your current firewall setup?",
    terms: [
      { term: 'NGFW',               def: 'Next-Generation Firewall — inspects application content (not just ports/IPs), has built-in IPS, and identifies apps. Brands: Palo Alto, Fortinet, Check Point.' },
      { term: 'IDS / IPS',          def: 'Intrusion Detection / Prevention System — monitors traffic for known attack patterns. IDS alerts; IPS actively blocks.' },
      { term: 'Micro-segmentation', def: 'Divides the internal network into small isolated zones so a compromise in one area cannot spread laterally across your whole environment.' },
    ],
    opts: [
      { t: 'No dedicated firewall — relying on ISP or router defaults',                sub: 'No enterprise firewall in place; traffic flows with minimal inspection',                       plainSub: 'Anyone on the internet can directly probe your network for ways in. The bare minimum protection is missing.', s: 1 },
      { t: 'Legacy or basic stateful firewall (older Cisco ASA, basic appliances)',    sub: "Filters by port and IP — doesn't inspect what's inside the packet",                            plainSub: "You block obvious bad traffic, but can't see what attackers are actually sending — modern attacks slip through.", s: 1 },
      { t: 'Next-gen firewall (Fortinet, Palo Alto, Check Point)',                     sub: 'Inspects application layer, has IPS, and can see what apps are being used',                    plainSub: 'Your firewall recognises which apps and websites staff use, so it can block risky ones (file-sharing, unknown chat apps).', s: 2 },
      { t: 'NGFW + active threat feeds + IDS/IPS tuned to your environment',           sub: 'Firewall is updated with live threat intelligence and tuned beyond factory defaults',         plainSub: 'Your firewall is updated daily with known-bad addresses worldwide, so it blocks attackers seen elsewhere before they hit you.', s: 3 },
      { t: 'NGFW + micro-segmentation + east-west traffic inspection',                 sub: 'Even traffic moving inside your network is inspected — not just what comes in from outside',   plainSub: "Even if attackers get into one server, they can't move sideways to your databases, finance system, or other critical assets.", s: 4 },
    ],
  },
  {
    domain: 'Network & Perimeter',
    q: 'What happens if a volumetric DDoS attack hits your public-facing apps?',
    terms: [
      { term: 'DDoS',      def: 'Distributed Denial of Service — attackers send massive volumes of fake traffic from thousands of machines to take your services offline for real users.' },
      { term: 'Scrubbing', def: 'Attack traffic is diverted to a specialist cleaning centre (Cloudflare, Akamai, Airtel backbone) that filters bad traffic before it reaches you.' },
    ],
    opts: [
      { t: "We'd find out when customers complain",                  sub: 'No dedicated DDoS protection in place',                                                       plainSub: 'Your website or apps could be taken offline for hours. The cost: lost sales, support overload, and brand damage.', s: 1 },
      { t: 'Basic ISP or firewall-level protection',                 sub: 'Handles small spikes but anything above a few Gbps would cause downtime',                     plainSub: "Small attacks won't take you down, but a serious one will overwhelm you and require manual intervention.", s: 2 },
      { t: 'Cloud-based scrubbing (Cloudflare, Akamai, AWS Shield)', sub: 'Traffic is rerouted to a scrubbing centre in the cloud before reaching you',                  plainSub: "Most attacks are absorbed before reaching you. Customers won't notice during all but the largest incidents.", s: 3 },
      { t: 'Backbone-level inline scrubbing',                        sub: 'Attack traffic is filtered at the network level before it ever reaches your infrastructure', plainSub: 'Attacks are stopped at the network level — even massive ones rarely cause customer-visible disruption.', s: 4 },
      { t: "I'm not sure what DDoS protection we have in place",     sub: 'Worth finding out — unprotected services can be taken down by even low-cost attacks',         plainSub: 'Worth checking — a single attack can cost lakhs in lost transactions and erode customer trust.', s: 1, isUnsure: true },
    ],
  },
  {
    domain: 'Detection & Response',
    q: "What's your threat monitoring and detection setup?",
    terms: [
      { term: 'SIEM', def: 'Security Information & Event Management — aggregates logs from all systems into one place to detect threats. Examples: Splunk, QRadar, ArcSight.' },
      { term: 'SOAR', def: 'Security Orchestration, Automation & Response — automatically triggers response playbooks (isolate device, block IP) when alerts fire, cutting response time.' },
      { term: 'MDR',  def: 'Managed Detection & Response — an outsourced 24x7 security team with AI tooling that monitors, triages, and contains threats on your behalf.' },
    ],
    opts: [
      { t: 'No centralised logging or SIEM',                            sub: "Logs exist on individual systems but nobody's watching them in one place",                                                   plainSub: "If an attacker gets in, you may not notice for weeks or months. By then they've stolen data, deployed ransomware, or damaged systems.", s: 1 },
      { t: 'Basic SIEM with standard rules (Splunk, QRadar, ArcSight)', sub: 'Logs are aggregated but alerts are mostly noise — high false positive rate',                                                plainSub: 'You collect data centrally, but real threats hide in noise. Genuine attacks may be missed; analysts burn out chasing false alarms.', s: 2 },
      { t: 'SIEM + SOAR with defined playbooks',                        sub: 'Alerts trigger automated responses, and your team has documented runbooks per scenario',                                    plainSub: 'When something suspicious happens, your team has clear playbooks and automated steps. Response is consistent, not heroic.', s: 3 },
      { t: 'Managed SOC with AI-assisted triage (24x7, MDR)',           sub: 'A dedicated team monitors, triages, and contains — with machine-assisted detection cutting MTTD to minutes',               plainSub: "An expert team watches 24x7. If something starts at 2am, they're already responding before you wake up.", s: 4 },
      { t: "I'm not sure what monitoring tools we use",                 sub: 'No clear visibility into current detection setup — a common gap worth addressing first',                                   plainSub: "If your team can't describe what's monitored, treat it as a gap. Most breaches go undetected for weeks in mid-sized organisations.", s: 1, isUnsure: true },
    ],
  },
  {
    domain: 'Detection & Response',
    q: 'If a breach happened at 2am, how would the first 30 minutes go?',
    terms: [
      { term: 'MSSP',        def: 'Managed Security Service Provider — an external company running your security monitoring and operations.' },
      { term: 'IR retainer', def: 'Incident Response retainer — a pre-paid contract with a forensics firm (e.g. Mandiant, CrowdStrike Services) so they can respond within hours of a breach.' },
    ],
    opts: [
      { t: "Honestly, we'd probably find out hours later",                sub: 'No on-call rotation, no automated alerting',                                                                          plainSub: 'By the time someone notices in the morning, the attacker has been free in your systems for 8+ hours — long enough to steal data and deploy ransomware.', s: 1 },
      { t: 'Someone gets paged and starts investigating manually',        sub: 'On-call exists but response depends on the individual',                                                               plainSub: 'Response speed depends on who is on call. Some nights contain in 30 min, others take hours — it\'s inconsistent.', s: 2 },
      { t: 'SOC or MSSP triages within 15 minutes, runbook invoked',      sub: 'Defined process kicks in automatically — roles, escalation path, and IR steps are pre-documented',                  plainSub: 'Within minutes of a breach starting, a trained team is investigating using documented playbooks. Predictable response every time.', s: 3 },
      { t: 'Managed SOC contains within 15 min, IR retainer auto-engaged',sub: 'Containment is automated, external IR firm is on retainer, legal and comms notified per playbook',                  plainSub: 'Within 15 minutes you have an expert team containing the breach, a forensics firm engaged, and legal/comms teams notified — everything pre-arranged.', s: 4 },
    ],
  },
  {
    domain: 'Governance & Compliance',
    q: 'How are you tracking compliance with Indian regulations? (DPDP Act, RBI, SEBI, IRDAI, CERT-In 6-hour reporting)',
    terms: [
      { term: 'DPDP Act',     def: "Digital Personal Data Protection Act (2023) — India's new privacy law mandating data handling rules and breach notification obligations for all organisations processing Indian personal data." },
      { term: 'CERT-In 6hr',  def: "India's CERT-In requires organisations to report cyber incidents to the government within 6 hours of becoming aware. Non-compliance carries penalties." },
      { term: 'GRC',          def: 'Governance, Risk & Compliance — software platforms (ServiceNow GRC, MetricStream, Archer) that map controls to regulations and automate evidence collection for audits.' },
    ],
    opts: [
      { t: 'We rely on legal or audit to flag issues',                                       sub: 'No proactive tracking — compliance is reactive',                                                                                  plainSub: "You'll find out about a compliance gap when a regulator does — at which point fines, public disclosure, and remediation costs are inevitable.", s: 1 },
      { t: 'Spreadsheet owned by one team, updated ad hoc',                                  sub: 'Manual tracking, usually outdated, siloed from the security team',                                                                plainSub: "You're tracking compliance, but evidence is scattered. A real audit would expose the gaps quickly.", s: 2 },
      { t: 'GRC tool with mapped controls, reviewed quarterly',                              sub: 'Controls are documented and linked to regulations, but evidence collection is still manual',                                    plainSub: 'Audit prep is manageable; you can show evidence on demand. Some manual evidence collection still required.', s: 3 },
      { t: 'Continuous compliance monitoring — auto-mapped controls, real-time dashboard',   sub: 'Evidence is collected automatically, board-level reporting is live, audit prep takes days not weeks',                          plainSub: 'Compliance is always audit-ready. The board can see status anytime; regulators get clean responses.', s: 4 },
      { t: "I'm not sure how we track regulatory compliance",                                sub: "No clear ownership of compliance I'm aware of — risky given DPDP Act and CERT-In obligations",                                 plainSub: 'If nobody can describe how compliance is tracked, the next audit (or DPDP/CERT-In incident) is a serious risk.', s: 1, isUnsure: true },
    ],
  },
  {
    domain: 'Governance & Compliance',
    q: 'How often do you run security audits or VAPT?',
    terms: [
      { term: 'VAPT',      def: 'Vulnerability Assessment & Penetration Testing — expert-led testing that finds weaknesses in your systems before attackers do. Mandatory for many regulated sectors in India.' },
      { term: 'Red team',  def: 'A dedicated adversarial exercise where ethical hackers try to breach your environment using the same techniques real attackers use — more realistic than standard VAPT.' },
    ],
    opts: [
      { t: 'Never, or only after an incident',                                              sub: 'Testing is not planned — it happens when something goes wrong',                              plainSub: 'You only learn about weaknesses by being attacked. Each finding costs you a real incident first.', s: 1 },
      { t: 'Annual audit, mostly compliance-driven',                                        sub: "You do it because a regulator or client asks, not proactively",                              plainSub: 'Once a year you check for issues — but attackers find new ways in every week. You\'re months behind, on average.', s: 2 },
      { t: 'Bi-annual VAPT + periodic red team exercises',                                  sub: 'Structured testing cadence with a third-party firm, findings tracked to closure',           plainSub: 'Every six months, experts try to break in and report what they found. You catch issues before attackers do.', s: 3 },
      { t: 'Continuous scanning + quarterly third-party audits + red team on retainer',     sub: 'Automated vulnerability scanning runs always, manual testing is frequent and adversarial',  plainSub: 'Your defences are constantly being tested by automated scans AND real experts. New weaknesses surface in days, not months.', s: 4 },
    ],
  },
  {
    domain: 'Endpoint & Workforce',
    q: "What's running on your endpoints — laptops, mobiles, workstations?",
    terms: [
      { term: 'EDR', def: 'Endpoint Detection & Response — records full device telemetry (processes, network connections, file changes) to detect and contain threats in real-time. Examples: CrowdStrike, SentinelOne.' },
      { term: 'XDR', def: 'Extended Detection & Response — unifies signals from endpoint, email, network, and cloud into one detection layer with automated response capability.' },
    ],
    opts: [
      { t: 'No dedicated endpoint security — bare OS',                                                  sub: 'Devices have no security software beyond what the OS shipped with',                       plainSub: 'Laptops and PCs are essentially open targets. A single phishing email click could install ransomware with nothing to stop it.', s: 1 },
      { t: 'Legacy AV only (Windows Defender basic, McAfee, Symantec AV)',                              sub: 'Signature-based detection — only catches known threats, misses novel attacks',           plainSub: 'Your antivirus catches old threats but misses anything new. Modern attacks are designed to slip past traditional AV.', s: 1 },
      { t: 'Next-gen AV with some behavioural detection',                                               sub: 'Better than legacy AV but no full telemetry or threat hunting capability',                plainSub: 'Better than basic antivirus, but if a threat does get past, you can\'t easily see what it did or contain it quickly.', s: 2 },
      { t: 'EDR deployed across most devices (CrowdStrike, SentinelOne, Defender for Endpoint)',       sub: 'Full telemetry, behavioural detection, and alert triage — but managed in-house',          plainSub: 'Every action on every laptop is recorded. If something bad happens, you can see exactly what, where, and when — and stop it fast.', s: 3 },
      { t: 'Managed XDR — unified across endpoint, email, network, and cloud',                          sub: 'Everything feeds into one detection layer, managed by a SOC with automated response',    plainSub: 'Threats are detected and contained across laptops, email, network, and cloud — all by an expert team watching around the clock.', s: 4 },
    ],
  },
  {
    domain: 'Data & Cloud',
    q: 'Do you know where your sensitive data lives? (PII, financial records, source code, PCI data)',
    terms: [
      { term: 'DSPM', def: 'Data Security Posture Management — discovers and classifies sensitive data across cloud storage, SaaS apps, and databases, then flags who has access and what\'s exposed.' },
      { term: 'CSPM', def: 'Cloud Security Posture Management — continuously scans your cloud environment (AWS, Azure, GCP) for misconfigurations like open S3 buckets or over-permissioned roles.' },
      { term: 'PII',  def: 'Personally Identifiable Information — any data that can identify a person (name, phone, Aadhaar, email). Subject to DPDP Act obligations in India.' },
    ],
    opts: [
      { t: "Not really — it's sprawled across systems and SaaS tools",                                                              sub: 'No formal data classification or discovery in place',                                                                            plainSub: "If a regulator asks where customer data is stored — or after a breach, what was leaked — you can't answer with confidence.", s: 1 },
      { t: "We've manually mapped 3–5 critical data stores",                                                                        sub: 'Key databases are known but SaaS and cloud data is largely untracked',                                                          plainSub: 'You know the obvious places, but data hidden in shared drives, SaaS tools, and old servers is still a major unknown.', s: 2 },
      { t: 'Data classification rolled out, DSPM/CSPM scans run regularly',                                                         sub: 'Data is tagged and cloud posture is monitored, but remediation is still manual',                                                plainSub: 'You can show what sensitive data exists, where it sits, and who can reach it — though fixing exposures is still manual.', s: 3 },
      { t: 'Continuous discovery, classification, lineage, and auto-remediation across multi-cloud + SaaS',                          sub: 'You know where every sensitive record is, who touched it, and misconfigurations auto-remediate',                                plainSub: 'Full visibility — if a breach happens you can name exactly what was at risk, in hours not weeks.', s: 4 },
      { t: "I'm not aware of where our sensitive data sits",                                                                         sub: 'Data sprawl is very common — this gap is worth mapping before it becomes a breach',                                              plainSub: "Worth mapping. Without knowing where sensitive data lives, you can't reliably protect it or report on a breach.", s: 1, isUnsure: true },
    ],
  },
  {
    domain: 'Data & Cloud',
    q: 'How are your cloud workloads protected? (VMs, containers, serverless, APIs)',
    terms: [
      { term: 'CWPP',       def: 'Cloud Workload Protection Platform — runtime protection for VMs, containers, and serverless functions, detecting threats inside the workload itself.' },
      { term: 'CNAPP',      def: 'Cloud-Native Application Protection Platform — unified security from code commit through to production: covers posture, workload protection, API security, and developer scanning.' },
      { term: 'Kubernetes', def: 'The most widely used container orchestration platform. Misconfigurations in Kubernetes clusters are a frequent source of cloud breaches.' },
    ],
    opts: [
      { t: 'Cloud-native defaults only (AWS Security Hub, Azure Defender basic)',                  sub: 'You rely on what the cloud provider gives you out of the box',                                                            plainSub: "You rely on the cloud provider's basics. Most cloud breaches happen because customers (not providers) misconfigured something.", s: 1 },
      { t: 'CSPM tool in place (Wiz, Orca, Prisma Cloud)',                                         sub: 'Cloud misconfigurations are flagged, but workload runtime protection is limited',                                          plainSub: 'You catch obvious cloud mistakes (open buckets, weak permissions). Threats running inside your apps may still go unnoticed.', s: 2 },
      { t: 'CSPM + CWPP + container and Kubernetes security',                                      sub: 'Posture management plus runtime protection across workloads and container clusters',                                       plainSub: 'You see misconfigurations AND detect attacks happening inside running workloads — strong cloud posture.', s: 3 },
      { t: 'CNAPP — unified posture, workload protection, API security, and shift-left scanning', sub: 'Security runs from code commit through to production runtime in one integrated platform',                                plainSub: 'Security is built in from when developers commit code, not bolted on later. Issues are caught early and cheap to fix.', s: 4 },
      { t: "I'm not sure how our cloud workloads are secured",                                     sub: 'Cloud security gaps are frequently the root cause of high-profile breaches — worth assessing',                            plainSub: 'Cloud breaches are usually customer-side errors, not provider failures. Worth assessing what your cloud actually protects.', s: 1, isUnsure: true },
    ],
  },
  {
    domain: 'AI & Emerging',
    q: "What's your posture on AI and GenAI tools being used in your org?",
    terms: [
      { term: 'GenAI',            def: 'Generative AI tools (ChatGPT, Microsoft Copilot, Gemini) — risk: employees may unknowingly paste sensitive customer or business data into external AI models.' },
      { term: 'DLP',              def: 'Data Loss Prevention — technology that monitors and blocks sensitive data from leaving your environment, including to AI tools.' },
      { term: 'Prompt injection', def: "Attack where malicious text embedded in an AI's input manipulates the model to perform unintended actions or leak sensitive information." },
    ],
    opts: [
      { t: 'Employees use whatever they want — no policy or controls',                              sub: 'Shadow AI is everywhere, no visibility into what data is being fed into external models',                                  plainSub: 'Employees may be pasting customer data, source code, or internal documents into public AI tools right now — invisibly.', s: 1 },
      { t: 'Public GenAI tools blocked at proxy, one sanctioned tool approved',                     sub: "You've drawn a line but most of the architecture is block and hope",                                                          plainSub: 'Better — but if blocked tools are still accessible from personal devices or phones, the data leak risk is unchanged.', s: 2 },
      { t: 'Prompt filtering, DLP on AI traffic, usage logged and audited',                          sub: "You can see what's going into AI tools, enforce data boundaries, and audit usage",                                             plainSub: 'You can see what employees send to AI tools and block sensitive data from leaving — meaningful protection.', s: 3 },
      { t: 'Model integrity scanning, prompt-injection defence, AI-IAM, runtime monitoring',         sub: 'Full AI security stack — protects both the AI your team uses and any AI your product runs',                                  plainSub: 'Both the AI your team uses and any AI in your products are protected against tampering and data leaks.', s: 4 },
    ],
  },
];
