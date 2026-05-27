import { Document, Page, Text, View, StyleSheet, Svg, Circle, Path, Link } from '@react-pdf/renderer';
import type { Tier, DomainScore, IndustryId, ResultsView, Environment, OrgSize } from '../types';
import { TIER_MESSAGES, TIER_CTA } from '../data/tierMessages';
import { TIER_THREATS } from '../data/threats';
import { STACK_COPY, type StackKey } from '../data/stacks';
import { INDUSTRIES } from '../data/industries';
import type { ScoredCapability, Tier as ArchTier } from '../architecture/lib/types';
import type { AdvisoryItem } from '../architecture/lib/advisory';

interface Props {
  overall: number;
  tier: Tier;
  industry: IndustryId;
  environment: Environment;
  orgSize: OrgSize;
  domainScores: DomainScore[];
  picks: StackKey[];
  view: ResultsView;
  generatedOn: string;
  archModules: ScoredCapability[];
  archAdvisory: AdvisoryItem[];
  archRegulations: string[];
  archTierLabel: ArchTier;
}

const ENV_LABEL: Record<Environment, string> = { on_prem: 'On-premises', hybrid: 'Hybrid', multi_cloud: 'Cloud-first' };
const SIZE_LABEL: Record<OrgSize, string> = { small: 'Under 500', mid: '500 to 2,000', large: '2,000 to 10,000', xlarge: '10,000+' };
const ARCH_TIER_LABEL: Record<ArchTier, string> = { starter: 'Starter', standard: 'Standard', advanced: 'Advanced' };

// ── Palette: red + grey ────────────────────────────────
const RED       = '#c81010';
const RED_DEEP  = '#8a0a0a';
const RED_SOFT  = '#fbe2e2';
const RED_LINE  = '#f0b8b8';

const INK       = '#1a1f2a';   // near-black
const GREY_900  = '#374150';   // primary grey
const GREY_700  = '#5b6472';
const GREY_500  = '#8a929e';
const GREY_300  = '#c8ccd3';
const GREY_200  = '#dde0e6';
const GREY_100  = '#eef0f3';
const GREY_50   = '#f6f7f9';
const WHITE     = '#ffffff';

const tierColours: Record<Tier, { bg: string; fg: string; border: string }> = {
  Basic:       { bg: RED_SOFT,  fg: RED_DEEP,   border: RED_LINE },
  Developing:  { bg: '#fbeac8', fg: '#8a5a00',  border: '#ecd297' },
  Established: { bg: '#d4eef5', fg: '#01627f',  border: '#a0d8e8' },
  Advanced:    { bg: '#d4eedc', fg: '#136a35',  border: '#a4d6b3' },
};

const STATUS_STYLE: Record<string, { bg: string; border: string; fg: string; label: string }> = {
  foundational: { bg: RED_SOFT, border: RED_LINE, fg: RED,    label: 'CORE' },
  mandated:     { bg: GREY_100, border: GREY_300, fg: GREY_900, label: 'REQ' },
  recommended:  { bg: WHITE,    border: GREY_300, fg: GREY_700, label: 'REC' },
};

const STATUS_EXPLAIN: Record<string, string> = {
  foundational: 'core control for your industry',
  mandated:     'mandated by a regulation that applies to you',
  recommended:  'matched to your concerns and environment',
};

