import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QUESTIONS } from '../data/questions';
import { OptionTile } from '../components/OptionTile';
import { PlainToggle } from '../components/PlainToggle';
import { TermChip } from '../components/TermChip';

const AUTO_ADVANCE_MS = 700;

interface Props {
  step: number;
  answers: (number | null)[];
  plainMode: boolean;
  onSelect: (questionIdx: number, optionIdx: number) => void;
  onPlainModeChange: (next: boolean) => void;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export function QuizScreen({
  step, answers, plainMode, onSelect, onPlainModeChange, onBack, onNext, onFinish,
}: Props) {
  const total = QUESTIONS.length;
  const q = QUESTIONS[step];
  const idx = step;
  const isLast = idx === total - 1;
  const answered = answers[idx] !== null;
  const pct = Math.round((idx / total) * 100);

  const [advancing, setAdvancing] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Reset advancing-state when the question changes
  useEffect(() => {
    setAdvancing(false);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [step]);

  function handleSelect(optionIdx: number) {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    onSelect(idx, optionIdx);
    setAdvancing(true);
    timerRef.current = window.setTimeout(() => {
      setAdvancing(false);
      if (isLast) onFinish();
      else onNext();
    }, AUTO_ADVANCE_MS);
  }

  function handleBack() {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setAdvancing(false);
    onBack();
  }

  function handleNext() {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setAdvancing(false);
    if (isLast) onFinish();
    else onNext();
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Plain English toggle */}
      <div className="flex justify-end mb-4">
        <PlainToggle on={plainMode} onChange={onPlainModeChange} />
      </div>

      {/* Progress */}
      {(() => {
        const remainingQs   = total - idx;
        const minsLeftRough = Math.max(1, Math.ceil(remainingQs * 18 / 60));
        const timeLeftText  = minsLeftRough === 1 ? '~1 min left' : `~${minsLeftRough} mins left`;
        return (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-ink-mute font-medium mb-2">
              <span>{pct}% done</span>
              <span>{timeLeftText}</span>
            </div>
            <div className="h-[3px] rounded-full bg-border overflow-hidden">
              <motion.div
                className="h-full bg-airtel-red"
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>
        );
      })()}

      {/* Card */}
      <motion.div
        layout
        transition={{ layout: { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] } }}
        className="bg-white border border-border rounded-2xl shadow-md p-6 sm:p-9 md:p-11"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            <div className="text-[0.72rem] font-bold uppercase tracking-widest text-airtel-red">
              Question {idx + 1} of {total}
            </div>
            <div className="text-[0.74rem] uppercase tracking-wider text-ink-mute font-medium mt-1.5 mb-3.5">
              {q.domain}
            </div>
            <h2 className="text-[1.15rem] sm:text-[1.35rem] md:text-[1.45rem] font-bold leading-snug tracking-tight text-ink-dark mb-6">
              {q.q}
            </h2>

            {/* Glossary chips, hidden when plain mode is on */}
            <AnimatePresence>
              {q.terms && q.terms.length > 0 && !plainMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 flex-wrap mb-4 overflow-visible"
                >
                  <span className="text-[0.7rem] font-bold uppercase tracking-widest text-ink-mute mr-1">
                    Key terms:
                  </span>
                  {q.terms.map(t => <TermChip key={t.term} term={t} />)}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {q.opts.map((opt, i) => (
                <OptionTile
                  key={i}
                  option={opt}
                  index={i}
                  selected={answers[idx] === i}
                  plainMode={plainMode}
                  onSelect={() => handleSelect(i)}
                />
              ))}
            </motion.div>

            {/* Auto-advance bar */}
            <AnimatePresence>
              {advancing && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 2, marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-full bg-border overflow-hidden"
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                    className="h-full bg-airtel-red"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {/* Nav */}
        <div className="flex justify-between items-center gap-3 flex-wrap mt-7">
          <button
            onClick={handleBack}
            style={{ visibility: idx === 0 ? 'hidden' : 'visible' }}
            className="inline-flex items-center gap-2 bg-transparent text-airtel-navy hover:bg-black/5 border border-border hover:border-airtel-navy px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            ← Back
          </button>
          <span className="text-[0.82rem] text-ink-mute font-medium order-3 sm:order-none w-full sm:w-auto text-center sm:text-left">
            {idx + 1} / {total}
          </span>
          <button
            onClick={handleNext}
            disabled={!answered}
            className="inline-flex items-center gap-2 bg-airtel-navy text-white hover:bg-airtel-navy-hover disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            {isLast ? 'See my results →' : 'Next →'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
