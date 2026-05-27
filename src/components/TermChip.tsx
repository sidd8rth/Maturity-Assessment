import { AnimatePresence, motion } from 'framer-motion';
import type { Term } from '../types';

interface Props {
  term: Term;
  /** Controlled-open mode: when provided, the parent owns the state (accordion behavior). */
  open?: boolean;
  onToggle?: () => void;
}

export function TermChip({ term, open = false, onToggle }: Props) {
  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[0.74rem] font-semibold transition-colors ${
          open
            ? 'border-airtel-red bg-airtel-red-light text-airtel-red'
            : 'border-border bg-bg-secondary text-ink-dark hover:border-airtel-red'
        }`}
        aria-label={`What is ${term.term}?`}
        aria-expanded={open}
      >
        {term.term}
        <span className={`text-[0.7rem] font-bold ${open ? 'text-airtel-red' : 'text-airtel-red'}`}>ℹ</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            role="tooltip"
            className="absolute bottom-full left-0 mb-2 w-64 max-w-[80vw] bg-airtel-navy text-white p-3 rounded-lg text-[0.78rem] leading-relaxed shadow-lg z-20"
          >
            <div className="absolute -bottom-1 left-4 w-2 h-2 bg-airtel-navy rotate-45" />
            {term.def}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
