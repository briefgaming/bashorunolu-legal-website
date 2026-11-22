import { NextResponse } from 'next/server';
import { BadImageError, storeCover } from '@/lib/cover';
import { lagosDay } from '@/lib/format';
import { parsePostForm } from '@/lib/post-form';
import type { PostInput } from '@/lib/posts';
import { SlugTakenError, deleteImage, deletePost, getPostById, mediaIdFromUrl, updatePost } from '@/lib/posts';
import { revalidateBlog } from '@/lib/revalidate';

export const dynamic = 'force-dynamic';

const saved = (id: number, input: PostInput) => ({
  ok: true,
  id,
  slug: input.slug,
  coverUrl: input.coverUrl,
  publishedDate: input.publishedAt ? lagosDay(input.publishedAt) : '',
});

type Context = { params: { id: string } };

export async function PUT(request: Request, { params }: Context) {
  const id = Number(params.id);
  const existing = Number.isInteger(id) ? await getPostById(id) : null;
  if (!existing) return NextResponse.json({ error: 'That article no longer exists.' }, { status: 404 });

  const parsed = parsePostForm(await request.formData(), existing);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { input, file } = parsed;
  try {
    if (file) input.coverUrl = await storeCover(file);
    await updatePost(id, input);
    const oldMedia = mediaIdFromUrl(existing.coverUrl);
    if (oldMedia && existing.coverUrl !== input.coverUrl) await deleteImage(oldMedia);
    revalidateBlog(existing.slug, input.slug);
    return NextResponse.json(saved(id, input));
  } catch (error) {
    if (error instanceof SlugTakenError || error instanceof BadImageError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof SlugTakenError ? 409 : 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong while saving. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const id = Number(params.id);
  const existing = Number.isInteger(id) ? await getPostById(id) : null;
  if (!existing) return NextResponse.json({ ok: true });
  await deletePost(id);
  const media = mediaIdFromUrl(existing.coverUrl);
  if (media) await deleteImage(media);
  revalidateBlog(existing.slug);
  return NextResponse.json({ ok: true });
}
