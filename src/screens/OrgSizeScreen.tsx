import { motion } from 'framer-motion';
import type { OrgSize } from '../types';

const OPTIONS: { id: OrgSize; label: string; sub: string }[] = [
  { id: 'small',  label: 'Under 500',      sub: 'Small team, lean security posture' },
  { id: 'mid',    label: '500 – 2,000',    sub: 'Growing complexity, structured controls' },
  { id: 'large',  label: '2,000 – 10,000', sub: 'Enterprise scale, multi-team security' },
  { id: 'xlarge', label: '10,000+',         sub: 'Large enterprise, full programme' },
];

interface Props {
  selected: OrgSize | null;
  onSelect: (s: OrgSize) => void;
  onBack: () => void;
  onNext: () => void;
}

export function OrgSizeScreen({ selected, onSelect, onBack, onNext }: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="bg-white border border-border rounded-2xl shadow-md p-6 sm:p-9 md:p-11"
    >
      <h2 className="text-[1.2rem] sm:text-[1.35rem] font-bold leading-snug tracking-tight text-ink-dark">
        How large is your organisation?
      </h2>
      <p className="text-ink-mute text-[0.86rem] mt-1">
        Headcount roughly. We use this to size the architecture recommendations appropriately.
      </p>

      <motion.div layout className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        {OPTIONS.map((o, i) => {
          const isSelected = selected === o.id;
          return (
            <motion.button
              key={o.id}
              type="button"
              onClick={() => onSelect(o.id)}
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
              <div className="font-bold text-[0.92rem] text-ink-dark">{o.label}</div>
              <div className="text-[0.74rem] text-ink-mute mt-1 leading-snug">{o.sub}</div>
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
          Start assessment →
        </button>
      </div>
    </motion.div>
  );
}
