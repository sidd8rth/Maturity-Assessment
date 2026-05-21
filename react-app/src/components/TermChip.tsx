import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Term } from '../types';

interface Props {
  term: Term;
}

export function TermChip({ term }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-bg-secondary border border-border hover:border-airtel-red text-[0.74rem] font-semibold text-ink-dark transition-colors"
        aria-label={`What is ${term.term}?`}
        aria-expanded={open}
      >
        {term.term}
        <span className="text-airtel-red text-[0.7rem] font-bold">ℹ</span>
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
