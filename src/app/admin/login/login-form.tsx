'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm({ problem }: { problem: 'missing' | 'short' | null }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(result.error || 'Could not sign in.');
        return;
      }
      const next = new URLSearchParams(window.location.search).get('next');
      router.replace(next && next.startsWith('/admin') ? next : '/admin');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (problem) {
    return (
      <div className="note error">
        {problem === 'short' ? (
          <>The admin password is shorter than 8 characters. Set a longer <code>ADMIN_PASSWORD</code> in the site’s environment variables and redeploy.</>
        ) : (
          <>Admin sign-in has not been set up yet. Add an <code>ADMIN_PASSWORD</code> (at least 8 characters) to the site’s environment variables and redeploy.</>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="login-form">
      <label className="field">
        Password
        <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus required />
      </label>
      {error && (
        <p className="note error" role="alert">
          {error}
        </p>
      )}
      <button className="btn primary" type="submit" disabled={busy || !password}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
