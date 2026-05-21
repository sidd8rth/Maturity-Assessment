import { motion } from 'framer-motion';

interface Props {
  on: boolean;
  onChange: (next: boolean) => void;
}

export function PlainToggle({ on, onChange }: Props) {
  return (
    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none bg-white border border-border hover:border-airtel-red rounded-full px-3.5 py-2 transition-colors">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`relative w-8 h-[18px] rounded-full transition-colors ${on ? 'bg-airtel-red' : 'bg-border'}`}
        aria-hidden
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          className="absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow"
          style={{ left: on ? 16 : 2 }}
        />
      </span>
      <span className="text-[0.82rem] font-semibold text-ink-dark">Plain English mode</span>
      <span className="hidden md:inline text-[0.74rem] text-ink-mute font-normal">
        Explains each option in plain business terms
      </span>
    </label>
  );
}
