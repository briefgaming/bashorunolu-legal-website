import { defaultShareImage, loadCoverSource, renderShareImage } from '@/lib/og-image';
import { getPublishedBySlug } from '@/lib/posts';

export const runtime = 'nodejs';

/** The picture social networks show when an article is shared: its cover at 1200x630. */
export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const post = await getPublishedBySlug(params.slug);
  if (!post) return new Response('Not found', { status: 404 });

  let image: Buffer | null = null;
  try {
    const source = await loadCoverSource(post.coverUrl);
    image = source ? await renderShareImage(source) : null;
  } catch (error) {
    console.error('Share image failed, using the default:', error);
  }
  image ??= await defaultShareImage();
  if (!image) return new Response('Not found', { status: 404 });

  return new Response(new Uint8Array(image), {
    headers: {
      'Content-Type': 'image/jpeg',
      // The link carries ?v=<last edit time>, so a changed cover gets a fresh address.
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
