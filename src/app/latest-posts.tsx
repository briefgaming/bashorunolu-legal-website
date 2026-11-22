import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { listPublished } from '@/lib/posts';
import PostCard from './post-card';

/** "Latest from The Stable" on the home page; renders nothing until an article is published. */
export default async function LatestPosts() {
  const posts = (await listPublished()).slice(0, 3);
  if (!posts.length) return null;
  return (
    <section id="stable" className="latest wrap" aria-labelledby="latest-title">
      <div className="section-intro reveal">
        <div>
          <span className="tag mark">Insights</span>
          <h2 className="section-title" id="latest-title">
            The Stable
          </h2>
        </div>
        <Link className="line-link" href="/blog">
          Visit the blog <ArrowUpRight aria-hidden="true" />
        </Link>
      </div>
      <div className="cards">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
