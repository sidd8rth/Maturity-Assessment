import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface Props {
  score: number; // 0–100
  size?: number;
}

const RADIUS = 86;
const CIRCUM = 2 * Math.PI * RADIUS;

export function ScoreRing({ score, size = 200 }: Props) {
  const displayed = useMotionValue(0);
  const rounded = useTransform(displayed, v => Math.round(v));
  const [num, setNum] = useState(0);

  useEffect(() => {
    const controls = animate(displayed, score, {
      duration: 1.4,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => setNum(Math.round(v)),
    });
    return controls.stop;
  }, [score, displayed]);

  // dashoffset: starts full circle, animates to fill `score` portion
  const dashOffset = CIRCUM * (1 - score / 100);

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 200 200" className="-rotate-90">
        <circle cx="100" cy="100" r={RADIUS} stroke="var(--ring-track, #dadfe7)" strokeWidth="12" fill="none" />
        <motion.circle
          cx="100"
          cy="100"
          r={RADIUS}
          stroke="url(#scoreGrad)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={CIRCUM}
          initial={{ strokeDashoffset: CIRCUM }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
        />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d40000" />
            <stop offset="1" stopColor="#ff6060" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center font-extrabold text-[3rem] sm:text-[3.2rem] tracking-tight text-ink-dark leading-none">
        {num}
        <motion.span style={{ display: 'none' }}>{rounded}</motion.span>
      </div>
      <div className="absolute inset-0 flex items-end justify-center pb-9 text-[0.7rem] uppercase tracking-widest text-ink-mute">
        out of 100
      </div>
    </div>
  );
}
