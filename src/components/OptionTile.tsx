import { AnimatePresence, motion } from 'framer-motion';
import type { QuestionOption } from '../types';

interface Props {
  option: QuestionOption;
  index: number;
  selected: boolean;
  plainMode: boolean;
  onSelect: () => void;
}

export function OptionTile({ option, index, selected, plainMode, onSelect }: Props) {
  const sub = plainMode && option.plainSub ? option.plainSub : option.sub;
  const subKey = plainMode && option.plainSub ? 'plain' : 'tech';

  return (
    <motion.button
      layout
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      className={`flex items-start gap-3 text-left p-3.5 rounded-xl border transition-colors w-full ${
        option.isUnsure
          ? 'border-dashed bg-bg-secondary'
          : 'bg-white'
      } ${
        selected
          ? 'border-airtel-red bg-airtel-red-light shadow-[0_0_0_3px_var(--tw-ring-color)] ring-airtel-red-ring'
          : 'border-border hover:border-airtel-red hover:bg-airtel-red-light'
      } ${option.isUnsure ? 'col-span-full' : ''}`}
      style={selected ? { boxShadow: '0 0 0 3px rgba(212,0,0,0.20)' } : undefined}
    >
      <span
        className={`shrink-0 w-[18px] h-[18px] mt-0.5 rounded-full border-2 grid place-items-center transition-colors ${
          selected ? 'border-airtel-red' : 'border-border'
        }`}
      >
        {selected && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 600, damping: 25 }}
            className="w-2 h-2 rounded-full bg-airtel-red"
          />
        )}
      </span>
      <div className="flex-1 min-w-0">
        <strong className={`block text-[0.9rem] font-semibold mb-1 ${option.isUnsure ? 'text-ink-sub font-medium italic' : 'text-ink-dark'}`}>
          {option.t}
        </strong>
        <AnimatePresence mode="wait" initial={false}>
          <motion.small
            key={subKey}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="block text-[0.77rem] text-ink-mute leading-relaxed"
          >
            {sub}
          </motion.small>
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
