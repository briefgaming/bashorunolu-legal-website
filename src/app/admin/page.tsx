import Link from 'next/link';
import { formatDate } from '@/lib/format';
import { listAllForAdmin, type Post } from '@/lib/posts';
import AdminBar from './admin-bar';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  let posts: Post[] = [];
  let problem = '';
  try {
    posts = await listAllForAdmin();
  } catch (error) {
    console.error(error);
    problem = 'The database could not be reached. Check that DATABASE_URL is set.';
  }

  return (
    <>
      <AdminBar />
      <main className="wrap admin-main">
        <div className="admin-head">
          <h1>Articles</h1>
          <Link className="btn primary" href="/admin/new">
            New article
          </Link>
        </div>
        {problem && <p className="note error">{problem}</p>}
        {!problem && posts.length === 0 && (
          <p className="note">No articles yet. Write the first one with “New article”.</p>
        )}
        {posts.length > 0 && (
          <div className="table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Link href={`/admin/posts/${post.id}`}>
                        <strong>{post.title}</strong>
                      </Link>
                      {post.featured && <span className="badge"> Featured</span>}
                    </td>
                    <td>{post.topic}</td>
                    <td>
                      <span className={`badge${post.status === 'published' ? ' live' : ''}`}>{post.status}</span>
                    </td>
                    <td>{formatDate(post.publishedAt ?? post.updatedAt)}</td>
                    <td className="row-actions">
                      <Link href={`/admin/posts/${post.id}`}>Edit</Link>
                      {post.status === 'published' && (
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          View
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
