import { AnimatePresence, motion } from 'framer-motion';
import { INDUSTRIES } from '../data/industries';
import type { IndustryId } from '../types';

interface Props {
  selected: IndustryId | null;
  otherLabel: string;
  onSelect: (id: IndustryId) => void;
  onOtherLabel: (label: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function IndustryScreen({
  selected, otherLabel, onSelect, onOtherLabel, onBack, onNext,
}: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="bg-white border border-border rounded-2xl shadow-md p-6 sm:p-9 md:p-11"
    >
      <span className="text-[0.72rem] font-bold uppercase tracking-widest text-airtel-red">
        Step 0 of 12
      </span>
      <h2 className="mt-2 text-[1.2rem] sm:text-[1.35rem] font-bold leading-snug tracking-tight text-ink-dark">
        Which industry are you from?
      </h2>
      <p className="text-ink-mute text-[0.86rem] mt-1">
        We weight your score against what matters most for your sector.
      </p>

      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6"
      >
        {INDUSTRIES.map((ind, i) => {
          const isSelected = selected === ind.id;
          return (
            <motion.button
              key={ind.id}
              type="button"
              onClick={() => onSelect(ind.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`text-left p-4 rounded-xl border bg-bg-secondary transition-colors ${
                isSelected
                  ? 'border-airtel-red bg-airtel-red-light'
                  : 'border-border hover:border-airtel-red hover:bg-airtel-red-light'
              }`}
              style={isSelected ? { boxShadow: '0 0 0 3px rgba(212,0,0,0.20)' } : undefined}
            >
              <div className="text-2xl mb-1.5">{ind.icon}</div>
              <div className="font-bold text-[0.9rem] text-ink-dark">{ind.label}</div>
              <div className="text-[0.74rem] text-ink-mute mt-0.5 leading-snug">{ind.sub}</div>
            </motion.button>
          );
        })}
      </motion.div>

      <AnimatePresence initial={false}>
        {selected === 'other' && (
          <motion.div
            key="other-input"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-2"
          >
            <label htmlFor="other-industry-text" className="block text-[0.8rem] font-semibold text-ink-sub mb-2">
              Tell us your industry
            </label>
            <input
              id="other-industry-text"
              type="text"
              value={otherLabel}
              onChange={(e) => onOtherLabel(e.target.value)}
              placeholder="e.g. Retail, Education, Hospitality, Media…"
              maxLength={80}
              autoFocus
              className="w-full px-4 py-3 border border-border focus:border-airtel-red rounded-lg bg-white text-[0.9rem] text-ink-dark placeholder:text-ink-light outline-none transition-colors"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center gap-3 flex-wrap mt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-transparent text-airtel-navy hover:bg-black/5 border border-border hover:border-airtel-navy px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="inline-flex items-center gap-2 bg-airtel-navy text-white hover:bg-airtel-navy-hover disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          Continue →
        </button>
      </div>
    </motion.div>
  );
}
