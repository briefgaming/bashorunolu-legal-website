import { lagosDay } from './format';
import type { PostInput, PostStatus } from './posts';
import { RESERVED_SLUGS, SLUG_RE } from './slug';

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export type Intent = 'save' | 'publish' | 'unpublish';
export type Parsed = { ok: true; input: PostInput; file: File | null } | { ok: false; error: string };

const text = (data: FormData, key: string) => {
  const value = data.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

function parseDay(value: string, fallback: Date | null): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return fallback;
  if (value === lagosDay()) return fallback && lagosDay(fallback) === value ? fallback : new Date();
  const date = new Date(`${value}T09:00:00+01:00`);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function validCoverUrl(url: string): boolean {
  if (/^\/(?!\/)/.test(url)) return true;
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

export function sniffImage(bytes: Uint8Array): string | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  const tag = String.fromCharCode(...Array.from(bytes.slice(0, 4)), ...Array.from(bytes.slice(8, 12)));
  if (tag === 'RIFFWEBP') return 'image/webp';
  return null;
}

export function parsePostForm(
  data: FormData,
  current: { status: PostStatus; publishedAt: Date | null } | null,
): Parsed {
  const intent = (text(data, 'intent') || 'save') as Intent;
  const status: PostStatus =
    intent === 'publish' ? 'published' : intent === 'unpublish' ? 'draft' : current?.status ?? 'draft';

  const title = text(data, 'title');
  const slug = text(data, 'slug');
  const topic = text(data, 'topic');
  const summary = text(data, 'summary');
  const body = String(data.get('body') ?? '').replace(/\r\n/g, '\n').trimEnd();
  const coverAlt = text(data, 'coverAlt');
  const authorName = text(data, 'authorName') || 'Olu Bashorun & Co';
  const authorRole = text(data, 'authorRole');
  let coverUrl: string | null = text(data, 'coverUrl') || null;

  if (!title || title.length > 160) return { ok: false, error: 'Give the article a title (up to 160 characters).' };
  if (!slug || slug.length > 80 || !SLUG_RE.test(slug)) return { ok: false, error: 'The web address may only use lowercase letters, numbers and hyphens.' };
  if (RESERVED_SLUGS.includes(slug)) return { ok: false, error: 'That web address is reserved. Please choose another.' };
  if (!topic || topic.length > 40) return { ok: false, error: 'Add a topic (up to 40 characters).' };
  if (!summary || summary.length > 400) return { ok: false, error: 'Add a short summary (up to 400 characters).' };
  if (body.length > 100_000) return { ok: false, error: 'The article is too long.' };
  if (status === 'published' && body.length < 20) return { ok: false, error: 'Write the article before publishing it.' };
  if (coverAlt.length > 200 || authorName.length > 100 || authorRole.length > 100) return { ok: false, error: 'One of the fields is too long.' };
  if (coverUrl && !validCoverUrl(coverUrl)) return { ok: false, error: 'The cover image must be an uploaded image or an https:// link.' };

  const upload = data.get('coverFile');
  const file = upload instanceof File && upload.size > 0 ? upload : null;
  if (file && file.size > MAX_IMAGE_BYTES) return { ok: false, error: 'The cover image is larger than 4 MB.' };
  if (data.get('removeCover') === '1' && !file) coverUrl = null;

  const picked = parseDay(text(data, 'publishedDate'), current?.publishedAt ?? null);
  const publishedAt = status === 'published' ? picked ?? new Date() : picked;

  return {
    ok: true,
    file,
    input: {
      slug, title, topic, summary, body, coverUrl, coverAlt, authorName, authorRole,
      featured: data.get('featured') === '1',
      status,
      publishedAt,
    },
  };
}
