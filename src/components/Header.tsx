import { AirtelSecureLogo } from './AirtelSecureLogo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm backdrop-blur">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <a href="https://www.airtel.in/b2b/" className="flex items-center flex-shrink-0">
            <AirtelSecureLogo size={32} />
          </a>
          <span className="hidden sm:inline-block h-6 w-px bg-border" aria-hidden />
          <span className="hidden sm:inline text-[0.88rem] font-medium text-ink-sub truncate">
            Security maturity assessment
          </span>
        </div>
        <a
          href="https://www.airtel.in/b2b/contact-us"
          className="hidden xs:inline-flex bg-airtel-navy hover:bg-airtel-navy-hover text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap flex-shrink-0"
        >
          Talk to an Expert
        </a>
      </div>
    </header>
  );
}
