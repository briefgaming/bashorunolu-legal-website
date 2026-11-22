/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { formatDate, minutesFromText } from '@/lib/format';
import { getPublishedBySlug, listPublished, listRelated } from '@/lib/posts';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import Markdown from '../../markdown';
import PostCard from '../../post-card';
import SiteEffects from '../../site-effects';
import SiteFooter from '../../site-footer';
import SiteHeader from '../../site-header';

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return (await listPublished()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedBySlug(params.slug);
  if (!post) return { title: 'Article not found' };
  const image = {
    url: `/api/og/${post.slug}?v=${post.updatedAt.getTime()}`,
    width: 1200,
    height: 630,
    alt: post.coverAlt || post.title,
  };
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      locale: 'en_NG',
      title: post.title,
      description: post.summary,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.authorName],
      section: post.topic,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.summary, images: [image.url] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const post = await getPublishedBySlug(params.slug);
  if (!post) notFound();
  const related = await listRelated(post.topic, post.id);
  const published = post.publishedAt as Date;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: published.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Organization', name: post.authorName },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    image: `${SITE_URL}/api/og/${post.slug}?v=${post.updatedAt.getTime()}`,
  };

  return (
    <>
      <SiteHeader tone="light" current="blog" />
      <main id="main" tabIndex={-1}>
        <article className="article">
          <header className="article-head wrap">
            <Link className="back-link" href="/blog">
              <ArrowLeft aria-hidden="true" /> The Stable
            </Link>
            <span className="tag mark">{post.topic}</span>
            <h1>{post.title}</h1>
            <p className="dek">{post.summary}</p>
            <p className="byline">
              <strong>{post.authorName}</strong>
              {post.authorRole && <span>{post.authorRole}</span>}
              <time dateTime={published.toISOString()}>{formatDate(published)}</time>
              <span>{minutesFromText(post.body)} min read</span>
            </p>
          </header>

          {post.coverUrl && (
            <figure className="article-cover wrap">
              <div className="frame">
                <img src={post.coverUrl} alt={post.coverAlt} decoding="async" />
              </div>
            </figure>
          )}

          <div className="article-body wrap">
            <Markdown>{post.body}</Markdown>
          </div>

          <aside className="article-cta wrap" aria-label="Speak with us">
            <div className="cta-box">
              <div>
                <h2>Talk to us about your matter.</h2>
                <p>Email or call to arrange a consultation.</p>
              </div>
              <Link className="site-button gold" href="/#contact">
                Contact the firm <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </article>

        {related.length > 0 && (
          <section className="related wrap" aria-labelledby="related-title">
            <h2 className="section-title" id="related-title">
              More from The Stable
            </h2>
            <div className="cards">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      <SiteEffects />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </>
  );
}
