import { listTopics } from '@/lib/posts';
import AdminBar from '../admin-bar';
import PostEditor, { type EditorPost } from '../post-editor';

export const dynamic = 'force-dynamic';

export default async function NewPost() {
  const topics = await listTopics().catch(() => []);
  const blank: EditorPost = {
    title: '', slug: '', topic: '', summary: '', body: '', coverUrl: '', coverAlt: '',
    authorName: 'Olu Bashorun & Co', authorRole: '', featured: false, status: 'draft', publishedDate: '',
  };
  return (
    <>
      <AdminBar />
      <main className="wrap admin-main">
        <h1>New article</h1>
        <PostEditor initial={blank} topics={topics} />
      </main>
    </>
  );
}
