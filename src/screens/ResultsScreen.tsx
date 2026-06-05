import { useEffect, useRef, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { IndustryId, ResultsView, Environment, OrgSize } from '../types';
import { computeScores } from '../lib/scoring';
import { buildRecommendations } from '../lib/recommendations';
import { tierToConcerns, tierToArchitectureMaturity } from '../lib/bridge';
import { TIER_MESSAGES, TIER_CTA } from '../data/tierMessages';
import { TIER_THREATS } from '../data/threats';
import { INDUSTRIES } from '../data/industries';
import { ScoreRing } from '../components/ScoreRing';
import { DomainBars } from '../components/DomainBars';
import { ThreatList } from '../components/ThreatList';
import { RecommendationList } from '../components/RecommendationList';
import { useAuth } from '../lib/auth';
import { saveAssessment } from '../lib/assessments';

// Architecture engine + display
import capabilitiesData from '../architecture/data/capabilities.json';
import regulationsData from '../architecture/data/regulations.json';
import type {
  Capability as ArchCapability,
  ScoredCapability as ArchScoredCapability,
  Tier as ArchTier,
  UserInputs as ArchUserInputs,
} from '../architecture/lib/types';
import { scoreCapability, buildTiers } from '../architecture/lib/scoring';
import { computeAdvisory } from '../architecture/lib/advisory';
import { generateNarrative } from '../architecture/lib/narrative';
import Diagram from '../architecture/components/Diagram';
import TierToggle from '../architecture/components/TierToggle';
import NarrativeSummary from '../architecture/components/NarrativeSummary';

const capabilities = capabilitiesData as ArchCapability[];
const regulations  = regulationsData  as Record<string, string[]>;

const ENV_LABEL: Record<Environment, string> = {
  on_prem: 'On-premises', hybrid: 'Hybrid', multi_cloud: 'Cloud-first',
};
const SIZE_LABEL: Record<OrgSize, string> = {
  small: 'Under 500 users', mid: '500–2,000 users', large: '2,000–10,000 users', xlarge: '10,000+ users',
};

type ResultTab = 'maturity' | 'architecture';

interface Props {
  answers: (number | null)[];
  industry: IndustryId;
  environment: Environment;
  orgSize: OrgSize;
  onRetake: () => void;
  /** True when viewing a saved assessment from history (skip auto-save). */
  isViewingHistorical?: boolean;
}

// ── Premium components ────────────────────────────────
function ContextPill({ label, accent = false }: { label: string; accent?: boolean }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[0.75rem] font-medium ${
      accent ? 'bg-airtel-red-light text-airtel-red border border-airtel-red/15' : 'bg-bg-secondary text-ink-sub border border-border'
    }`}>
      {label}
    </span>
  );
}

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-border shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );
}

function CardLabel({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-7 bg-airtel-red rounded-full" />
      <div>
        {eyebrow && <div className="text-[0.68rem] font-bold text-ink-light uppercase tracking-widest">{eyebrow}</div>}
        <h3 className="text-[1.02rem] font-bold text-ink-dark tracking-tight leading-tight">{title}</h3>
      </div>
    </div>
  );
}

// ── ResultsScreen ─────────────────────────────────────
export function ResultsScreen({ answers, industry, environment, orgSize, onRetake, isViewingHistorical = false }: Props) {
  const { session } = useAuth();
  const [tab, setTab]     = useState<ResultTab>('maturity');
  const view: ResultsView = 'technical';
  const [downloading, setDownloading] = useState(false);
  const [downloadPromptOpen, setDownloadPromptOpen] = useState(!isViewingHistorical);

  // ── Maturity computation ────────────────
  const { domainScores, overall, tier } = useMemo(
    () => computeScores(answers, industry),
    [answers, industry],
  );
  const picks   = useMemo(
    () => buildRecommendations(domainScores, overall, industry, tier),
    [domainScores, overall, industry, tier],
  );
  const threats = TIER_THREATS[tier];
  const cta     = TIER_CTA[tier];

  function personalisedCtaTitle(): string {
    if (tier === 'Basic') {
      if (overall < 25) return `${overall}/100. A targeted phishing run ends your week. Let's fix that.`;
      return `${overall}/100 means an attacker walks in through the front door. Let's close it.`;
    }
    if (tier === 'Developing') return `${overall}/100. You're building momentum. Let's compress the timeline.`;
    if (tier === 'Established') {
      if (overall >= 75) return `${overall}/100 puts you in the top tier. You've earned the right to think bigger.`;
      return `${overall}/100 puts you ahead of most. Now it's about precision, not volume.`;
    }
    return `${overall}/100. Top decile. You don't need basics. You need a strategic resilience review.`;
  }
  const ctaTitle = personalisedCtaTitle();

  // ── Architecture computation (derived) ──
  const archInputs: ArchUserInputs = useMemo(() => ({
    environment,
    size: orgSize,
    industry,
    concerns: tierToConcerns(tier),
    maturity: tierToArchitectureMaturity(tier),
  }), [environment, orgSize, industry, tier]);

  const industryRegs = regulations[industry] ?? [];

  const scored: ArchScoredCapability[] = useMemo(
    () => capabilities.map(cap => scoreCapability(cap, archInputs, industryRegs)),
    [archInputs, industryRegs],
  );
  const { starter, standard, advanced, futureState } = useMemo(
    () => buildTiers(scored, orgSize),
    [scored, orgSize],
  );
  const advisoryItems = useMemo(
    () => computeAdvisory(archInputs, archInputs.maturity!, industryRegs, standard.length),
    [archInputs, industryRegs, standard.length],
  );

  const defaultArchTier: ArchTier =
    tier === 'Advanced' ? 'advanced'
    : tier === 'Established' ? 'standard'
    : 'starter';
  const [archTier, setArchTier]     = useState<ArchTier>(defaultArchTier);
  const showCompliance = true;
  const tierModules: Record<ArchTier, ArchScoredCapability[]> = { starter, standard, advanced };
  const activeModules = tierModules[archTier];
  const archCounts = { starter: starter.length, standard: standard.length, advanced: advanced.length + futureState.length };

  const narrative = useMemo(
    () => generateNarrative(archInputs, activeModules, advisoryItems, archTier, futureState, industryRegs),
    [archInputs, activeModules, advisoryItems, archTier, futureState, industryRegs],
  );

  const industryName = INDUSTRIES.find(i => i.id === industry)?.label ?? industry;

  // ── Auto-save assessment for logged-in users on first mount ────────
  const savedRef = useRef(false);
  useEffect(() => {
    if (isViewingHistorical) return;
    if (!session) return;
    if (savedRef.current) return;
    savedRef.current = true;
    saveAssessment({
      industry,
      environment,
      org_size: orgSize,
      answers,
      score: overall,
      tier,
      payload: {
        domainScores,
        picks,
        archTier: defaultArchTier,
      },
    }).then(({ error }) => {
      if (error) console.warn('[assessment save]', error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── PDF download ────────────────────────
  async function downloadReport() {
    if (downloading) return;
    setDownloading(true);
    try {
      const [{ pdf }, { ReportPDF }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../lib/ReportPDF'),
      ]);
      const generatedOn = new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
      const blob = await pdf(
        <ReportPDF
          overall={overall}
          tier={tier}
          industry={industry}
          environment={environment}
          orgSize={orgSize}
          domainScores={domainScores}
          picks={picks}
          view={view}
          generatedOn={generatedOn}
          archModules={activeModules}
          archAdvisory={advisoryItems}
          archRegulations={industryRegs}
          archTierLabel={archTier}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `airtel-secure-report-${tier.toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* ── HERO BLOCK ── */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-[1.85rem] font-bold text-ink-dark tracking-tight leading-tight">
            Your security posture report
          </h1>
          <p className="text-[0.88rem] text-ink-mute mt-1.5">
            {`${overall}/100 maturity score · ${threats.length} top threats identified · ${industryRegs.length} regulations apply`}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <ContextPill label={industryName} accent />
            <ContextPill label={ENV_LABEL[environment]} />
            <ContextPill label={SIZE_LABEL[orgSize]} />
            <ContextPill label={`${tier} maturity`} />
          </div>
        </div>

        <button
          onClick={downloadReport}
          disabled={downloading}
          className="inline-flex items-center gap-2 self-start lg:self-auto bg-white hover:bg-bg-secondary border border-border hover:border-airtel-navy text-ink-sub hover:text-ink-dark disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-[0.85rem] font-semibold transition-colors whitespace-nowrap shadow-sm flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {downloading ? 'Preparing PDF…' : 'Download report'}
        </button>
      </div>

      {/* ── TAB SELECTOR ── */}
      <div className="flex items-center bg-white border border-border rounded-xl p-1 shadow-sm self-start w-fit">
        {(['maturity', 'architecture'] as const).map(t => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-5 py-2 rounded-lg text-[0.85rem] font-semibold transition-colors whitespace-nowrap ${active ? 'text-white' : 'text-ink-sub hover:text-ink-dark'}`}
            >
              {active && (
                <motion.span
                  layoutId="result-tab-pill"
                  className="absolute inset-0 bg-airtel-red rounded-lg"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">
                {t === 'maturity' ? 'Maturity score' : 'Architecture blueprint'}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'maturity' ? (
          <motion.div
            key="maturity"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
              {/* LEFT col: Score + Threats + Regulations */}
              <div className="lg:sticky lg:top-20 space-y-6">
                {/* Score card */}
                <SectionCard>
                  <div className="text-center">
                    <span className="inline-block text-[0.7rem] font-bold uppercase tracking-widest text-airtel-red bg-airtel-red-light border border-airtel-red/20 rounded-full px-3 py-1 mb-4">
                      Your security maturity
                    </span>
                    <ScoreRing score={overall} size={170} />
                    <motion.div
                      key={tier}
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 25 }}
                      className={`inline-block px-4 py-1 rounded-full font-bold text-[0.78rem] uppercase tracking-wider mt-4 mb-3 tier-${tier}`}
                    >
                      {tier}
                    </motion.div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={`${tier}-${view}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22 }}
                        className="text-left text-[0.84rem] text-ink-sub leading-relaxed"
                      >
                        {TIER_MESSAGES[tier][view]}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  {/* Urgency CTA inside score card */}
                  <div className="mt-6 pt-5 border-t border-border">
                    <p className="text-[0.92rem] font-bold text-ink-dark tracking-tight leading-snug mb-3 text-left">
                      {ctaTitle}
                    </p>
                    <a
                      href="https://www.airtel.in/b2b/contact-us?utm_source=referral&utm_medium=bamboobox&utm_campaign=airtel+secure&utm_id=security+assessment"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-[0.88rem] px-4 py-2.5 rounded-lg transition-colors"
                    >
                      {cta.primary}
                    </a>
                  </div>
                </SectionCard>

                {/* Threats card */}
                <SectionCard>
                  <CardLabel eyebrow="Risk profile" title="Threats you're most exposed to" />
                  <ThreatList threats={threats} />
                </SectionCard>
              </div>

              {/* RIGHT col: Domain breakdown + Blueprint + Regulations */}
              <div className="space-y-6">
                <SectionCard>
                  <CardLabel eyebrow="Score detail" title="Domain breakdown" />
                  <DomainBars scores={domainScores} />
                </SectionCard>

                <SectionCard>
                  <CardLabel eyebrow="Your blueprint" title="Recommended Airtel Secure stacks" />
                  <RecommendationList picks={picks} />
                </SectionCard>

                {industryRegs.length > 0 && (
                  <SectionCard>
                    <CardLabel eyebrow="Compliance" title="Regulations that apply to you" />
                    <div className="flex flex-wrap gap-2">
                      {industryRegs.map(r => (
                        <span key={r} className="inline-flex items-center px-3 py-1 rounded-full text-[0.78rem] font-semibold bg-airtel-red-light text-airtel-red border border-airtel-red/20">
                          {r}
                        </span>
                      ))}
                    </div>
                  </SectionCard>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="architecture"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Title + counts + toggles row */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-ink-dark tracking-tight">
                  Your recommended security architecture
                </h2>
                <p className="text-[0.86rem] text-ink-mute mt-1.5">
                  {activeModules.length} modules · {advisoryItems.length} advisory engagements · {industryRegs.length} regulations covered
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <TierToggle active={archTier} onChange={setArchTier} counts={archCounts} />
              </div>
            </div>

            {/* Diagram card */}
            <SectionCard className="p-5 md:p-6">
              <Diagram
                activeModules={activeModules}
                futureState={archTier === 'advanced' ? futureState : []}
                advisoryItems={advisoryItems}
                tier={archTier}
                inputs={archInputs}
                showCompliance={showCompliance}
              />
            </SectionCard>

            {/* Narrative card */}
            <NarrativeSummary
              tier={archTier}
              intro={narrative.intro}
              moduleReasons={narrative.moduleReasons}
              regulationsCovered={narrative.regulationsCovered}
              growthPath={narrative.growthPath}
              advisoryCount={advisoryItems.length}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onRetake}
          className="text-[0.82rem] font-medium text-ink-mute hover:text-ink-dark underline-offset-4 hover:underline transition-colors"
        >
          Retake readiness check
        </button>
      </div>

      {/* Download-report prompt on results landing */}
      <AnimatePresence>
        {downloadPromptOpen && (
          <motion.div
            key="dl-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setDownloadPromptOpen(false)}
            className="fixed inset-0 z-[180] bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dl-prompt-title"
          >
            <motion.div
              key="dl-card"
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 350, damping: 32 }}
              onClick={e => e.stopPropagation()}
              className="relative bg-white w-full sm:max-w-[480px] sm:rounded-2xl rounded-t-2xl shadow-xl p-7 sm:p-8"
            >
              <button
                type="button"
                onClick={() => setDownloadPromptOpen(false)}
                aria-label="Close"
                className="absolute top-3.5 right-3.5 w-8 h-8 grid place-items-center rounded-full text-ink-mute hover:text-ink-dark hover:bg-bg-secondary transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>

              <div className="mx-auto w-12 h-12 rounded-full bg-airtel-red-light grid place-items-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-airtel-red" aria-hidden>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>

              <h3 id="dl-prompt-title" className="text-lg sm:text-xl font-bold text-ink-dark tracking-tight text-center mb-2">
                Download your full report?
              </h3>
              <p className="text-[0.88rem] text-ink-sub text-center leading-relaxed mb-4">
                Your posture report, recommended architecture, and tier-specific next steps. Saved as a PDF you can share with your team.
              </p>

              {overall < 50 && (
                <div className="mb-5 rounded-lg border border-airtel-red/30 bg-airtel-red-light px-3.5 py-2.5">
                  <p className="text-[0.82rem] leading-relaxed text-airtel-red">
                    <span className="font-bold">Your score is low.</span>{' '}
                    <span className="text-ink-dark">Don't wait on the PDF. Talk to an Airtel Secure expert and get the top 3 fixes locked in this week.</span>
                  </p>
                </div>
              )}

              {overall >= 80 && (
                <div className="mb-5 rounded-lg border border-airtel-navy/20 bg-airtel-navy/[0.04] px-3.5 py-2.5">
                  <p className="text-[0.82rem] leading-relaxed text-ink-dark">
                    <span className="font-bold text-airtel-navy">You're in the top decile.</span>{' '}
                    Skip the basics. Book a CISO advisory call with our senior practitioners on adversary emulation, supply-chain risk, and AI security.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href="https://www.airtel.in/b2b/contact-us?utm_source=referral&utm_medium=bamboobox&utm_campaign=airtel+secure&utm_id=security+assessment"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setDownloadPromptOpen(false)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-airtel-navy bg-white hover:bg-bg-secondary text-airtel-navy font-semibold text-[0.86rem] transition-colors"
                >
                  {overall >= 80 ? 'Book advisory call' : 'Talk to an expert'}
                </a>
                <button
                  type="button"
                  disabled={downloading}
                  onClick={async () => {
                    await downloadReport();
                    setDownloadPromptOpen(false);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-airtel-red hover:bg-airtel-red-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[0.86rem] transition-colors"
                >
                  {downloading ? 'Preparing…' : 'Download PDF'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
