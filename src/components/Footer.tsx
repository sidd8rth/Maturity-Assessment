import { AirtelSecureLogo } from './AirtelSecureLogo';

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border mb-3.5">
          <a
            href="https://www.airtel.in/b2b/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Airtel Secure"
            className="inline-flex"
          >
            <AirtelSecureLogo size={32} />
          </a>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { label: 'Terms & Conditions', href: 'https://www.airtel.in/mobile/terms-conditions' },
              { label: 'Privacy Policy',    href: 'https://www.airtel.in/privacy-policy/' },
              { label: 'Cookie Notice',     href: 'https://www.airtel.in/cookie-notice/' },
              { label: 'Contact Us',        href: 'https://www.airtel.in/b2b/contact-us' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-[0.8rem] text-ink-mute hover:text-airtel-red transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[0.78rem] text-ink-mute">
          © 2026 Bharti Airtel Limited. Airtel Secure is a product of Airtel Business.
        </p>
      </div>
    </footer>
  );
}
