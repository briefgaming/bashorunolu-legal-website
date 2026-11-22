/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { listPublished } from '@/lib/posts';
import BlogIndex from '../blog-index';
import SiteEffects from '../site-effects';
import SiteFooter from '../site-footer';
import SiteHeader from '../site-header';

export const revalidate = 60;

const description =
  'Legal analysis and notes from Olu Bashorun & Co on property, corporate, energy, data protection and AI in Nigeria.';

export const metadata: Metadata = {
  title: 'The Stable',
  description,
  alternates: { canonical: '/blog' },
  openGraph: { title: 'The Stable | Olu Bashorun & Co', description, url: '/blog' },
};

export default async function BlogPage() {
  const posts = await listPublished();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = featured ? posts.filter((p) => p.id !== featured.id) : [];

  return (
    <>
      <SiteHeader tone="light" current="blog" />
      <main id="main" tabIndex={-1}>
        <section className="blog-masthead wrap">
          <h1>The Stable</h1>
          <p>Legal analysis and notes from the practice of Olu Bashorun &amp; Co.</p>
        </section>

        {featured ? (
          <section className="wrap" aria-label="Featured article">
            <article className="feature">
              <div className="feature-copy">
                <span className="tag">Featured · {featured.topic}</span>
                <h2>
                  <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p>{featured.summary}</p>
                <p className="post-meta">
                  <time dateTime={featured.publishedAt}>{featured.dateLabel}</time> · {featured.minutes} min read
                </p>
                <Link className="feature-link" href={`/blog/${featured.slug}`}>
                  Read the article <ArrowUpRight aria-hidden="true" />
                </Link>
              </div>
              <Link href={`/blog/${featured.slug}`} className="feature-image" aria-hidden="true" tabIndex={-1}>
                <figure className="frame">
                  {featured.coverUrl && <img src={featured.coverUrl} alt={featured.coverAlt} decoding="async" />}
                </figure>
              </Link>
            </article>
          </section>
        ) : (
          <section className="wrap blog-soon">
            <p className="section-title">Our first articles are on the way.</p>
            <p>Check back soon for notes on property, corporate, energy, data protection and AI.</p>
          </section>
        )}

        {rest.length > 0 && <BlogIndex posts={rest} />}
      </main>
      <SiteFooter />
      <SiteEffects />
    </>
  );
}
