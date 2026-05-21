import { motion } from 'framer-motion';
import type { ResultsView } from '../types';

interface Props {
  value: ResultsView;
  onChange: (next: ResultsView) => void;
}

const OPTIONS: { id: ResultsView; label: string }[] = [
  { id: 'business',  label: 'Business owner' },
  { id: 'technical', label: 'CISO / IT lead' },
];

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3 mb-6">
      <span className="text-[0.78rem] font-semibold uppercase tracking-wider text-ink-mute">
        Read this as:
      </span>
      <div className="inline-flex bg-bg-secondary border border-border rounded-full p-[3px] relative" role="tablist">
        {OPTIONS.map(opt => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(opt.id)}
              className={`relative z-10 px-4 py-1.5 rounded-full text-[0.82rem] font-semibold transition-colors whitespace-nowrap ${active ? 'text-white' : 'text-ink-mute hover:text-ink-dark'}`}
            >
              {active && (
                <motion.span
                  layoutId="view-toggle-pill"
                  className="absolute inset-0 bg-airtel-navy rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
