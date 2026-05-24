import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { IndustryId, ResultsView } from '../types';
import { computeScores } from '../lib/scoring';
import { buildRecommendations } from '../lib/recommendations';
import { TIER_MESSAGES, TIER_CTA } from '../data/tierMessages';
import { TIER_THREATS } from '../data/threats';
import { ScoreRing } from '../components/ScoreRing';
import { DomainBars } from '../components/DomainBars';
import { ThreatList } from '../components/ThreatList';
import { RecommendationList } from '../components/RecommendationList';
import { SectionLabel } from '../components/SectionLabel';
import { ViewToggle } from '../components/ViewToggle';

interface Props {
  answers: (number | null)[];
  industry: IndustryId;
  onRetake: () => void;
}

export function ResultsScreen({ answers, industry, onRetake }: Props) {
  const [view, setView] = useState<ResultsView>('business');

  const { domainScores, overall, tier } = useMemo(
    () => computeScores(answers, industry),
    [answers, industry],
  );
  const picks = useMemo(
    () => buildRecommendations(domainScores, overall, industry, tier),
    [domainScores, overall, industry, tier],
  );
  const threats = TIER_THREATS[tier];
  const cta     = TIER_CTA[tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="bg-white border border-border rounded-2xl shadow-md p-6 sm:p-9"
    >
      <ViewToggle value={view} onChange={setView} />

      <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] lg:grid-cols-[360px_1fr] gap-8 md:gap-12 items-start">
        {/* LEFT: Score + threats */}
        <div className="md:sticky md:top-20">
          <div className="rounded-2xl border border-airtel-red/15 bg-airtel-red/[0.03] p-6 sm:p-7 text-center">
            <span className="inline-block text-[0.72rem] font-semibold uppercase tracking-widest text-airtel-red bg-airtel-red-light border border-airtel-red/20 rounded-full px-3 py-1 mb-4">
              Your security maturity score
            </span>
            <ScoreRing score={overall} size={180} />
            <motion.div
              key={tier}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 25 }}
              className={`inline-block px-4 py-1 rounded-full font-bold text-[0.8rem] uppercase tracking-wider mt-4 mb-2 tier-${tier}`}
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
                className="text-left text-[0.84rem] text-ink-sub leading-relaxed mt-2"
              >
                {TIER_MESSAGES[tier][view]}
              </motion.p>
            </AnimatePresence>
          </div>

          <SectionLabel className="mt-7">Threats you're most exposed to</SectionLabel>
          <ThreatList threats={threats} />
        </div>

        {/* RIGHT: Domain bars + recommendations */}
        <div>
          <SectionLabel className="!mt-0">Domain breakdown</SectionLabel>
          <DomainBars scores={domainScores} />

          <SectionLabel className="mt-8">Your Airtel Secure blueprint</SectionLabel>
          <RecommendationList picks={picks} />
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-10 p-7 sm:p-9 rounded-2xl bg-airtel-secure-grey text-white text-center"
      >
        <AnimatePresence mode="wait">
          <motion.div key={tier} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <h3 className="text-lg sm:text-xl font-bold mb-2.5">{cta.title}</h3>
            <p className="text-[0.88rem] sm:text-[0.9rem] text-white/75 max-w-lg mx-auto mb-6 leading-relaxed">{cta.body}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a
                href="https://www.airtel.in/b2b/contact-us"
                className="inline-flex items-center gap-2 bg-airtel-red hover:bg-airtel-red-hover text-white font-semibold text-[0.96rem] px-6 py-3 rounded-lg transition-colors"
              >
                {cta.primary}
              </a>
              <button
                onClick={onRetake}
                className="inline-flex items-center gap-2 bg-transparent text-white border border-white/35 hover:border-white/60 hover:bg-white/10 font-semibold text-sm px-5 py-3 rounded-lg transition-colors"
              >
                Retake assessment
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
