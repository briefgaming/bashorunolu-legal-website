import * as React from 'react';
import { db, hasDatabase } from './db';
import { formatDate, minutesFromChars } from './format';

export type PostStatus = 'draft' | 'published';

export type Post = {
  id: number;
  slug: string;
  title: string;
  topic: string;
  summary: string;
  body: string;
  coverUrl: string | null;
  coverAlt: string;
  authorName: string;
  authorRole: string;
  featured: boolean;
  status: PostStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PostInput = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>;

/** Serializable summary used by cards and the blog index. */
export type PostCardData = {
  id: number;
  slug: string;
  title: string;
  topic: string;
  summary: string;
  coverUrl: string | null;
  coverAlt: string;
  authorName: string;
  featured: boolean;
  publishedAt: string;
  dateLabel: string;
  minutes: number;
};

type Row = {
  id: number;
  slug: string;
  title: string;
  topic: string;
  summary: string;
  body: string;
  cover_url: string | null;
  cover_alt: string;
  author_name: string;
  author_role: string;
  featured: boolean;
  status: PostStatus;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
};
type CardRow = Omit<Row, 'body' | 'author_role' | 'status' | 'created_at' | 'updated_at'> & { body_len: number };

type Memo = <A extends unknown[], R>(fn: (...args: A) => R) => (...args: A) => R;
/** De-duplicates repeated lookups within one page render; a plain pass-through outside the App Router. */
const cache: Memo = (React as unknown as { cache?: Memo }).cache ?? ((fn) => fn);

export class SlugTakenError extends Error {
  constructor() {
    super('That web address (slug) is already used by another article.');
  }
}

const toPost = (r: Row): Post => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  topic: r.topic,
  summary: r.summary,
  body: r.body,
  coverUrl: r.cover_url,
  coverAlt: r.cover_alt,
  authorName: r.author_name,
  authorRole: r.author_role,
  featured: r.featured,
  status: r.status,
  publishedAt: r.published_at,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toCard = (r: CardRow): PostCardData => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  topic: r.topic,
  summary: r.summary,
  coverUrl: r.cover_url,
  coverAlt: r.cover_alt,
  authorName: r.author_name,
  featured: r.featured,
  publishedAt: (r.published_at as Date).toISOString(),
  dateLabel: formatDate(r.published_at as Date),
  minutes: minutesFromChars(r.body_len),
});

/** Public reads never throw: a missing or unreachable database just shows no articles. */
async function safely<T>(fallback: T, run: () => Promise<T>): Promise<T> {
  if (!hasDatabase()) return fallback;
  try {
    return await run();
  } catch (error) {
    console.error('Blog query failed:', error);
    return fallback;
  }
}

export const listPublished = cache(() =>
  safely<PostCardData[]>([], async () => {
    const sql = await db();
    const rows = await sql<CardRow[]>`
      select id, slug, title, topic, summary, cover_url, cover_alt, author_name, featured, published_at,
             char_length(body) as body_len
      from posts
      where status = 'published' and published_at <= now()
      order by published_at desc`;
    return rows.map(toCard);
  }),
);

export const getPublishedBySlug = cache((slug: string) =>
  safely<Post | null>(null, async () => {
    const sql = await db();
    const rows = await sql<Row[]>`
      select * from posts
      where slug = ${slug} and status = 'published' and published_at <= now()
      limit 1`;
    return rows[0] ? toPost(rows[0]) : null;
  }),
);

export const listRelated = (topic: string, excludeId: number, limit = 3) =>
  safely<PostCardData[]>([], async () => {
    const sql = await db();
    const rows = await sql<CardRow[]>`
      select id, slug, title, topic, summary, cover_url, cover_alt, author_name, featured, published_at,
             char_length(body) as body_len
      from posts
      where status = 'published' and published_at <= now() and id <> ${excludeId}
      order by (topic = ${topic}) desc, published_at desc
      limit ${limit}`;
    return rows.map(toCard);
  });

export const listAllForAdmin = async (): Promise<Post[]> => {
  const sql = await db();
  const rows = await sql<Row[]>`select * from posts order by updated_at desc`;
  return rows.map(toPost);
};

export const getPostById = async (id: number): Promise<Post | null> => {
  const sql = await db();
  const rows = await sql<Row[]>`select * from posts where id = ${id} limit 1`;
  return rows[0] ? toPost(rows[0]) : null;
};

export const listTopics = async (): Promise<string[]> => {
  const sql = await db();
  const rows = await sql<{ topic: string }[]>`select distinct topic from posts order by topic`;
  return rows.map((r) => r.topic);
};

const isUniqueViolation = (error: unknown) =>
  typeof error === 'object' && error !== null && (error as { code?: string }).code === '23505';

export async function createPost(i: PostInput): Promise<number> {
  const sql = await db();
  try {
    const rows = await sql<{ id: number }[]>`
      insert into posts (slug, title, topic, summary, body, cover_url, cover_alt, author_name, author_role, featured, status, published_at)
      values (${i.slug}, ${i.title}, ${i.topic}, ${i.summary}, ${i.body}, ${i.coverUrl}, ${i.coverAlt}, ${i.authorName}, ${i.authorRole}, ${i.featured}, ${i.status}, ${i.publishedAt})
      returning id`;
    return rows[0].id;
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlugTakenError();
    throw error;
  }
}

export async function updatePost(id: number, i: PostInput): Promise<void> {
  const sql = await db();
  try {
    await sql`
      update posts set slug = ${i.slug}, title = ${i.title}, topic = ${i.topic}, summary = ${i.summary}, body = ${i.body},
        cover_url = ${i.coverUrl}, cover_alt = ${i.coverAlt}, author_name = ${i.authorName}, author_role = ${i.authorRole},
        featured = ${i.featured}, status = ${i.status}, published_at = ${i.publishedAt}, updated_at = now()
      where id = ${id}`;
  } catch (error) {
    if (isUniqueViolation(error)) throw new SlugTakenError();
    throw error;
  }
}

export async function deletePost(id: number): Promise<void> {
  const sql = await db();
  await sql`delete from posts where id = ${id}`;
}

export async function saveImage(contentType: string, data: Uint8Array): Promise<number> {
  const sql = await db();
  const rows = await sql<{ id: number }[]>`
    insert into images (content_type, data) values (${contentType}, ${data as unknown as Buffer}) returning id`;
  return rows[0].id;
}

export async function getImage(id: number): Promise<{ contentType: string; data: Buffer } | null> {
  const sql = await db();
  const rows = await sql<{ content_type: string; data: Buffer }[]>`select content_type, data from images where id = ${id}`;
  return rows[0] ? { contentType: rows[0].content_type, data: rows[0].data } : null;
}

export async function deleteImage(id: number): Promise<void> {
  const sql = await db();
  await sql`delete from images where id = ${id}`;
}

/** Id of an uploaded cover (`/blog/media/12`), or null for external links. */
export const mediaIdFromUrl = (url: string | null): number | null => {
  const match = url?.match(/^\/blog\/media\/(\d+)$/);
  return match ? Number(match[1]) : null;
};
