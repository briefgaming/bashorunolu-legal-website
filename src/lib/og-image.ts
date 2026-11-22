import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getImage, mediaIdFromUrl } from './posts';
import { SITE_URL } from './site';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;
const MAX_SOURCE_BYTES = 12 * 1024 * 1024;
/** WhatsApp is the pickiest network: previews work best when the image stays well under ~300 KB. */
const TARGET_BYTES = 300 * 1024;

const blockedHost = (host: string) =>
  host === 'localhost' || host.includes(':') || /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || /\.(local|internal)$/.test(host);

async function fetchImage(url: string): Promise<Buffer | null> {
  const target = new URL(url);
  if (target.protocol !== 'https:' || blockedHost(target.hostname)) return null;
  const response = await fetch(target, { signal: AbortSignal.timeout(8000) });
  if (!response.ok || !(response.headers.get('content-type') ?? '').startsWith('image/')) return null;
  if (Number(response.headers.get('content-length') ?? 0) > MAX_SOURCE_BYTES) return null;
  const bytes = Buffer.from(await response.arrayBuffer());
  return bytes.length > MAX_SOURCE_BYTES ? null : bytes;
}

/** A file that ships with the site, read from disk when possible and from the live site otherwise. */
export async function readSiteFile(sitePath: string): Promise<Buffer | null> {
  if (!/^\/(?!\/)[^?#]*$/.test(sitePath) || sitePath.includes('..')) return null;
  try {
    return await readFile(path.join(process.cwd(), 'public', sitePath));
  } catch {
    return fetchImage(SITE_URL + sitePath).catch(() => null);
  }
}

/** The picture behind an article's cover, wherever it is stored. */
export async function loadCoverSource(coverUrl: string | null): Promise<Buffer | null> {
  if (!coverUrl) return null;
  const mediaId = mediaIdFromUrl(coverUrl);
  if (mediaId) return (await getImage(mediaId))?.data ?? null;
  if (coverUrl.startsWith('/')) return readSiteFile(coverUrl);
  return fetchImage(coverUrl);
}

/** Crops to 1200x630 around the most interesting part and compresses until it is small. */
export async function renderShareImage(source: Buffer): Promise<Buffer> {
  // Loaded on demand so that a problem with the native library can never take the route down.
  const { default: sharp } = await import('sharp');
  const base = sharp(source, { failOn: 'none' })
    .rotate()
    .resize(OG_WIDTH, OG_HEIGHT, { fit: 'cover', position: sharp.strategy.attention })
    .flatten({ background: '#f4f1ea' });
  let output = Buffer.alloc(0);
  for (const quality of [82, 72, 62, 50]) {
    output = await base.clone().jpeg({ quality, mozjpeg: true, progressive: true }).toBuffer();
    if (output.length <= TARGET_BYTES) break;
  }
  return output;
}

export const defaultShareImage = () => readSiteFile('/og-default.jpg');
