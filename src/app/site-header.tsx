import { ArrowUpRight } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="site-header rule">
      <div className="wrap mast">
        <a className="brand" href="#home"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> Olu Bashorun &amp; Co</a>
        <nav aria-label="Main navigation">
          <a href="#firm">The Firm</a><a href="#practice">Practice Areas</a>
          <a className="contact" href="#contact">Contact <ArrowUpRight aria-hidden="true" /></a>
        </nav>
      </div>
    </header>
  );
}
