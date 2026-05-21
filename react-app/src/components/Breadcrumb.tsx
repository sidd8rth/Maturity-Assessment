export function Breadcrumb() {
  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 text-xs sm:text-[0.8rem] text-ink-mute flex-wrap">
        <a href="https://www.airtel.in/b2b/" className="hover:text-airtel-red">Home</a>
        <span className="opacity-50">/</span>
        <a href="https://www.airtel.in/b2b/security" className="hover:text-airtel-red">Security</a>
        <span className="opacity-50">/</span>
        <span>Maturity Assessment</span>
      </div>
    </div>
  );
}
