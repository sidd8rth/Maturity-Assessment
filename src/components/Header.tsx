import { AirtelSecureLogo } from './AirtelSecureLogo';

interface Props {
  onRetake?: () => void;
}

export function Header({ onRetake }: Props) {
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
          {onRetake && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRetake();
              }}
              className="inline-flex items-center gap-1.5 border border-border hover:border-airtel-navy text-ink-sub hover:text-ink-dark hover:bg-bg-secondary active:scale-[0.97] px-2.5 sm:px-3.5 py-2 rounded-lg text-[0.8rem] sm:text-[0.85rem] font-semibold transition-all whitespace-nowrap cursor-pointer"
              aria-label="Retake readiness check"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ pointerEvents: 'none' }}>
                <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              <span style={{ pointerEvents: 'none' }}>Retake</span>
            </button>
          )}
          <a
            href="https://www.airtel.in/b2b/contact-us"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-airtel-navy hover:bg-airtel-navy-hover text-white px-3 sm:px-4 py-2 rounded-lg text-[0.78rem] sm:text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Talk to an Expert
          </a>
        </div>
      </div>
    </header>
  );
}
