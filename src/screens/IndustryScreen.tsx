import { motion } from 'framer-motion';
import { INDUSTRIES } from '../data/industries';
import type { IndustryId } from '../types';

interface Props {
  selected: IndustryId | null;
  onSelect: (id: IndustryId) => void;
  onBack: () => void;
  onNext: () => void;
}

export function IndustryScreen({ selected, onSelect, onBack, onNext }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className="bg-white border border-border rounded-2xl shadow-md p-6 sm:p-9 md:p-11"
    >
      <h2 className="text-[1.2rem] sm:text-[1.35rem] font-bold leading-snug tracking-tight text-ink-dark">
        Which industry are you from?
      </h2>
      <p className="text-ink-mute text-[0.86rem] mt-1">
        We weigh your score against what is most critical for your vertical.
      </p>

      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
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
