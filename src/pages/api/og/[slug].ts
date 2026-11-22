import type { NextApiRequest, NextApiResponse } from 'next';
import { defaultShareImage, loadCoverSource, renderShareImage } from '@/lib/og-image';
import { getPublishedBySlug } from '@/lib/posts';

/** The picture social networks show when an article is shared: its cover at 1200x630. */
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const post = await getPublishedBySlug(String(request.query.slug ?? ''));
  if (!post) return response.status(404).send('Not found');

  let image: Buffer | null = null;
  try {
    const source = await loadCoverSource(post.coverUrl);
    image = source ? await renderShareImage(source) : null;
  } catch (error) {
    console.error('Share image failed, using the default:', error);
  }
  image ??= await defaultShareImage();
  if (!image) return response.status(404).send('Not found');

  response.setHeader('Content-Type', 'image/jpeg');
  // The link carries ?v=<last edit time>, so a changed cover gets a fresh address.
  response.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  return response.status(200).send(image);
}
