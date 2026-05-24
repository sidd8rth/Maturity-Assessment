import { AirtelSecureLogo } from './AirtelSecureLogo';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm backdrop-blur">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-3">
        <a href="https://www.airtel.in/b2b/" className="flex items-center flex-shrink-0">
          <AirtelSecureLogo size={32} />
        </a>
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden md:inline text-[0.78rem] font-semibold text-ink-mute uppercase tracking-wider">
            Security Maturity Assessment
          </span>
          <a
            href="https://www.airtel.in/b2b/contact-us"
            className="hidden xs:inline-flex bg-airtel-navy hover:bg-airtel-navy-hover text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
          >
            Talk to an Expert
          </a>
        </div>
      </div>
    </header>
  );
}