const s = StyleSheet.create({
  // ── Page base ─────────────────────────────────────────
  page: {
    paddingTop: 72, paddingBottom: 64, paddingHorizontal: 52,
    fontFamily: 'Helvetica', fontSize: 10, color: INK, lineHeight: 1.5,
  },
  pageWide: {
    paddingTop: 0, paddingBottom: 0, paddingHorizontal: 0,
    fontFamily: 'Helvetica', color: INK,
  },

  // ── Running header / footer ───────────────────────────
  runHead: {
    position: 'absolute', top: 28, left: 52, right: 52,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  runHeadBrand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  runHeadBrandText: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: GREY_900, letterSpacing: 0.2 },
  runHeadRight: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: GREY_500, letterSpacing: 1.4, textTransform: 'uppercase' },
  rule: { position: 'absolute', top: 52, left: 52, right: 52, height: 1, backgroundColor: GREY_200 },

  footer: {
    position: 'absolute', bottom: 28, left: 52, right: 52,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 10, borderTopWidth: 1, borderTopColor: GREY_200,
    fontSize: 7.5, color: GREY_500,
  },

  // ── Typography ────────────────────────────────────────
  eyebrow:  { fontFamily: 'Helvetica-Bold', fontSize: 8, color: RED, letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 10 },
  h1:       { fontFamily: 'Helvetica-Bold', fontSize: 30, color: INK, letterSpacing: -0.6, lineHeight: 1.1, marginBottom: 8 },
  h2:       { fontFamily: 'Helvetica-Bold', fontSize: 18, color: INK, letterSpacing: -0.3, lineHeight: 1.2, marginBottom: 8 },
  lede:     { fontSize: 11, color: GREY_700, lineHeight: 1.6, marginBottom: 24, maxWidth: 460 },
  body:     { fontSize: 10, color: GREY_900, lineHeight: 1.6 },

  section:  { fontFamily: 'Helvetica-Bold', fontSize: 8, color: GREY_500, letterSpacing: 1.6, textTransform: 'uppercase', marginBottom: 12, marginTop: 24, paddingBottom: 6, borderBottomWidth: 1, borderBottomColor: GREY_200 },

  // ── Cover page ────────────────────────────────────────
  cover: {
    flex: 1, flexDirection: 'column', padding: 56,
    backgroundColor: INK, color: WHITE, position: 'relative',
  },
  coverAccent: {
    position: 'absolute', top: 0, right: 0,
    width: 240, height: 240, backgroundColor: RED, opacity: 0.85,
  },
  coverAccentBottom: {
    position: 'absolute', bottom: 0, left: 0,
    width: 360, height: 6, backgroundColor: RED,
  },
  coverBrand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  coverBrandText: { fontFamily: 'Helvetica-Bold', fontSize: 16, color: WHITE, letterSpacing: -0.2 },
  coverBrandSub: { fontFamily: 'Helvetica', fontSize: 9, color: 'rgba(255,255,255,0.65)' },
  coverSpacer: { flex: 1 },
  coverEyebrow: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#ff7a7a', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 16 },
  coverTitle: { fontFamily: 'Helvetica-Bold', fontSize: 44, color: WHITE, letterSpacing: -1.2, lineHeight: 1.05, marginBottom: 14 },
  coverSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', maxWidth: 380, lineHeight: 1.55, marginBottom: 36 },
  coverMetaRow: { flexDirection: 'row', gap: 36, marginTop: 36, paddingTop: 22, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
  coverMetaLabel: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 4 },
  coverMetaValue: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: WHITE },

  // ── Section-divider page ──────────────────────────────
  divider: {
    flex: 1, flexDirection: 'column', justifyContent: 'flex-end',
    padding: 56, backgroundColor: GREY_50, position: 'relative',
  },
  dividerBar: {
    position: 'absolute', top: 0, left: 0, width: 8, height: '100%',
    backgroundColor: RED,
  },
  dividerNum: { fontFamily: 'Helvetica-Bold', fontSize: 110, color: RED, lineHeight: 1, letterSpacing: -3, marginBottom: 6 },
  dividerLabel: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: GREY_500, letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 12 },
  dividerTitle: { fontFamily: 'Helvetica-Bold', fontSize: 34, color: INK, letterSpacing: -0.6, lineHeight: 1.1, marginBottom: 14, maxWidth: 460 },
  dividerLede: { fontSize: 11.5, color: GREY_700, lineHeight: 1.6, maxWidth: 440, marginBottom: 56 },

  // ── Contents ──────────────────────────────────────────
  tocRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: GREY_200, gap: 12 },
  tocNum: { width: 34, fontFamily: 'Helvetica-Bold', fontSize: 14, color: RED, lineHeight: 1.2 },
  tocBody: { flex: 1, flexDirection: 'column' },
  tocTitle: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: INK, lineHeight: 1.2, marginBottom: 3 },
  tocDesc: { fontSize: 9.5, color: GREY_500, lineHeight: 1.4 },
  tocPage: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: GREY_500, lineHeight: 1.2 },

  // ── Hero score ────────────────────────────────────────
  hero: { flexDirection: 'row', backgroundColor: GREY_50, borderRadius: 8, padding: 24, gap: 28, alignItems: 'center', marginBottom: 8 },
  scoreSlot: { width: 140, height: 140, position: 'relative' },
  scoreOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  scoreBig: { fontFamily: 'Helvetica-Bold', fontSize: 38, color: INK, lineHeight: 1 },
  scoreOf: { fontFamily: 'Helvetica', fontSize: 8.5, color: GREY_500, marginTop: 4 },
  scoreSide: { flex: 1 },
  tierPill: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, fontFamily: 'Helvetica-Bold', fontSize: 8.5, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 },
  tierMsg: { fontSize: 11, color: GREY_900, lineHeight: 1.6 },

  // ── Stat callouts (executive summary) ─────────────────
  statBox: { flexDirection: 'row', marginTop: 18, borderWidth: 1, borderColor: GREY_200, borderRadius: 10, backgroundColor: WHITE, overflow: 'hidden' },
  statCol: { flex: 1, flexDirection: 'column', padding: 18 },
  statColDivider: { width: 1, backgroundColor: GREY_200 },
  statNum: { fontFamily: 'Helvetica-Bold', fontSize: 28, color: RED, lineHeight: 1.1, marginBottom: 8 },
  statLabel: { fontSize: 9, color: GREY_700, lineHeight: 1.45 },

  // ── Priorities ────────────────────────────────────────
  pRow: { flexDirection: 'row', padding: 14, marginBottom: 8, gap: 14, backgroundColor: WHITE, borderWidth: 1, borderColor: GREY_200, borderRadius: 8 },
  pNum: { width: 28, height: 28, borderRadius: 6, backgroundColor: INK, color: WHITE, fontFamily: 'Helvetica-Bold', fontSize: 13, textAlign: 'center', paddingTop: 6 },
  pTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: INK, marginBottom: 3 },
  pDesc: { fontSize: 9, color: GREY_700, lineHeight: 1.5 },

  // ── Two col ───────────────────────────────────────────
  twoCol: { flexDirection: 'row', gap: 24 },
  col: { flex: 1 },

  // ── Threats ───────────────────────────────────────────
  tRow: { backgroundColor: GREY_50, borderLeftWidth: 3, borderLeftColor: RED, padding: 11, marginBottom: 7 },
  tName: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: INK, marginBottom: 2 },
  tDesc: { fontSize: 8.5, color: GREY_700, lineHeight: 1.5 },

  // ── Domain bars ───────────────────────────────────────
  dRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  dName: { width: 110, fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: INK },
  dBarBg: { flex: 1, height: 6, backgroundColor: GREY_200, borderRadius: 3 },
  dBarFg: { height: 6, backgroundColor: RED, borderRadius: 3 },
  dPct: { width: 28, textAlign: 'right', fontSize: 10, fontFamily: 'Helvetica-Bold', color: INK },

  // ── Regulation pills ──────────────────────────────────
  regPill: { paddingVertical: 5, paddingHorizontal: 11, borderRadius: 999, borderWidth: 1, fontSize: 9, fontFamily: 'Helvetica-Bold', backgroundColor: RED_SOFT, color: RED_DEEP, borderColor: RED_LINE },

  // ── Architecture modules ──────────────────────────────
  bucket: { marginBottom: 16 },
  bucketLabel: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: GREY_900, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: GREY_200 },
  modGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  modChip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1 },
  modName: { fontFamily: 'Helvetica-Bold', fontSize: 9.5, color: INK },
  modBadge: { fontFamily: 'Helvetica-Bold', fontSize: 7, color: WHITE, paddingVertical: 2, paddingHorizontal: 4, borderRadius: 3, letterSpacing: 0.6 },

  legendCard: { borderWidth: 1, borderColor: GREY_200, borderRadius: 8, padding: 14, marginBottom: 20, backgroundColor: GREY_50 },
  legendTitle: { fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: GREY_500, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7, width: '47%' },
  legendSwatch: { width: 12, height: 12, borderRadius: 3, borderWidth: 1 },
  legendText: { flex: 1, fontSize: 9, color: GREY_700, lineHeight: 1.4 },
  legendLabel: { fontFamily: 'Helvetica-Bold' },

  advRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  advPill: { paddingVertical: 6, paddingHorizontal: 11, borderRadius: 6, borderWidth: 1, borderColor: GREY_300, backgroundColor: GREY_100, fontSize: 9.5, color: GREY_900, fontFamily: 'Helvetica-Bold' },

  // ── Pull quote ────────────────────────────────────────
  pullQuote: { paddingLeft: 18, borderLeftWidth: 3, borderLeftColor: RED, marginVertical: 18 },
  pullQuoteText: { fontFamily: 'Helvetica-Oblique', fontSize: 14, color: INK, lineHeight: 1.4 },

  // ── Plan timeline ─────────────────────────────────────
  planRow: { flexDirection: 'row', marginBottom: 16, gap: 16 },
  planTime: { width: 90, fontFamily: 'Helvetica-Bold', fontSize: 9, color: RED, letterSpacing: 1.2, textTransform: 'uppercase', paddingTop: 2 },
  planBody: { flex: 1, paddingLeft: 16, borderLeftWidth: 2, borderLeftColor: GREY_200 },
  planTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: INK, marginBottom: 4 },
  planText: { fontSize: 9.5, color: GREY_700, lineHeight: 1.55 },

  // ── CTA closing page ──────────────────────────────────
  closing: { flex: 1, padding: 56, backgroundColor: INK, color: WHITE, position: 'relative' },
  closingAccent: { position: 'absolute', top: 0, left: 0, width: '100%', height: 6, backgroundColor: RED },
  closingEyebrow: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: '#ff7a7a', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 18 },
  closingTitle: { fontFamily: 'Helvetica-Bold', fontSize: 32, color: WHITE, lineHeight: 1.15, letterSpacing: -0.6, marginBottom: 16, maxWidth: 460 },
  closingBody: { fontSize: 12, color: 'rgba(255,255,255,0.78)', lineHeight: 1.6, maxWidth: 440, marginBottom: 28 },
  ctaButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: RED, paddingVertical: 12, paddingHorizontal: 22, borderRadius: 8, marginBottom: 40, textDecoration: 'none' },
  ctaButtonText: { fontFamily: 'Helvetica-Bold', fontSize: 12, color: WHITE, letterSpacing: 0.2 },
  closingMetaRow: { flexDirection: 'row', gap: 36, marginTop: 'auto', paddingTop: 22, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.18)' },
});

