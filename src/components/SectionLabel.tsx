import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = '' }: Props) {
  return (
    <div className={`text-[0.72rem] font-bold uppercase tracking-widest text-ink-mute mb-3.5 pb-2 border-b border-border ${className}`}>
      {children}
    </div>
  );
}
