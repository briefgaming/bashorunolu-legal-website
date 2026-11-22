import { listPublished } from '@/lib/posts';
import { BLOG_NAME, SITE_NAME, SITE_URL } from '@/lib/site';

export const revalidate = 300;

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const posts = (await listPublished()).slice(0, 30);
  const items = posts
    .map(
      (post) => `
    <item>
      <title>${escape(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${escape(post.topic)}</category>
      <description>${escape(post.summary)}</description>
    </item>`,
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${BLOG_NAME} | ${SITE_NAME}`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>Legal analysis and notes from ${escape(SITE_NAME)}.</description>
    <language>en-ng</language>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate=3600',
    },
  });
}