// ── Helpers ────────────────────────────────────────────
function ScoreRing({ pct, size = 140 }: { pct: number; size?: number }) {
  const r = (size / 2) - 9;
  const c = 2 * Math.PI * r;
  const arc = c * Math.max(0, Math.min(100, pct)) / 100;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={GREY_200} strokeWidth={9} fill="none" />
      <Circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={RED} strokeWidth={9} fill="none" strokeLinecap="round"
        strokeDasharray={`${arc} ${c - arc}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}

function Swirl({ light }: { light?: boolean }) {
  return (
    <Svg width={22} height={20} viewBox="-3 -1 38 36">
      <Path
        d="M26.8579 18.1642C28.6391 13.6341 27.182 11.3886 23.9345 11.3694C18.7194 11.3386 13.4921 16.8976 8.82871 18.5241C4.57341 20.0083 1.14017 19.4118 0.183261 16.125C-2.52249 6.83122 25.5117 -8.99114 32.9162 6.52823C38.5187 18.5701 21.101 33.7804 10.4054 33.9983C1.88039 34.1719 7.20724 21.1513 13.2564 21.1715C14.6658 21.1762 16.0829 21.7293 16.1767 23.1336C16.2699 24.5265 14.5761 25.6947 13.2488 26.9529C10.9996 29.0848 10.3498 30.638 10.9553 31.377C11.5609 32.116 13.449 31.9728 16.6564 29.8147C21.808 26.3485 25.2272 22.3243 26.8579 18.1642Z"
        fill={light ? WHITE : GREY_900}
      />
    </Svg>
  );
}

function RunningHeader({ label }: { label: string }) {
  return (
    <>
      <View style={s.runHead} fixed>
        <View style={s.runHeadBrand}>
          <Swirl />
          <Text style={s.runHeadBrandText}>Airtel Secure · Readiness Check</Text>
        </View>
        <Text style={s.runHeadRight}>{label}</Text>
      </View>
      <View style={s.rule} fixed />
    </>
  );
}

function PageFooter() {
  return (
    <View style={s.footer} fixed>
      <Text>© Bharti Airtel Limited · Airtel Secure</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} of ${totalPages}`} />
    </View>
  );
}

