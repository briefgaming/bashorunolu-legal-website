'use client';

import { useMemo, useState } from 'react';
import type { PostCardData } from '@/lib/posts';
import PostCard from './post-card';

export default function BlogIndex({ posts }: { posts: PostCardData[] }) {
  const [topic, setTopic] = useState('');
  const [query, setQuery] = useState('');
  const topics = useMemo(() => Array.from(new Set(posts.map((p) => p.topic))).sort(), [posts]);
  const needle = query.trim().toLowerCase();
  const list = posts.filter(
    (p) =>
      (!topic || p.topic === topic) &&
      (!needle || [p.title, p.summary, p.topic, p.authorName].join(' ').toLowerCase().includes(needle)),
  );

  return (
    <section id="articles" className="blog-archive wrap" aria-labelledby="archive-title">
      <h2 className="section-title" id="archive-title">
        More articles
      </h2>
      {(topics.length > 1 || posts.length > 3) && (
        <div className="filters">
          {topics.length > 1 ? (
            <div className="pills" role="group" aria-label="Filter by topic">
              {['', ...topics].map((name) => (
                <button key={name || 'all'} type="button" aria-pressed={name === topic} onClick={() => setTopic(name)}>
                  {name || 'All topics'}
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          {posts.length > 3 && (
            <label className="search">
              <span className="sr-only">Search articles</span>
              <input type="search" placeholder="Search articles" value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
          )}
        </div>
      )}
      {list.length ? (
        <div className="cards">
          {list.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="blog-empty" role="status">
          No articles match this search.
        </p>
      )}
    </section>
  );
}
