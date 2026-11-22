import { notFound } from 'next/navigation';
import { lagosDay } from '@/lib/format';
import { getPostById, listTopics } from '@/lib/posts';
import AdminBar from '../../admin-bar';
import PostEditor, { type EditorPost } from '../../post-editor';

export const dynamic = 'force-dynamic';

type Props = { params: { id: string }; searchParams: { saved?: string } };

export default async function EditPost({ params, searchParams }: Props) {
  const id = Number(params.id);
  const post = Number.isInteger(id) ? await getPostById(id) : null;
  if (!post) notFound();
  const topics = await listTopics().catch(() => []);
  const initial: EditorPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    topic: post.topic,
    summary: post.summary,
    body: post.body,
    coverUrl: post.coverUrl ?? '',
    coverAlt: post.coverAlt,
    authorName: post.authorName,
    authorRole: post.authorRole,
    featured: post.featured,
    status: post.status,
    publishedDate: post.publishedAt ? lagosDay(post.publishedAt) : '',
  };
  const notice =
    searchParams.saved === 'publish' ? 'Published.' : searchParams.saved ? 'Saved.' : '';
  return (
    <>
      <AdminBar />
      <main className="wrap admin-main">
        <h1>Edit article</h1>
        <PostEditor initial={initial} topics={topics} notice={notice} />
      </main>
    </>
  );
}
