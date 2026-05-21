import { motion } from 'framer-motion';
import { STACK_COPY, type StackKey } from '../data/stacks';

interface Props {
  picks: StackKey[];
}

export function RecommendationList({ picks }: Props) {
  return (
    <div className="grid gap-2.5">
      {picks.map((key, i) => {
        const s = STACK_COPY[key];
        return (
          <motion.a
            key={key}
            href={s.href}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
            className="flex items-start gap-4 p-5 rounded-xl border border-border bg-bg-secondary hover:border-border-red hover:shadow-sm transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-white border border-border grid place-items-center text-airtel-red font-extrabold text-base flex-shrink-0">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <b className="block text-[0.94rem] font-bold text-ink-dark mb-1">{s.title}</b>
              <small className="block text-[0.82rem] text-ink-mute leading-relaxed">{s.desc}</small>
              <span className="inline-block mt-2 text-[0.81rem] font-semibold text-airtel-red group-hover:underline">
                Explore this capability →
              </span>
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}