const BUCKET_ORDER = ['network_security', 'secure_workforce', 'secure_workload', 'managed_services'];
const BUCKET_LABEL: Record<string, string> = {
  network_security: 'Network security',
  secure_workforce: 'Secure workforce',
  secure_workload:  'Secure workload',
  managed_services: 'Managed services',
};

function planForTier(tier: Tier): Array<{ when: string; title: string; text: string }> {
  if (tier === 'Basic' || tier === 'Developing') {
    return [
      { when: 'Days 1-30',  title: 'Close the front door',        text: 'Stand up MFA for all admins and high-risk users. Roll out EDR on every endpoint. Establish an incident hotline.' },
      { when: 'Days 31-60', title: 'See what is happening',       text: 'Aggregate logs into a SIEM or managed SOC. Get baseline detection rules live. Run a tabletop incident exercise.' },
      { when: 'Days 61-90', title: 'Reduce attack surface',       text: 'Move user access behind ZTNA. Enforce email security with DMARC and inbound filtering. Patch the perimeter.' },
    ];
  }
  if (tier === 'Established') {
    return [
      { when: 'Days 1-30',  title: 'Compress response time',      text: 'Move from SIEM-only to managed XDR or MDR with AI-assisted triage. Set hard MTTD and MTTR targets.' },
      { when: 'Days 31-60', title: 'Extend zero-trust',           text: 'Apply zero-trust beyond identity into workloads and APIs. Enforce micro-segmentation in the cloud estate.' },
      { when: 'Days 61-90', title: 'Validate continuously',       text: 'Engage a red team on retainer. Run continuous adversary emulation. Tune detections against your real exposure.' },
    ];
  }
  return [
    { when: 'Days 1-30',  title: 'Stress-test resilience',         text: 'Run adversary emulation against your top three crown-jewel scenarios. Audit ransomware recovery against a real clock.' },
    { when: 'Days 31-60', title: 'Lock down the supply chain',    text: 'Map third-party access, enforce risk-based monitoring on top tier vendors, validate SBOM integrity on critical software.' },
    { when: 'Days 61-90', title: 'Operationalise AI security',    text: 'Stand up AI/ML threat modelling for your own deployments. Apply policy to staff use of public AI tools.' },
  ];
}

