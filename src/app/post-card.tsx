/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { PostCardData } from '@/lib/posts';

export default function PostCard({ post }: { post: PostCardData }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="post-card">
      <Link href={href} className="post-card-image" aria-hidden="true" tabIndex={-1}>
        <figure className="frame">
          {post.coverUrl && <img src={post.coverUrl} alt={post.coverAlt} loading="lazy" decoding="async" />}
        </figure>
      </Link>
      <span className="tag mark">{post.topic}</span>
      <h3>
        <Link href={href}>{post.title}</Link>
      </h3>
      <p>{post.summary}</p>
      <p className="post-meta">
        <time dateTime={post.publishedAt}>{post.dateLabel}</time> · {post.minutes} min read
      </p>
    </article>
  );
}
