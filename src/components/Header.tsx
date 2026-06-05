import { useState, useRef, useEffect } from 'react';
import { AirtelSecureLogo } from './AirtelSecureLogo';

interface Props {
  onRetake?: () => void;
  onHistory?: () => void;
  userEmail?: string | null;
  onSignOut?: () => void | Promise<void>;
}

export function Header({ onRetake, onHistory, userEmail, onSignOut }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function close(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const initial = userEmail ? userEmail[0].toUpperCase() : '?';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm backdrop-blur">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-[64px] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <a
            href="https://www.airtel.in/b2b/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center flex-shrink-0"
          >
            <AirtelSecureLogo size={32} />
          </a>
          <span className="hidden sm:inline-block h-6 w-px bg-border" aria-hidden />
          <span className="hidden md:inline text-[0.88rem] font-medium text-ink-sub truncate">
            Readiness Check
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          {onHistory && (
            <button
              type="button"
              onClick={onHistory}
              className="hidden xs:inline-flex items-center gap-1.5 border border-border hover:border-airtel-navy text-ink-sub hover:text-ink-dark hover:bg-bg-secondary px-3 py-2 rounded-lg text-[0.82rem] font-semibold transition-colors whitespace-nowrap"
              aria-label="View past readiness checks"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 3v18h18" />
                <path d="M7 14l4-4 4 3 5-6" />
              </svg>
              <span className="hidden sm:inline">History</span>
            </button>
          )}

          {onRetake && (
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center gap-1.5 border border-border hover:border-airtel-navy text-ink-sub hover:text-ink-dark hover:bg-bg-secondary active:scale-[0.97] px-2.5 sm:px-3.5 py-2 rounded-lg text-[0.8rem] sm:text-[0.85rem] font-semibold transition-all whitespace-nowrap"
              aria-label="Retake readiness check"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              Retake
            </button>
          )}

          <a
            href="https://www.airtel.in/b2b/contact-us?utm_source=referral&utm_medium=bamboobox&utm_campaign=airtel+secure&utm_id=security+assessment"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xs:inline-flex items-center bg-airtel-navy hover:bg-airtel-navy-hover text-white px-3 sm:px-4 py-2 rounded-lg text-[0.78rem] sm:text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Talk to an Expert
          </a>

          {userEmail && onSignOut && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(v => !v)}
                aria-label="Account menu"
                className="w-9 h-9 rounded-full bg-airtel-red text-white font-bold text-[0.95rem] flex items-center justify-center hover:bg-airtel-red-hover transition-colors"
              >
                {initial}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-[60]">
                  <div className="px-3.5 py-2.5 border-b border-border">
                    <div className="text-[0.7rem] font-bold uppercase tracking-widest text-ink-light">Signed in as</div>
                    <div className="text-[0.85rem] font-semibold text-ink-dark truncate mt-0.5">{userEmail}</div>
                  </div>
                  {onHistory && (
                    <button
                      type="button"
                      onClick={() => { setMenuOpen(false); onHistory(); }}
                      className="xs:hidden w-full text-left px-3.5 py-2.5 text-[0.85rem] text-ink-sub hover:bg-bg-secondary"
                    >
                      My history
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={async () => { setMenuOpen(false); await onSignOut(); }}
                    className="w-full text-left px-3.5 py-2.5 text-[0.85rem] text-airtel-red hover:bg-airtel-red-light font-semibold"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
