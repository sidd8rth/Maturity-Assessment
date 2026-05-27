import { motion } from 'framer-motion';
import type { Environment } from '../types';

const OPTIONS: { id: Environment; label: string; sub: string; icon: string }[] = [
  { id: 'on_prem',     label: 'On-premises', sub: 'Mostly on-prem infrastructure',     icon: '🏢' },
  { id: 'hybrid',      label: 'Hybrid',       sub: 'Mix of on-prem and cloud',          icon: '🔀' },
  { id: 'multi_cloud', label: 'Cloud-first',  sub: 'Multi-cloud or cloud-native stack', icon: '☁️' },
];

interface Props {
  selected: Environment | null;
  onSelect: (env: Environment) => void;
  onBack: () => void;
  onNext: () => void;
}

export function EnvironmentScreen({ selected, onSelect, onBack, onNext }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
      className="bg-white border border-border rounded-2xl shadow-md p-6 sm:p-9 md:p-11"
    >
      <h2 className="text-[1.2rem] sm:text-[1.35rem] font-bold leading-snug tracking-tight text-ink-dark">
        Where do your workloads run?
      </h2>
      <p className="text-ink-mute text-[0.86rem] mt-1">
        We use this to pick the right architecture controls for your environment.
      </p>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
        {OPTIONS.map((o, i) => {
          const isSelected = selected === o.id;
          return (
            <motion.button
              key={o.id}
              type="button"
              onClick={() => onSelect(o.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`text-left p-5 rounded-xl border bg-bg-secondary transition-colors ${
                isSelected
                  ? 'border-airtel-red bg-airtel-red-light'
                  : 'border-border hover:border-airtel-red hover:bg-airtel-red-light'
              }`}
              style={isSelected ? { boxShadow: '0 0 0 3px rgba(212,0,0,0.20)' } : undefined}
            >
              <div className="text-2xl mb-2">{o.icon}</div>
              <div className="font-bold text-[0.95rem] text-ink-dark">{o.label}</div>
              <div className="text-[0.78rem] text-ink-mute mt-1 leading-snug">{o.sub}</div>
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
