'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminBar() {
  const router = useRouter();
  async function signOut() {
    await fetch('/admin/api/logout', { method: 'POST' });
    router.replace('/admin/login');
    router.refresh();
  }
  return (
    <div className="admin-bar">
      <div className="wrap admin-bar-inner">
        <Link className="admin-title" href="/admin">
          The Stable · Admin
        </Link>
        <div className="admin-actions">
          <Link href="/blog" target="_blank">
            View blog
          </Link>
          <Link href="/admin/new">New article</Link>
          <button type="button" className="admin-link-button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
