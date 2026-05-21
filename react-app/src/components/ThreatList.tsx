import { motion } from 'framer-motion';
import type { ThreatInfo } from '../types';

interface Props {
  threats: ThreatInfo[];
}

export function ThreatList({ threats }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {threats.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.07, duration: 0.3 }}
          className="flex items-start gap-3 p-3 rounded-xl border border-border bg-bg-secondary hover:border-border-red transition-colors"
        >
          <div className="text-xl leading-relaxed flex-shrink-0">{t.icon}</div>
          <div className="min-w-0">
            <b className="block text-[0.84rem] font-bold text-ink-dark mb-0.5 leading-snug">{t.name}</b>
            <small className="block text-[0.76rem] text-ink-mute leading-relaxed">{t.desc}</small>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
