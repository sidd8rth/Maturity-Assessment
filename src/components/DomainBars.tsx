import { motion } from 'framer-motion';
import type { DomainScore } from '../types';
import { DOMAIN_COLORS } from '../data/weights';

interface Props {
  scores: DomainScore[];
}

export function DomainBars({ scores }: Props) {
  const sorted = [...scores].sort((a, b) => a.pct - b.pct);

  return (
    <div className="grid">
      {sorted.map((d, i) => (
        <motion.div
          key={d.name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.3 }}
          className="grid grid-cols-[110px_1fr_36px] sm:grid-cols-[160px_1fr_40px] md:grid-cols-[190px_1fr_44px] gap-2 sm:gap-4 items-center py-2.5 border-b border-border last:border-0"
        >
          <span className="text-[0.8rem] sm:text-[0.85rem] font-semibold text-ink-dark truncate">
            {d.name}
          </span>
          <div className="h-1.5 rounded-full bg-border overflow-hidden">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: `${d.pct}%` }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: DOMAIN_COLORS[d.name] }}
              className="block h-full rounded-full"
            />
          </div>
          <span className="text-right text-[0.82rem] sm:text-[0.84rem] font-bold text-ink-dark">
            {d.pct}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
