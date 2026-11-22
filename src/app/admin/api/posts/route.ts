import { NextResponse } from 'next/server';
import { BadImageError, storeCover } from '@/lib/cover';
import { lagosDay } from '@/lib/format';
import { parsePostForm } from '@/lib/post-form';
import type { PostInput } from '@/lib/posts';
import { SlugTakenError, createPost } from '@/lib/posts';
import { revalidateBlog } from '@/lib/revalidate';

export const dynamic = 'force-dynamic';

const saved = (id: number, input: PostInput) => ({
  ok: true,
  id,
  slug: input.slug,
  coverUrl: input.coverUrl,
  publishedDate: input.publishedAt ? lagosDay(input.publishedAt) : '',
});

export async function POST(request: Request) {
  const parsed = parsePostForm(await request.formData(), null);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const { input, file } = parsed;
  try {
    if (file) input.coverUrl = await storeCover(file);
    const id = await createPost(input);
    revalidateBlog(input.slug);
    return NextResponse.json(saved(id, input));
  } catch (error) {
    if (error instanceof SlugTakenError || error instanceof BadImageError) {
      return NextResponse.json({ error: error.message }, { status: error instanceof SlugTakenError ? 409 : 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong while saving. Please try again.' }, { status: 500 });
  }
}
