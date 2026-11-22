import Link from 'next/link';
import SiteFooter from './site-footer';
import SiteHeader from './site-header';

export default function NotFound() {
  return (
    <>
      <SiteHeader tone="light" />
      <main id="main" className="wrap blog-soon">
        <p className="section-title">That page can’t be found.</p>
        <p>
          It may have moved or been removed. Go back to the <Link href="/">home page</Link> or read <Link href="/blog">The Stable</Link>.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}
