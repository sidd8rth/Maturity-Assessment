// Airtel Secure — Security Maturity Self-Assessment
(function () {
  'use strict';

  const INDUSTRIES = [
    { id: 'bfsi',   label: 'BFSI',             sub: 'Banking, Financial Services & Insurance', icon: '🏦' },
    { id: 'health', label: 'Healthcare',         sub: 'Hospitals, pharma, diagnostics',          icon: '🏥' },
    { id: 'psu',    label: 'PSU / Government',   sub: 'Public sector undertakings & govt bodies', icon: '🏛️' },
    { id: 'mfg',    label: 'Manufacturing & OT', sub: 'Industrial, energy, critical infrastructure', icon: '🏭' },
    { id: 'it',     label: 'IT / ITeS',          sub: 'Tech companies, SaaS, BPO, IT services',  icon: '💻' },
    { id: 'other',  label: 'Other',              sub: 'Retail, logistics, education & more',     icon: '🏢' },
  ];

  const QUESTIONS = [
    {
      domain: 'Identity & Access',
      q: 'How do your employees access internal and cloud applications remotely?',
      terms: [
        { term: 'ZTNA', def: 'Zero Trust Network Access — grants per-app access based on who you are and your device health, rather than a blanket VPN tunnel. Much harder for attackers to exploit.' },
        { term: 'VPN', def: 'Virtual Private Network — creates an encrypted tunnel to your network. Gives broad network access once connected, which is the risk.' },
      ],
      opts: [
        { t: 'VPN only', sub: 'Everyone connects through a fixed tunnel back to your datacenter, regardless of what app they\'re opening', s: 1 },
        { t: 'VPN + MFA', sub: 'Same tunnel, but with an OTP or authenticator app layered on top', s: 2 },
        { t: 'ZTNA for critical apps (Zscaler, Netskope, Prisma Access)', sub: 'Access is granted per app based on who you are and your device health — not a blanket network tunnel', s: 3 },
        { t: 'Full ZTNA — no VPN dependency', sub: 'Every app is identity-gated and session-inspected. Network-level trust doesn\'t exist', s: 4 },
      ],
    },
    {
      domain: 'Identity & Access',
      q: 'How do you manage admin and privileged accounts?',
      terms: [
        { term: 'PAM', def: 'Privileged Access Management — tools like CyberArk or BeyondTrust that vault admin credentials, record sessions, and enforce least-privilege access.' },
        { term: 'AD / LDAP', def: 'Active Directory / Lightweight Directory Access Protocol — Microsoft\'s systems for managing user accounts, groups, and access policies across your org.' },
      ],
      opts: [
        { t: 'Shared credentials or static passwords', sub: 'Multiple people use the same login for critical systems', s: 1 },
        { t: 'Individual accounts + basic AD/LDAP controls', sub: 'Everyone has their own login but access reviews are manual and infrequent', s: 2 },
        { t: 'Dedicated PAM tool (CyberArk, BeyondTrust, Delinea)', sub: 'Privileged sessions are vaulted, recorded, and access is role-controlled', s: 3 },
        { t: 'Just-in-time access + zero standing privilege', sub: 'Admin rights are granted only when needed, auto-expire, and every session is audited', s: 4 },
      ],
    },
    {
      domain: 'Network & Perimeter',
      q: 'What\'s your current firewall setup?',
      terms: [
        { term: 'NGFW', def: 'Next-Generation Firewall — inspects application content (not just ports/IPs), has built-in IPS, and identifies apps. Brands: Palo Alto, Fortinet, Check Point.' },
        { term: 'IDS / IPS', def: 'Intrusion Detection / Prevention System — monitors traffic for known attack patterns. IDS alerts; IPS actively blocks.' },
        { term: 'Micro-segmentation', def: 'Divides the internal network into small isolated zones so a compromise in one area cannot spread laterally across your whole environment.' },
      ],
      opts: [
        { t: 'No dedicated firewall — relying on ISP or router defaults', sub: 'No enterprise firewall in place; traffic flows with minimal inspection', plainSub: 'Anyone on the internet can directly probe your network for ways in. The bare minimum protection is missing.', s: 1 },
        { t: 'Legacy or basic stateful firewall (older Cisco ASA, basic appliances)', sub: 'Filters by port and IP — doesn\'t inspect what\'s inside the packet', plainSub: 'You block obvious bad traffic, but can\'t see what attackers are actually sending — modern attacks slip through.', s: 1 },
        { t: 'Next-gen firewall (Fortinet, Palo Alto, Check Point)', sub: 'Inspects application layer, has IPS, and can see what apps are being used', plainSub: 'Your firewall recognises which apps and websites staff use, so it can block risky ones (file-sharing, unknown chat apps).', s: 2 },
        { t: 'NGFW + active threat feeds + IDS/IPS tuned to your environment', sub: 'Firewall is updated with live threat intelligence and tuned beyond factory defaults', plainSub: 'Your firewall is updated daily with known-bad addresses worldwide, so it blocks attackers seen elsewhere before they hit you.', s: 3 },
        { t: 'NGFW + micro-segmentation + east-west traffic inspection', sub: 'Even traffic moving inside your network is inspected — not just what comes in from outside', plainSub: 'Even if attackers get into one server, they can\'t move sideways to your databases, finance system, or other critical assets.', s: 4 },
      ],
    },
    {
      domain: 'Network & Perimeter',
      q: 'What happens if a volumetric DDoS attack hits your public-facing apps?',
      terms: [
        { term: 'DDoS', def: 'Distributed Denial of Service — attackers send massive volumes of fake traffic from thousands of machines to take your services offline for real users.' },
        { term: 'Scrubbing', def: 'Attack traffic is diverted to a specialist cleaning centre (Cloudflare, Akamai, Airtel backbone) that filters bad traffic before it reaches you.' },
      ],
      opts: [
        { t: 'We\'d find out when customers complain', sub: 'No dedicated DDoS protection in place', plainSub: 'Your website or apps could be taken offline for hours. The cost: lost sales, support overload, and brand damage.', s: 1 },
        { t: 'Basic ISP or firewall-level protection', sub: 'Handles small spikes but anything above a few Gbps would cause downtime', plainSub: 'Small attacks won\'t take you down, but a serious one will overwhelm you and require manual intervention.', s: 2 },
        { t: 'Cloud-based scrubbing (Cloudflare, Akamai, AWS Shield)', sub: 'Traffic is rerouted to a scrubbing centre in the cloud before reaching you', plainSub: 'Most attacks are absorbed before reaching you. Customers won\'t notice during all but the largest incidents.', s: 3 },
        { t: 'Backbone-level inline scrubbing', sub: 'Attack traffic is filtered at the network level before it ever reaches your infrastructure', plainSub: 'Attacks are stopped at the network level — even massive ones rarely cause customer-visible disruption.', s: 4 },
        { t: 'I\'m not sure what DDoS protection we have in place', sub: 'Worth finding out — unprotected services can be taken down by even low-cost attacks', plainSub: 'Worth checking — a single attack can cost lakhs in lost transactions and erode customer trust.', s: 1, isUnsure: true },
      ],
    },
    {
      domain: 'Detection & Response',
      q: 'What\'s your threat monitoring and detection setup?',
      terms: [
        { term: 'SIEM', def: 'Security Information & Event Management — aggregates logs from all systems into one place to detect threats. Examples: Splunk, QRadar, ArcSight.' },
        { term: 'SOAR', def: 'Security Orchestration, Automation & Response — automatically triggers response playbooks (isolate device, block IP) when alerts fire, cutting response time.' },
        { term: 'MDR', def: 'Managed Detection & Response — an outsourced 24x7 security team with AI tooling that monitors, triages, and contains threats on your behalf.' },
      ],
      opts: [
        { t: 'No centralised logging or SIEM', sub: 'Logs exist on individual systems but nobody\'s watching them in one place', plainSub: 'If an attacker gets in, you may not notice for weeks or months. By then they\'ve stolen data, deployed ransomware, or damaged systems.', s: 1 },
        { t: 'Basic SIEM with standard rules (Splunk, QRadar, ArcSight)', sub: 'Logs are aggregated but alerts are mostly noise — high false positive rate', plainSub: 'You collect data centrally, but real threats hide in noise. Genuine attacks may be missed; analysts burn out chasing false alarms.', s: 2 },
        { t: 'SIEM + SOAR with defined playbooks', sub: 'Alerts trigger automated responses, and your team has documented runbooks per scenario', plainSub: 'When something suspicious happens, your team has clear playbooks and automated steps. Response is consistent, not heroic.', s: 3 },
        { t: 'Managed SOC with AI-assisted triage (24x7, MDR)', sub: 'A dedicated team monitors, triages, and contains — with machine-assisted detection cutting MTTD to minutes', plainSub: 'An expert team watches 24x7. If something starts at 2am, they\'re already responding before you wake up.', s: 4 },
        { t: 'I\'m not sure what monitoring tools we use', sub: 'No clear visibility into current detection setup — a common gap worth addressing first', plainSub: 'If your team can\'t describe what\'s monitored, treat it as a gap. Most breaches go undetected for weeks in mid-sized organisations.', s: 1, isUnsure: true },
      ],
    },
    {
      domain: 'Detection & Response',
      q: 'If a breach happened at 2am, how would the first 30 minutes go?',
      terms: [
        { term: 'MSSP', def: 'Managed Security Service Provider — an external company running your security monitoring and operations.' },
        { term: 'IR retainer', def: 'Incident Response retainer — a pre-paid contract with a forensics firm (e.g. Mandiant, CrowdStrike Services) so they can respond within hours of a breach.' },
      ],
      opts: [
        { t: 'Honestly, we\'d probably find out hours later', sub: 'No on-call rotation, no automated alerting', s: 1 },
        { t: 'Someone gets paged and starts investigating manually', sub: 'On-call exists but response depends on the individual', s: 2 },
        { t: 'SOC or MSSP triages within 15 minutes, runbook invoked', sub: 'Defined process kicks in automatically — roles, escalation path, and IR steps are pre-documented', s: 3 },
        { t: 'Managed SOC contains within 15 min, IR retainer auto-engaged', sub: 'Containment is automated, external IR firm is on retainer, legal and comms notified per playbook', s: 4 },
      ],
    },
    {
      domain: 'Governance & Compliance',
      q: 'How are you tracking compliance with Indian regulations? (DPDP Act, RBI, SEBI, IRDAI, CERT-In 6-hour reporting)',
      terms: [
        { term: 'DPDP Act', def: 'Digital Personal Data Protection Act (2023) — India\'s new privacy law mandating data handling rules and breach notification obligations for all organisations processing Indian personal data.' },
        { term: 'CERT-In 6hr', def: 'India\'s CERT-In requires organisations to report cyber incidents to the government within 6 hours of becoming aware. Non-compliance carries penalties.' },
        { term: 'GRC', def: 'Governance, Risk & Compliance — software platforms (ServiceNow GRC, MetricStream, Archer) that map controls to regulations and automate evidence collection for audits.' },
      ],
      opts: [
        { t: 'We rely on legal or audit to flag issues', sub: 'No proactive tracking — compliance is reactive', plainSub: 'You\'ll find out about a compliance gap when a regulator does — at which point fines, public disclosure, and remediation costs are inevitable.', s: 1 },
        { t: 'Spreadsheet owned by one team, updated ad hoc', sub: 'Manual tracking, usually outdated, siloed from the security team', plainSub: 'You\'re tracking compliance, but evidence is scattered. A real audit would expose the gaps quickly.', s: 2 },
        { t: 'GRC tool with mapped controls, reviewed quarterly', sub: 'Controls are documented and linked to regulations, but evidence collection is still manual', plainSub: 'Audit prep is manageable; you can show evidence on demand. Some manual evidence collection still required.', s: 3 },
        { t: 'Continuous compliance monitoring — auto-mapped controls, real-time dashboard', sub: 'Evidence is collected automatically, board-level reporting is live, audit prep takes days not weeks', plainSub: 'Compliance is always audit-ready. The board can see status anytime; regulators get clean responses.', s: 4 },
        { t: 'I\'m not sure how we track regulatory compliance', sub: 'No clear ownership of compliance I\'m aware of — risky given DPDP Act and CERT-In obligations', plainSub: 'If nobody can describe how compliance is tracked, the next audit (or DPDP/CERT-In incident) is a serious risk.', s: 1, isUnsure: true },
      ],
    },
    {
      domain: 'Governance & Compliance',
      q: 'How often do you run security audits or VAPT?',
      terms: [
        { term: 'VAPT', def: 'Vulnerability Assessment & Penetration Testing — expert-led testing that finds weaknesses in your systems before attackers do. Mandatory for many regulated sectors in India.' },
        { term: 'Red team', def: 'A dedicated adversarial exercise where ethical hackers try to breach your environment using the same techniques real attackers use — more realistic than standard VAPT.' },
      ],
      opts: [
        { t: 'Never, or only after an incident', sub: 'Testing is not planned — it happens when something goes wrong', s: 1 },
        { t: 'Annual audit, mostly compliance-driven', sub: 'You do it because a regulator or client asks, not proactively', s: 2 },
        { t: 'Bi-annual VAPT + periodic red team exercises', sub: 'Structured testing cadence with a third-party firm, findings tracked to closure', s: 3 },
        { t: 'Continuous scanning + quarterly third-party audits + red team on retainer', sub: 'Automated vulnerability scanning runs always, manual testing is frequent and adversarial', s: 4 },
      ],
    },
    {
      domain: 'Endpoint & Workforce',
      q: 'What\'s running on your endpoints — laptops, mobiles, workstations?',
      terms: [
        { term: 'EDR', def: 'Endpoint Detection & Response — records full device telemetry (processes, network connections, file changes) to detect and contain threats in real-time. Examples: CrowdStrike, SentinelOne.' },
        { term: 'XDR', def: 'Extended Detection & Response — unifies signals from endpoint, email, network, and cloud into one detection layer with automated response capability.' },
      ],
      opts: [
        { t: 'No dedicated endpoint security — bare OS', sub: 'Devices have no security software beyond what the OS shipped with', s: 1 },
        { t: 'Legacy AV only (Windows Defender basic, McAfee, Symantec AV)', sub: 'Signature-based detection — only catches known threats, misses novel attacks', s: 1 },
        { t: 'Next-gen AV with some behavioural detection', sub: 'Better than legacy AV but no full telemetry or threat hunting capability', s: 2 },
        { t: 'EDR deployed across most devices (CrowdStrike, SentinelOne, Defender for Endpoint)', sub: 'Full telemetry, behavioural detection, and alert triage — but managed in-house', s: 3 },
        { t: 'Managed XDR — unified across endpoint, email, network, and cloud', sub: 'Everything feeds into one detection layer, managed by a SOC with automated response', s: 4 },
      ],
    },
    {
      domain: 'Data & Cloud',
      q: 'Do you know where your sensitive data lives? (PII, financial records, source code, PCI data)',
      terms: [
        { term: 'DSPM', def: 'Data Security Posture Management — discovers and classifies sensitive data across cloud storage, SaaS apps, and databases, then flags who has access and what\'s exposed.' },
        { term: 'CSPM', def: 'Cloud Security Posture Management — continuously scans your cloud environment (AWS, Azure, GCP) for misconfigurations like open S3 buckets or over-permissioned roles.' },
        { term: 'PII', def: 'Personally Identifiable Information — any data that can identify a person (name, phone, Aadhaar, email). Subject to DPDP Act obligations in India.' },
      ],
      opts: [
        { t: 'Not really — it\'s sprawled across systems and SaaS tools', sub: 'No formal data classification or discovery in place', plainSub: 'If a regulator asks where customer data is stored — or after a breach, what was leaked — you can\'t answer with confidence.', s: 1 },
        { t: 'We\'ve manually mapped 3–5 critical data stores', sub: 'Key databases are known but SaaS and cloud data is largely untracked', plainSub: 'You know the obvious places, but data hidden in shared drives, SaaS tools, and old servers is still a major unknown.', s: 2 },
        { t: 'Data classification rolled out, DSPM/CSPM scans run regularly', sub: 'Data is tagged and cloud posture is monitored, but remediation is still manual', plainSub: 'You can show what sensitive data exists, where it sits, and who can reach it — though fixing exposures is still manual.', s: 3 },
        { t: 'Continuous discovery, classification, lineage, and auto-remediation across multi-cloud + SaaS', sub: 'You know where every sensitive record is, who touched it, and misconfigurations auto-remediate', plainSub: 'Full visibility — if a breach happens you can name exactly what was at risk, in hours not weeks.', s: 4 },
        { t: 'I\'m not aware of where our sensitive data sits', sub: 'Data sprawl is very common — this gap is worth mapping before it becomes a breach', plainSub: 'Worth mapping. Without knowing where sensitive data lives, you can\'t reliably protect it or report on a breach.', s: 1, isUnsure: true },
      ],
    },
    {
      domain: 'Data & Cloud',
      q: 'How are your cloud workloads protected? (VMs, containers, serverless, APIs)',
      terms: [
        { term: 'CWPP', def: 'Cloud Workload Protection Platform — runtime protection for VMs, containers, and serverless functions, detecting threats inside the workload itself.' },
        { term: 'CNAPP', def: 'Cloud-Native Application Protection Platform — unified security from code commit through to production: covers posture, workload protection, API security, and developer scanning.' },
        { term: 'Kubernetes', def: 'The most widely used container orchestration platform. Misconfigurations in Kubernetes clusters are a frequent source of cloud breaches.' },
      ],
      opts: [
        { t: 'Cloud-native defaults only (AWS Security Hub, Azure Defender basic)', sub: 'You rely on what the cloud provider gives you out of the box', plainSub: 'You rely on the cloud provider\'s basics. Most cloud breaches happen because customers (not providers) misconfigured something.', s: 1 },
        { t: 'CSPM tool in place (Wiz, Orca, Prisma Cloud)', sub: 'Cloud misconfigurations are flagged, but workload runtime protection is limited', plainSub: 'You catch obvious cloud mistakes (open buckets, weak permissions). Threats running inside your apps may still go unnoticed.', s: 2 },
        { t: 'CSPM + CWPP + container and Kubernetes security', sub: 'Posture management plus runtime protection across workloads and container clusters', plainSub: 'You see misconfigurations AND detect attacks happening inside running workloads — strong cloud posture.', s: 3 },
        { t: 'CNAPP — unified posture, workload protection, API security, and shift-left scanning', sub: 'Security runs from code commit through to production runtime in one integrated platform', plainSub: 'Security is built in from when developers commit code, not bolted on later. Issues are caught early and cheap to fix.', s: 4 },
        { t: 'I\'m not sure how our cloud workloads are secured', sub: 'Cloud security gaps are frequently the root cause of high-profile breaches — worth assessing', plainSub: 'Cloud breaches are usually customer-side errors, not provider failures. Worth assessing what your cloud actually protects.', s: 1, isUnsure: true },
      ],
    },
    {
      domain: 'AI & Emerging',
      q: 'What\'s your posture on AI and GenAI tools being used in your org?',
      terms: [
        { term: 'GenAI', def: 'Generative AI tools (ChatGPT, Microsoft Copilot, Gemini) — risk: employees may unknowingly paste sensitive customer or business data into external AI models.' },
        { term: 'DLP', def: 'Data Loss Prevention — technology that monitors and blocks sensitive data from leaving your environment, including to AI tools.' },
        { term: 'Prompt injection', def: 'Attack where malicious text embedded in an AI\'s input manipulates the model to perform unintended actions or leak sensitive information.' },
      ],
      opts: [
        { t: 'Employees use whatever they want — no policy or controls', sub: 'Shadow AI is everywhere, no visibility into what data is being fed into external models', plainSub: 'Employees may be pasting customer data, source code, or internal documents into public AI tools right now — invisibly.', s: 1 },
        { t: 'Public GenAI tools blocked at proxy, one sanctioned tool approved', sub: 'You\'ve drawn a line but most of the architecture is block and hope', plainSub: 'Better — but if blocked tools are still accessible from personal devices or phones, the data leak risk is unchanged.', s: 2 },
        { t: 'Prompt filtering, DLP on AI traffic, usage logged and audited', sub: 'You can see what\'s going into AI tools, enforce data boundaries, and audit usage', plainSub: 'You can see what employees send to AI tools and block sensitive data from leaving — meaningful protection.', s: 3 },
        { t: 'Model integrity scanning, prompt-injection defence, AI-IAM, runtime monitoring', sub: 'Full AI security stack — protects both the AI your team uses and any AI your product runs', plainSub: 'Both the AI your team uses and any AI in your products are protected against tampering and data leaks.', s: 4 },
      ],
    },
  ];

  const WEIGHTS = {
    bfsi:   { 'Governance & Compliance': 0.25, 'Identity & Access': 0.20, 'Network & Perimeter': 0.10, 'Detection & Response': 0.15, 'Endpoint & Workforce': 0.05, 'Data & Cloud': 0.20, 'AI & Emerging': 0.05 },
    health: { 'Governance & Compliance': 0.20, 'Identity & Access': 0.15, 'Network & Perimeter': 0.10, 'Detection & Response': 0.15, 'Endpoint & Workforce': 0.10, 'Data & Cloud': 0.25, 'AI & Emerging': 0.05 },
    psu:    { 'Governance & Compliance': 0.25, 'Identity & Access': 0.15, 'Network & Perimeter': 0.20, 'Detection & Response': 0.20, 'Endpoint & Workforce': 0.05, 'Data & Cloud': 0.10, 'AI & Emerging': 0.05 },
    mfg:    { 'Governance & Compliance': 0.15, 'Identity & Access': 0.10, 'Network & Perimeter': 0.25, 'Detection & Response': 0.20, 'Endpoint & Workforce': 0.15, 'Data & Cloud': 0.10, 'AI & Emerging': 0.05 },
    it:     { 'Governance & Compliance': 0.10, 'Identity & Access': 0.20, 'Network & Perimeter': 0.10, 'Detection & Response': 0.15, 'Endpoint & Workforce': 0.10, 'Data & Cloud': 0.25, 'AI & Emerging': 0.10 },
    other:  { 'Governance & Compliance': 0.15, 'Identity & Access': 0.15, 'Network & Perimeter': 0.15, 'Detection & Response': 0.15, 'Endpoint & Workforce': 0.13, 'Data & Cloud': 0.15, 'AI & Emerging': 0.12 },
  };

  const DOMAIN_STACK = {
    'Identity & Access':       { primary: 'Secure Workforce',      secondary: 'Managed Services' },
    'Endpoint & Workforce':    { primary: 'Secure Workforce',      secondary: 'Managed Services' },
    'Network & Perimeter':     { primary: 'Network Security',      secondary: 'Managed Services' },
    'Data & Cloud':            { primary: 'Secure Workload',       secondary: 'Managed Services' },
    'Detection & Response':    { primary: 'Managed Services',      secondary: 'Professional Services' },
    'Governance & Compliance': { primary: 'Professional Services', secondary: 'Managed Services' },
    'AI & Emerging':           { primary: 'Secure Workload',       secondary: 'Secure Workforce' },
  };

  const STACK_COPY = {
    // Foundational stacks (Basic / Developing / Established tiers)
    'Secure Workforce':     { title: 'Secure Workforce',     desc: 'Your identity and endpoint posture is your biggest exposure. ZTNA, PAM, EDR and managed XDR — delivered as a service from Airtel\'s iSOC.',                                                                      href: '../stack/secure-workforce.html' },
    'Network Security':     { title: 'Network Security',     desc: 'Your perimeter has gaps a threat actor can exploit. NGFW, India\'s largest DDoS scrubbing infrastructure, and SD-WAN security — built into the network layer.',                                                  href: '../stack/network-security.html' },
    'Secure Workload':      { title: 'Secure Workload',      desc: 'Your cloud and data posture needs attention. CNAPP, DSPM, CSPM and API protection — run by Airtel\'s cloud security pod.',                                                                                        href: '../stack/secure-workload.html' },
    'Managed Services':     { title: 'Managed Services',     desc: 'You need 24x7 eyes on glass, not just tools. Airtel\'s AI-assisted iSOC with CERT-In aligned playbooks, MDR and an IR retainer.',                                                                                href: '../stack/managed-services.html' },
    'Professional Services':{ title: 'Professional Services',desc: 'Before adding more tools, you need a structured foundation. VAPT, risk assessments, compliance gap analysis and a programme roadmap — done with you, not handed over.',                                          href: '../stack/professional-services.html' },

    // Advanced-tier services (shown only when score ≥ 80)
    'Red Team Retainer':    { title: 'Adversary Emulation & Red Team',     desc: 'You don\'t need more controls — you need proof they hold under real attacker pressure. Continuous breach & attack simulation, assumed-breach exercises, and purple-team engagements run by Airtel\'s offensive security pod.', href: '../stack/red-team.html' },
    'Supply Chain Risk':    { title: 'Supply Chain & Third-Party Risk',    desc: 'Your perimeter is hard. The next breach won\'t come through it — it will come through a vendor or dependency. Continuous third-party monitoring, SCRM tooling, and vendor security attestation programmes.', href: '../stack/supply-chain.html' },
    'AI Security':          { title: 'AI Security & Model Risk',           desc: 'If you ship AI in your products, you have a new attack surface few teams understand. Model integrity scanning, prompt-injection defence, AI-IAM, and runtime monitoring of the models themselves.',                              href: '../stack/ai-security.html' },
    'Cyber Resilience':     { title: 'Cyber Resilience Engineering',       desc: 'Resilience isn\'t backups — it\'s recovering operations under coordinated attack. Ransomware-proof recovery architecture, chaos engineering for security, and regulatory crisis tabletops.',                                     href: '../stack/cyber-resilience.html' },
    'Threat Intelligence':  { title: 'Threat Intelligence & Sector ISAC',  desc: 'Generic feeds aren\'t enough at your maturity. Proprietary intelligence, dark-web monitoring, and sector-specific ISAC participation tuned to the threat actors that actually target your industry.',                            href: '../stack/threat-intel.html' },
    'CISO Advisory':        { title: 'vCISO & Strategic Advisory',         desc: 'Where should the next ₹X crore go? Board-grade reporting, cyber insurance optimisation, regulatory engagement, and strategic security investment guidance from senior practitioners.',                                          href: '../stack/ciso-advisory.html' },
  };

  // Advanced-tier picks per industry (used when overall score ≥ 80)
  const ADVANCED_PICKS = {
    bfsi:   ['Red Team Retainer', 'Threat Intelligence', 'CISO Advisory'],
    health: ['Supply Chain Risk', 'Cyber Resilience',    'AI Security'],
    psu:    ['Threat Intelligence','Cyber Resilience',   'CISO Advisory'],
    mfg:    ['Cyber Resilience',  'Supply Chain Risk',   'Red Team Retainer'],
    it:     ['AI Security',       'Red Team Retainer',   'Supply Chain Risk'],
    other:  ['Red Team Retainer', 'Supply Chain Risk',   'CISO Advisory'],
  };

  // Tier-aware CTA copy
  const TIER_CTA = {
    Basic: {
      title: 'Your foundation is exposed. Let\'s fix that fast.',
      body: 'A 30-min session with an Airtel Secure architect. We\'ll prioritise the 2–3 controls that close the most risk in 90 days, with commercial range within 3 business days.',
      primary: 'Get a fast-track plan →',
    },
    Developing: {
      title: 'You\'re on track. Now compress the timeline.',
      body: 'Book a 30-min session. We\'ll turn this score into a concrete blueprint with SLA targets and commercial range within 3 business days.',
      primary: 'Book a 30-min session →',
    },
    Established: {
      title: 'You\'ve earned the right to think bigger.',
      body: 'A 45-min strategy review with our practice lead. We\'ll map your next leap — managed services, zero-trust at scale, or AI-assisted detection — to commercial outcomes.',
      primary: 'Book a strategy review →',
    },
    Advanced: {
      title: 'You don\'t need basics. You need a strategic resilience review.',
      body: 'A peer-level conversation with senior Airtel Secure practitioners. Adversary emulation, supply chain risk, AI security, or resilience engineering — wherever your real exposure now sits.',
      primary: 'Book a CISO advisory call →',
    },
  };

  const DOMAIN_COLORS = {
    'Identity & Access':       'linear-gradient(90deg,#d40000,#ff6060)',
    'Network & Perimeter':     'linear-gradient(90deg,#ff8c00,#ffb84d)',
    'Detection & Response':    'linear-gradient(90deg,#06b6d4,#67e8f9)',
    'Governance & Compliance': 'linear-gradient(90deg,#8b5cf6,#c4b5fd)',
    'Endpoint & Workforce':    'linear-gradient(90deg,#2ecc71,#6ee8a6)',
    'Data & Cloud':            'linear-gradient(90deg,#ec4899,#f9a8d4)',
    'AI & Emerging':           'linear-gradient(90deg,#f59e0b,#fde68a)',
  };

  const TIER_THREATS = {
    'Basic': [
      { icon: '🎣', name: 'Phishing & credential theft', desc: 'Without MFA and email controls, a single convincing email can hand attackers full access to internal systems.' },
      { icon: '💰', name: 'Ransomware', desc: 'Weak endpoint and backup posture makes you a prime target. Average ransom demand in India now exceeds ₹3 crore.' },
      { icon: '🌊', name: 'DDoS attacks', desc: 'Without scrubbing infrastructure, even a low-cost volumetric attack can take your public services offline for hours.' },
      { icon: '🔓', name: 'Undetected data exfiltration', desc: 'Sensitive customer or financial data can be quietly copied and sold — with no alerting in place you may not find out for months.' },
    ],
    'Developing': [
      { icon: '🎯', name: 'Targeted ransomware', desc: 'Organised groups like LockBit scout for partially-secured orgs and deploy tailored attacks that bypass standard AV.' },
      { icon: '☁️', name: 'Cloud misconfiguration exploits', desc: 'Exposed S3 buckets and over-permissioned IAM roles are scanned and exploited within hours of appearing online.' },
      { icon: '👤', name: 'Insider threats & account takeover', desc: 'Without PAM and behaviour analytics, compromised accounts — or malicious insiders — can move freely once inside.' },
      { icon: '📧', name: 'Business email compromise', desc: 'Attackers impersonate executives to approve fraudulent transfers. BEC caused over $2.9 billion in global losses last year.' },
    ],
    'Established': [
      { icon: '🕵️', name: 'Advanced persistent threats (APT)', desc: 'Sophisticated groups may target your org over months using low-and-slow techniques that evade standard detection rules.' },
      { icon: '🤖', name: 'AI-assisted attack automation', desc: 'Adversaries now use AI to craft convincing spear-phishing, generate malware variants, and auto-scan your stack for gaps.' },
      { icon: '🔗', name: 'Supply chain compromise', desc: 'Your direct controls are strong — third-party software and vendors in your ecosystem are now the more likely entry point.' },
    ],
    'Advanced': [
      { icon: '🔬', name: 'Zero-day exploitation', desc: 'At your maturity, targeted zero-days against your specific tech stack are the most realistic high-impact threat scenario.' },
      { icon: '🌐', name: 'Third-party & supply chain risk', desc: 'Your own environment is hardened — focus shifts to vendors, SaaS tools, and open-source dependencies in your chain.' },
      { icon: '🤖', name: 'AI-powered adversarial attacks', desc: 'Automated red-teaming and continuous threat modelling are needed to stay ahead of AI-assisted attack speed.' },
    ],
  };

  const TIER_MESSAGES = {
    Basic: {
      business: 'You\'re highly exposed. The basic protections most attackers expect are missing or fragmented — even a routine ransomware or phishing attack could cause significant downtime, customer impact, and regulatory fallout. The good news: this is where Airtel Secure delivers the fastest, most visible improvement.',
      technical: 'Foundational controls are missing or fragmented across multiple domains. Attack surface is wide; detection coverage is minimal. Priority: identity layer (MFA + ZTNA), endpoint EDR, and a managed SOC for round-the-clock monitoring before adding anything else.',
    },
    Developing: {
      business: 'You have building blocks in place, but real gaps remain. A targeted ransomware attempt or insider misuse could still cause days of downtime and meaningful financial cost. Consolidation under a managed SOC will dramatically reduce risk — without adding headcount or new tools.',
      technical: 'Tooling exists across most domains but is fragmented and underutilised. SIEM signal-to-noise is poor, response times are inconsistent, and cloud posture has visible gaps. Focus: tool consolidation, MDR engagement, and tightening identity governance.',
    },
    Established: {
      business: 'You\'re better protected than most Indian enterprises. The next leap is moving from reactive to predictive — AI-assisted detection, zero-trust at scale, and outcome-based managed services that compress incident response from hours to minutes.',
      technical: 'Solid baseline across core domains. Marginal gains now come from advanced detection (XDR/MDR with AI triage), continuous validation (red team retainer), and full zero-trust beyond just the identity layer.',
    },
    Advanced: {
      business: 'You\'re operating in the top decile. Most threats targeting Indian organisations are no longer your primary risk — focus shifts to nation-state actors, AI-powered attacks, and your supply chain. Resilience engineering and continuous red-teaming matter more than adding controls.',
      technical: 'Top-decile maturity. Threat model shifts to APTs, zero-day exploitation, and supply chain risk. Investment areas: continuous adversarial validation, AI/ML threat modelling, and OT/IoT visibility where relevant.',
    },
  };

  const state = {
    industry: null,
    industryLabel: '',
    step: 0,
    plainMode: false,
    resultsView: 'business', // 'business' | 'technical'
    answers: new Array(QUESTIONS.length).fill(null),
  };

  let autoAdvanceTimer = null;
  function clearAutoAdvance() {
    if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
    // Remove any lingering progress bar
    const bar = document.getElementById('auto-advance-bar');
    if (bar) bar.remove();
  }

  const $ = (id) => document.getElementById(id);
  function show(id) { $(id).style.display = 'block'; }
  function hide(id) { $(id).style.display = 'none';  }

  // ── INDUSTRY SCREEN ──────────────────────────
  function buildIndustryTiles() {
    const grid = $('ind-grid');
    grid.innerHTML = '';
    const otherWrap = $('other-industry-input');

    INDUSTRIES.forEach((ind) => {
      const tile = document.createElement('div');
      tile.className = 'ind-tile' + (state.industry === ind.id ? ' selected' : '');
      tile.innerHTML = `<div class="ind-icon">${ind.icon}</div><div class="ind-name">${ind.label}</div><div class="ind-sub">${ind.sub}</div>`;
      tile.addEventListener('click', () => {
        state.industry = ind.id;
        document.querySelectorAll('.ind-tile').forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        $('ind-next-btn').disabled = false;
        if (ind.id === 'other') {
          otherWrap.style.display = 'block';
          setTimeout(() => { const f = $('other-industry-text'); if (f) f.focus(); }, 50);
        } else {
          otherWrap.style.display = 'none';
          state.industryLabel = ind.label;
        }
      });
      grid.appendChild(tile);
    });

    // Restore other text if navigating back
    const otherInput = $('other-industry-text');
    if (otherInput) {
      otherInput.value = state.industry === 'other' ? state.industryLabel : '';
      if (state.industry === 'other') otherWrap.style.display = 'block';
      otherInput.addEventListener('input', () => {
        state.industryLabel = otherInput.value.trim() || 'Other';
      });
    }
  }

  // ── QUESTION RENDER ───────────────────────────
  function renderQuestion() {
    const q     = QUESTIONS[state.step];
    const idx   = state.step;
    const total = QUESTIONS.length;

    $('step-label').textContent   = `Question ${idx + 1} of ${total}`;
    $('domain-label').textContent = q.domain;
    $('q-title').textContent      = q.q;
    $('q-counter').textContent    = `${idx + 1} / ${total}`;

    // Terms / glossary chips (hidden in plain mode — plainSub already explains things)
    const existingTerms = document.getElementById('q-terms-row');
    if (existingTerms) existingTerms.remove();
    if (q.terms && q.terms.length && !state.plainMode) {
      const row = document.createElement('div');
      row.id        = 'q-terms-row';
      row.className = 'q-terms-row';
      const lbl = document.createElement('span');
      lbl.className   = 'q-terms-label';
      lbl.textContent = 'Key terms:';
      row.appendChild(lbl);
      q.terms.forEach(t => {
        const chip = document.createElement('button');
        chip.type      = 'button';
        chip.className = 'term-chip';
        chip.setAttribute('aria-label', `What is ${t.term}?`);
        chip.innerHTML = `${t.term}<span class="term-i" aria-hidden="true">ℹ</span><span class="term-tip" role="tooltip">${t.def}</span>`;
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          document.querySelectorAll('.term-chip.open').forEach(c => { if (c !== chip) c.classList.remove('open'); });
          chip.classList.toggle('open');
        });
        row.appendChild(chip);
      });
      $('q-title').insertAdjacentElement('afterend', row);
    }

    const pct = Math.round((idx / total) * 100);
    $('bar').style.width              = pct + '%';
    $('progress-label').textContent   = `Question ${idx + 1} of ${total}`;
    $('progress-pct').textContent     = pct + '%';

    $('back-btn').style.visibility = idx === 0 ? 'hidden' : 'visible';
    $('next-btn').textContent      = idx === total - 1 ? 'See my results →' : 'Next →';
    $('next-btn').disabled         = state.answers[idx] === null;

    const opts = $('opts');
    opts.innerHTML = '';
    q.opts.forEach((o, i) => {
      const el = document.createElement('div');
      el.className = 'opt' +
        (state.answers[idx] === i ? ' selected' : '') +
        (o.isUnsure ? ' opt-unsure' : '');
      const subText = (state.plainMode && o.plainSub) ? o.plainSub : o.sub;
      el.innerHTML = `
        <span class="radio"></span>
        <span class="txt"><b>${o.t}</b><small>${subText}</small></span>`;
      el.addEventListener('click', () => {
        clearAutoAdvance();
        state.answers[idx] = i;
        renderQuestion();
        const advBar = document.createElement('div');
        advBar.id = 'auto-advance-bar';
        advBar.className = 'auto-advance-bar';
        advBar.innerHTML = '<span></span>';
        $('opts').insertAdjacentElement('afterend', advBar);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { advBar.querySelector('span').style.width = '100%'; });
        });
        autoAdvanceTimer = setTimeout(() => {
          advBar.remove();
          nextQuestion();
        }, 700);
      });
      opts.appendChild(el);
    });
  }

  // ── SCORING ───────────────────────────────────
  function computeResults() {
    const weights = WEIGHTS[state.industry] || WEIGHTS.other;

    const domainRaw = {};
    QUESTIONS.forEach((q, i) => {
      const score = q.opts[state.answers[i]].s;
      if (!domainRaw[q.domain]) domainRaw[q.domain] = { total: 0, count: 0 };
      domainRaw[q.domain].total += score;
      domainRaw[q.domain].count += 1;
    });

    const domainScores = Object.entries(domainRaw).map(([name, v]) => ({
      name,
      pct: Math.round(((v.total / v.count) - 1) / 3 * 100),
    }));

    let overall = 0;
    domainScores.forEach(d => { overall += d.pct * (weights[d.name] || 0); });
    overall = Math.round(overall);

    let tier, tierCls;
    if (overall < 35)      { tier = 'Basic';       tierCls = 'tier-basic'; }
    else if (overall < 60) { tier = 'Developing';  tierCls = 'tier-developing'; }
    else if (overall < 80) { tier = 'Established'; tierCls = 'tier-established'; }
    else                   { tier = 'Advanced';    tierCls = 'tier-advanced'; }

    state.currentTier = tier;
    $('tier-pill').textContent = tier;
    $('tier-pill').className   = 'tier-pill ' + tierCls;
    $('tier-msg').textContent  = TIER_MESSAGES[tier][state.resultsView];

    animateNumber($('score-num'), 0, overall, 1400);
    animateRing($('score-ring'), overall);

    // Threat exposure
    const threatList = TIER_THREATS[tier] || TIER_THREATS['Basic'];
    const threatEl   = $('threats');
    threatEl.innerHTML = '';
    threatList.forEach(t => {
      const card = document.createElement('div');
      card.className = 'threat-card';
      card.innerHTML = `<div class="threat-icon">${t.icon}</div><div class="threat-body"><b>${t.name}</b><small>${t.desc}</small></div>`;
      threatEl.appendChild(card);
    });

    const sorted = [...domainScores].sort((a, b) => a.pct - b.pct);
    const dom = $('domains');
    dom.innerHTML = '';
    sorted.forEach(d => {
      const color = DOMAIN_COLORS[d.name] || 'linear-gradient(90deg,#d40000,#ff6060)';
      const row = document.createElement('div');
      row.className = 'domain-row';
      row.innerHTML = `
        <div class="domain-name">${d.name}</div>
        <div class="domain-bar"><span style="background:${color};width:0%"></span></div>
        <div class="domain-score">${d.pct}</div>`;
      dom.appendChild(row);
      setTimeout(() => { row.querySelector('.domain-bar span').style.width = d.pct + '%'; }, 80);
    });

    const recs   = buildRecommendations(domainScores, overall, weights, tier);
    const recsEl = $('recs');
    recsEl.innerHTML = '';
    recs.forEach((stackKey, i) => {
      const s  = STACK_COPY[stackKey];
      const el = document.createElement('div');
      el.className = 'rec';
      el.innerHTML = `
        <div class="rec-rank">${i + 1}</div>
        <div class="rec-body">
          <b>${s.title}</b>
          <small>${s.desc}</small>
          <a href="${s.href}">Explore this capability →</a>
        </div>`;
      recsEl.appendChild(el);
    });

    // Tier-aware CTA copy
    const cta = TIER_CTA[tier];
    if (cta) {
      const ctaTitle = $('cta-title'), ctaBody = $('cta-body'), ctaPrimary = $('cta-primary');
      if (ctaTitle)   ctaTitle.textContent   = cta.title;
      if (ctaBody)    ctaBody.textContent    = cta.body;
      if (ctaPrimary) ctaPrimary.textContent = cta.primary;
    }
  }

  function buildRecommendations(domainScores, overall, weights, tier) {
    // Advanced tier: hand-picked services per industry, not domain-gap-driven
    if (tier === 'Advanced') {
      const picks = ADVANCED_PICKS[state.industry] || ADVANCED_PICKS.other;
      return picks.slice(0, 3);
    }

    const weighted = domainScores.map(d => ({
      name: d.name,
      weightedPct: d.pct * (weights[d.name] || 0),
    })).sort((a, b) => a.weightedPct - b.weightedPct);

    const output = [], seen = new Set();
    for (const d of weighted) {
      if (output.length >= 3) break;
      const k = DOMAIN_STACK[d.name]?.primary;
      if (k && !seen.has(k)) { output.push(k); seen.add(k); }
    }
    if (overall < 45 && !seen.has('Professional Services')) {
      if (output.length >= 3) output[2] = 'Professional Services';
      else output.push('Professional Services');
    }
    if (output.length < 3) {
      for (const d of weighted) {
        if (output.length >= 3) break;
        const k = DOMAIN_STACK[d.name]?.secondary;
        if (k && !seen.has(k)) { output.push(k); seen.add(k); }
      }
    }
    return output.slice(0, 3);
  }

  // ── ANIMATIONS ───────────────────────────────
  function animateNumber(el, from, to, dur) {
    const start = performance.now();
    function tick(t) {
      const p     = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function animateRing(ring, pct) {
    const circ   = 2 * Math.PI * 86;
    const offset = circ * (1 - pct / 100);
    ring.style.transition      = 'stroke-dashoffset 1.4s cubic-bezier(0.2,0.8,0.2,1)';
    ring.style.strokeDasharray = circ;
    requestAnimationFrame(() => { ring.style.strokeDashoffset = offset; });
  }

  // ── NAVIGATION ───────────────────────────────
  function goToIntro()     { clearAutoAdvance(); hide('industry-screen'); hide('quiz'); hide('results'); show('intro'); }
  function goToIndustry()  { clearAutoAdvance(); hide('intro'); hide('quiz'); hide('results'); show('industry-screen'); buildIndustryTiles(); $('ind-next-btn').disabled = state.industry === null; }
  function goToQuiz()      { clearAutoAdvance(); hide('industry-screen'); hide('results'); show('quiz'); renderQuestion(); }
  function prevQuestion()  { clearAutoAdvance(); if (state.step === 0) goToIndustry(); else { state.step--; renderQuestion(); } }
  function nextQuestion()  {
    if (state.answers[state.step] === null) return;
    if (state.step < QUESTIONS.length - 1) { state.step++; renderQuestion(); }
    else finish();
  }
  function finish() {
    hide('quiz'); show('results');
    $('results').style.display = 'block';
    $('bar').style.width = '100%';
    $('progress-pct').textContent = '100%';
    // Widen container for two-column results layout
    const wrap = document.querySelector('.quiz-wrap');
    if (wrap) { wrap.style.maxWidth = '1440px'; wrap.style.padding = '0 32px'; }
    computeResults();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── EVENTS ───────────────────────────────────
  $('start-btn').addEventListener('click', goToIndustry);
  $('ind-back-btn').addEventListener('click', goToIntro);
  $('ind-next-btn').addEventListener('click', goToQuiz);
  $('back-btn').addEventListener('click', prevQuestion);
  $('next-btn').addEventListener('click', nextQuestion);
  $('retake-btn').addEventListener('click', () => {
    state.industry = null; state.industryLabel = ''; state.step = 0; state.answers.fill(null);
    // Reset container width
    const wrap = document.querySelector('.quiz-wrap');
    if (wrap) { wrap.style.maxWidth = ''; wrap.style.padding = ''; }
    hide('results'); goToIndustry();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Close tooltip chips on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.term-chip.open').forEach(c => c.classList.remove('open'));
  });

  // Plain English toggle (above the progress bar)
  const plainToggle = $('plain-toggle');
  if (plainToggle) {
    plainToggle.addEventListener('change', (e) => {
      state.plainMode = e.target.checked;
      // Re-render only if we're on a question
      if ($('quiz').style.display !== 'none') renderQuestion();
    });
  }

  // Results view toggle (Business / Technical) — re-renders tier message
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if (view === state.resultsView) return;
      state.resultsView = view;
      document.querySelectorAll('.view-btn').forEach(b => b.classList.toggle('active', b === btn));
      if (state.currentTier) {
        $('tier-msg').textContent = TIER_MESSAGES[state.currentTier][state.resultsView];
      }
    });
  });

  // Init: populate industry tiles on page load (industry screen is visible by default)
  buildIndustryTiles();

})();