// ── Document ───────────────────────────────────────────
export function ReportPDF({
  overall, tier, industry, environment, orgSize, domainScores, picks, view, generatedOn,
  archModules, archAdvisory, archRegulations, archTierLabel,
}: Props) {
  const tc = tierColours[tier];
  const tierMsg = TIER_MESSAGES[tier][view];
  const cta = TIER_CTA[tier];
  const threats = TIER_THREATS[tier];
  const sortedDomains = [...domainScores].sort((a, b) => a.pct - b.pct);
  const weakestDomain = sortedDomains[0];
  const industryName = INDUSTRIES.find(i => i.id === industry)?.label ?? 'your organisation';
  const plan = planForTier(tier);

  const modulesByBucket = BUCKET_ORDER
    .map(b => ({ bucket: b, mods: archModules.filter(m => m.bucket === b) }))
    .filter(g => g.mods.length > 0);

  const toc = [
    { n: '01', title: 'Executive summary',          desc: 'Your score, tier verdict, and headline numbers',          page: '03' },
    { n: '02', title: 'Risk profile',               desc: 'Threats, domain breakdown, regulatory pressure',         page: '05' },
    { n: '03', title: 'Recommended architecture',   desc: 'Modules grouped by control bucket',                       page: '07' },
    { n: '04', title: '90-day plan',                desc: 'A sequenced path to your next maturity tier',             page: '09' },
  ];

  return (
    <Document title={`Airtel Secure Readiness Check · ${tier}`} author="Airtel Secure">

      {/* ─── Page 1 · Cover ─── */}
      <Page size="A4" style={s.pageWide}>
        <View style={s.cover}>
          <View style={s.coverAccent} />
          <View style={s.coverAccentBottom} />

          <View style={s.coverBrand}>
            <Swirl light />
            <View>
              <Text style={s.coverBrandText}>Airtel Secure</Text>
              <Text style={s.coverBrandSub}>Readiness Check</Text>
            </View>
          </View>

          <View style={s.coverSpacer} />

          <Text style={s.coverEyebrow}>Confidential · Prepared for {industryName}</Text>
          <Text style={s.coverTitle}>Your security{'\n'}readiness check</Text>
          <Text style={s.coverSubtitle}>
            A point-in-time view of how prepared you are across seven security domains,
            with a sequenced 90-day plan grounded in your industry and environment.
          </Text>

          <View style={s.coverMetaRow}>
            <View>
              <Text style={s.coverMetaLabel}>Score</Text>
              <Text style={s.coverMetaValue}>{overall} / 100</Text>
            </View>
            <View>
              <Text style={s.coverMetaLabel}>Tier</Text>
              <Text style={s.coverMetaValue}>{tier}</Text>
            </View>
            <View>
              <Text style={s.coverMetaLabel}>Industry</Text>
              <Text style={s.coverMetaValue}>{industryName}</Text>
            </View>
            <View>
              <Text style={s.coverMetaLabel}>Generated</Text>
              <Text style={s.coverMetaValue}>{generatedOn}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* ─── Page 2 · Contents ─── */}
      <Page size="A4" style={s.page}>
        <RunningHeader label="Contents" />

        <Text style={s.eyebrow}>What is inside</Text>
        <Text style={s.h1}>Contents</Text>
        <Text style={s.lede}>
          Four sections. Read the first one if you only have two minutes. Read the rest
          when you want the workings.
        </Text>

        {toc.map(t => (
          <View key={t.n} style={s.tocRow}>
            <Text style={s.tocNum}>{t.n}</Text>
            <View style={s.tocBody}>
              <Text style={s.tocTitle}>{t.title}</Text>
              <Text style={s.tocDesc}>{t.desc}</Text>
            </View>
            <Text style={s.tocPage}>p {t.page}</Text>
          </View>
        ))}

        <PageFooter />
      </Page>

      {/* ─── Page 3 · Divider 01 ─── */}
      <Page size="A4" style={s.pageWide}>
        <View style={s.divider}>
          <View style={s.dividerBar} />
          <Text style={s.dividerNum}>01</Text>
          <Text style={s.dividerLabel}>Section one</Text>
          <Text style={s.dividerTitle}>Executive summary</Text>
          <Text style={s.dividerLede}>
            One score, one tier, and the three priorities that matter most for the next quarter.
          </Text>
        </View>
      </Page>

      {/* ─── Page 4 · Executive summary ─── */}
      <Page size="A4" style={s.page}>
        <RunningHeader label="01 · Executive summary" />

        <Text style={s.eyebrow}>The headline</Text>
        <Text style={s.h1}>Where you stand today</Text>

        <View style={s.hero}>
          <View style={s.scoreSlot}>
            <ScoreRing pct={overall} />
            <View style={s.scoreOverlay}>
              <Text style={s.scoreBig}>{overall}</Text>
              <Text style={s.scoreOf}>out of 100</Text>
            </View>
          </View>
          <View style={s.scoreSide}>
            <Text style={[s.tierPill, { backgroundColor: tc.bg, color: tc.fg, borderColor: tc.border }]}>{tier}</Text>
            <Text style={s.tierMsg}>{tierMsg}</Text>
          </View>
        </View>

        <View style={s.statBox}>
          <View style={s.statCol}>
            <Text style={s.statNum}>{threats.length}</Text>
            <Text style={s.statLabel}>Top threats matched to your tier and industry</Text>
          </View>
          <View style={s.statColDivider} />
          <View style={s.statCol}>
            <Text style={s.statNum}>{archRegulations.length}</Text>
            <Text style={s.statLabel}>Regulatory frameworks that apply to you</Text>
          </View>
          <View style={s.statColDivider} />
          <View style={s.statCol}>
            <Text style={s.statNum}>{weakestDomain?.pct ?? 0}</Text>
            <Text style={s.statLabel}>Lowest domain: {weakestDomain?.name ?? 'unmeasured'}</Text>
          </View>
        </View>

        <Text style={s.section}>The three priorities that close the most risk</Text>
        {picks.slice(0, 3).map((key, i) => {
          const r = STACK_COPY[key];
          return (
            <View key={key} style={s.pRow}>
              <Text style={s.pNum}>{i + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.pTitle}>{r.title}</Text>
                <Text style={s.pDesc}>{r.desc}</Text>
              </View>
            </View>
          );
        })}

        <PageFooter />
      </Page>

      {/* ─── Page 5 · Divider 02 ─── */}
      <Page size="A4" style={s.pageWide}>
        <View style={s.divider}>
          <View style={s.dividerBar} />
          <Text style={s.dividerNum}>02</Text>
          <Text style={s.dividerLabel}>Section two</Text>
          <Text style={s.dividerTitle}>Risk profile</Text>
          <Text style={s.dividerLede}>
            Where you are most exposed: the threats your tier attracts, the domains
            where you score lowest, and the regulations watching you.
          </Text>
        </View>
      </Page>

      {/* ─── Page 6 · Risk profile ─── */}
      <Page size="A4" style={s.page}>
        <RunningHeader label="02 · Risk profile" />

        <Text style={s.eyebrow}>Threat and gap analysis</Text>
        <Text style={s.h1}>Where you are exposed</Text>
        <Text style={s.lede}>
          A {tier.toLowerCase()} posture in {industryName} translates to a specific attack
          surface. Here is what that looks like.
        </Text>

        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.section}>Threats you face</Text>
            {threats.map(t => (
              <View key={t.name} style={s.tRow}>
                <Text style={s.tName}>{t.name}</Text>
                <Text style={s.tDesc}>{t.desc}</Text>
              </View>
            ))}
          </View>

          <View style={s.col}>
            <Text style={s.section}>Domain breakdown</Text>
            {sortedDomains.map(d => (
              <View key={d.name} style={s.dRow}>
                <Text style={s.dName}>{d.name}</Text>
                <View style={s.dBarBg}>
                  <View style={[s.dBarFg, { width: `${d.pct}%` }]} />
                </View>
                <Text style={s.dPct}>{d.pct}</Text>
              </View>
            ))}
          </View>
        </View>

        {archRegulations.length > 0 && (
          <>
            <Text style={s.section}>Regulations that apply to you</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {archRegulations.map(r => (
                <Text key={r} style={s.regPill}>{r}</Text>
              ))}
            </View>
          </>
        )}

        <View style={s.pullQuote}>
          <Text style={s.pullQuoteText}>
            "Your weakest domain is {weakestDomain?.name ?? 'unmeasured'} at {weakestDomain?.pct ?? 0}/100. That is where an attacker will look first."
          </Text>
        </View>

        <PageFooter />
      </Page>

      {/* ─── Page 7 · Divider 03 ─── */}
      <Page size="A4" style={s.pageWide}>
        <View style={s.divider}>
          <View style={s.dividerBar} />
          <Text style={s.dividerNum}>03</Text>
          <Text style={s.dividerLabel}>Section three</Text>
          <Text style={s.dividerTitle}>Recommended architecture</Text>
          <Text style={s.dividerLede}>
            The {ARCH_TIER_LABEL[archTierLabel].toLowerCase()} blueprint: {archModules.length} modules
            and {archAdvisory.length} advisory engagements, sized for your environment.
          </Text>
        </View>
      </Page>

      {/* ─── Page 8 · Architecture ─── */}
      <Page size="A4" style={s.page}>
        <RunningHeader label={`03 · Architecture · ${ARCH_TIER_LABEL[archTierLabel]}`} />

        <Text style={s.eyebrow}>Your blueprint</Text>
        <Text style={s.h1}>Modules to deploy</Text>
        <Text style={s.lede}>
          Sized for {SIZE_LABEL[orgSize]} users on an {ENV_LABEL[environment].toLowerCase()}{' '}
          estate. Modules are tagged by why they are in your stack.
        </Text>

        <View style={s.legendCard}>
          <Text style={s.legendTitle}>How to read this blueprint</Text>
          <View style={s.legendGrid}>
            <View style={s.legendItem}>
              <View style={[s.legendSwatch, { backgroundColor: STATUS_STYLE.foundational.bg, borderColor: STATUS_STYLE.foundational.border }]} />
              <Text style={s.legendText}>
                <Text style={[s.legendLabel, { color: STATUS_STYLE.foundational.fg }]}>CORE · Foundational</Text>
                {'\n'}Core control for your industry. Force-included.
              </Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendSwatch, { backgroundColor: STATUS_STYLE.mandated.bg, borderColor: STATUS_STYLE.mandated.border }]} />
              <Text style={s.legendText}>
                <Text style={[s.legendLabel, { color: STATUS_STYLE.mandated.fg }]}>REQ · Required</Text>
                {'\n'}Mandated by a regulation that applies to you.
              </Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendSwatch, { backgroundColor: STATUS_STYLE.recommended.bg, borderColor: STATUS_STYLE.recommended.border }]} />
              <Text style={s.legendText}>
                <Text style={[s.legendLabel, { color: STATUS_STYLE.recommended.fg }]}>REC · Recommended</Text>
                {'\n'}Matched to your concerns and environment.
              </Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendSwatch, { backgroundColor: WHITE, borderColor: GREY_300, borderStyle: 'dashed' }]} />
              <Text style={s.legendText}>
                <Text style={[s.legendLabel, { color: GREY_700 }]}>Future-state</Text>
                {'\n'}Becomes relevant as you scale.
              </Text>
            </View>
          </View>
        </View>

        {modulesByBucket.map(({ bucket, mods }) => (
          <View key={bucket} style={s.bucket} wrap={false}>
            <Text style={s.bucketLabel}>{BUCKET_LABEL[bucket]}</Text>
            <View style={s.modGrid}>
              {mods.map(m => {
                const style = STATUS_STYLE[m.status] ?? STATUS_STYLE.recommended;
                return (
                  <View key={m.id} style={[s.modChip, { backgroundColor: style.bg, borderColor: style.border }]}>
                    <Text style={s.modName}>{m.name}</Text>
                    <Text style={[s.modBadge, { backgroundColor: style.fg }]}>{style.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {archAdvisory.length > 0 && (
          <>
            <Text style={s.section}>Advisory engagements</Text>
            <View style={s.advRow}>
              {archAdvisory.map(a => (
                <Text key={a.id} style={s.advPill}>{a.name}</Text>
              ))}
            </View>
          </>
        )}

        <PageFooter />
      </Page>

      {/* ─── Page 9 · Divider 04 ─── */}
      <Page size="A4" style={s.pageWide}>
        <View style={s.divider}>
          <View style={s.dividerBar} />
          <Text style={s.dividerNum}>04</Text>
          <Text style={s.dividerLabel}>Section four</Text>
          <Text style={s.dividerTitle}>The 90-day plan</Text>
          <Text style={s.dividerLede}>
            What to do, in what order, to move from where you are to the next tier of maturity.
          </Text>
        </View>
      </Page>

      {/* ─── Page 10 · 90-day plan ─── */}
      <Page size="A4" style={s.page}>
        <RunningHeader label="04 · 90-day plan" />

        <Text style={s.eyebrow}>From here to the next tier</Text>
        <Text style={s.h1}>Your 90-day plan</Text>
        <Text style={s.lede}>
          A sequenced path. Each phase compounds on the last, and each is sized to be
          done by a typical security team without doubling headcount.
        </Text>

        {plan.map((p, i) => (
          <View key={i} style={s.planRow} wrap={false}>
            <Text style={s.planTime}>{p.when}</Text>
            <View style={s.planBody}>
              <Text style={s.planTitle}>{p.title}</Text>
              <Text style={s.planText}>{p.text}</Text>
            </View>
          </View>
        ))}

        <PageFooter />
      </Page>

      {/* ─── Page 11 · Closing CTA ─── */}
      <Page size="A4" style={s.pageWide}>
        <View style={s.closing}>
          <View style={s.closingAccent} />

          <View style={[s.coverBrand, { marginBottom: 80 }]}>
            <Swirl light />
            <View>
              <Text style={s.coverBrandText}>Airtel Secure</Text>
              <Text style={s.coverBrandSub}>Readiness Check</Text>
            </View>
          </View>

          <Text style={s.closingEyebrow}>What is next</Text>
          <Text style={s.closingTitle}>{cta.title}</Text>
          <Text style={s.closingBody}>{cta.body}</Text>
          <Link src="https://www.airtel.in/b2b/contact-us" style={s.ctaButton}>
            <Text style={s.ctaButtonText}>Talk to an Airtel Secure expert  →</Text>
          </Link>

          <View style={s.closingMetaRow}>
            <View>
              <Text style={s.coverMetaLabel}>Your score</Text>
              <Text style={s.coverMetaValue}>{overall} / 100 · {tier}</Text>
            </View>
            <View>
              <Text style={s.coverMetaLabel}>Generated</Text>
              <Text style={s.coverMetaValue}>{generatedOn}</Text>
            </View>
            <View>
              <Text style={s.coverMetaLabel}>For</Text>
              <Text style={s.coverMetaValue}>{industryName}</Text>
            </View>
          </View>
        </View>
      </Page>

    </Document>
  );
}
