import { getImage } from '@/lib/posts';

export const revalidate = 3600;

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const image = Number.isInteger(id) ? await getImage(id).catch(() => null) : null;
  if (!image) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(image.data), {
    headers: {
      'Content-Type': image.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
