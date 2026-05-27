import { motion } from 'framer-motion';

interface Props {
  onStart: () => void;
}

export function IntroScreen({ onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="bg-white border border-border rounded-2xl shadow-md p-7 sm:p-10 md:p-12"
    >
      <span className="inline-block text-[0.72rem] font-semibold uppercase tracking-widest text-airtel-red bg-airtel-red-light border border-airtel-red/20 rounded-full px-3 py-1 mb-5">
        12 questions · ~4 minutes
      </span>
      <h1 className="text-[1.65rem] sm:text-[2.2rem] font-extrabold leading-tight tracking-tight text-ink-dark mb-3.5">
        How ready is<br />
        <span className="text-airtel-red">your security stack?</span>
      </h1>
      <p className="text-ink-mute text-[0.95rem] sm:text-base max-w-xl mb-8 leading-relaxed">
        12 questions across 7 domains. Get your score, domain breakdown, and a personalised Airtel Secure blueprint. Generated instantly, all in your browser.
      </p>
      <div className="flex justify-end">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-airtel-navy hover:bg-airtel-navy-hover text-white font-semibold text-[0.96rem] px-7 py-3.5 rounded-lg transition-colors"
        >
          Start readiness check →
        </motion.button>
      </div>
    </motion.div>
  );
}
