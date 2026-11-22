import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

type Props = { tone?: 'dark' | 'light'; current?: 'blog' };

export default function SiteHeader({ tone = 'dark', current }: Props) {
  return (
    <header className={`site-header rule${tone === 'light' ? ' header-light' : ''}`}>
      <div className="wrap mast">
        <Link className="brand" href="/"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg> Olu Bashorun &amp; Co</Link>
        <nav aria-label="Main navigation">
          <Link href="/#firm">The Firm</Link><Link href="/#practice">Practice Areas</Link>
          <Link href="/blog" aria-current={current === 'blog' ? 'page' : undefined}>The Stable</Link>
          <Link className="contact" href="/#contact">Contact <ArrowUpRight aria-hidden="true" /></Link>
        </nav>
      </div>
    </header>
  );
}
