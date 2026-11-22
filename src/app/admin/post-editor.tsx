/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slug';
import Markdown from '../markdown';

export type EditorPost = {
  id?: number;
  title: string;
  slug: string;
  topic: string;
  summary: string;
  body: string;
  coverUrl: string;
  coverAlt: string;
  authorName: string;
  authorRole: string;
  featured: boolean;
  status: 'draft' | 'published';
  publishedDate: string;
};

type Intent = 'save' | 'publish' | 'unpublish';
type Note = { kind: 'ok' | 'error'; text: string } | null;

const TOOLS: Array<[label: string, run: 'bold' | 'italic' | 'link' | 'h2' | 'h3' | 'list' | 'quote']> = [
  ['Heading', 'h2'], ['Subheading', 'h3'], ['Bold', 'bold'], ['Italic', 'italic'], ['Link', 'link'], ['List', 'list'], ['Quote', 'quote'],
];

export default function PostEditor({ initial, topics, notice = '' }: { initial: EditorPost; topics: string[]; notice?: string }) {
  const router = useRouter();
  const [f, setF] = useState<EditorPost>(initial);
  const [slugEdited, setSlugEdited] = useState(Boolean(initial.id));
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initial.coverUrl);
  const [removeCover, setRemoveCover] = useState(false);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [busy, setBusy] = useState<Intent | 'delete' | null>(null);
  const [note, setNote] = useState<Note>(notice ? { kind: 'ok', text: notice } : null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const set = <K extends keyof EditorPost>(key: K, value: EditorPost[K]) => setF((prev) => ({ ...prev, [key]: value }));

  function edit(action: (typeof TOOLS)[number][1]) {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    const picked = value.slice(start, end);
    let next = value;
    let from = start;
    let to = end;
    const wrap = (mark: string, fallback: string) => {
      const text = picked || fallback;
      next = value.slice(0, start) + mark + text + mark + value.slice(end);
      from = start + mark.length;
      to = from + text.length;
    };
    const prefix = (mark: string, fallback: string) => {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const text = picked || fallback;
      next = value.slice(0, lineStart) + mark + value.slice(lineStart, start) + text + value.slice(end);
      from = start + mark.length;
      to = from + text.length;
    };
    if (action === 'bold') wrap('**', 'bold text');
    else if (action === 'italic') wrap('*', 'emphasis');
    else if (action === 'h2') prefix('## ', 'Heading');
    else if (action === 'h3') prefix('### ', 'Subheading');
    else if (action === 'list') prefix('- ', 'List item');
    else if (action === 'quote') prefix('> ', 'Quote');
    else if (action === 'link') {
      const text = picked || 'link text';
      next = value.slice(0, start) + `[${text}](https://)` + value.slice(end);
      from = start + text.length + 3;
      to = from + 8;
    }
    set('body', next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(from, to);
    });
  }

  function pickFile(chosen: File | null) {
    if (!chosen) return;
    if (!/^image\/(jpeg|png|webp)$/.test(chosen.type)) return setNote({ kind: 'error', text: 'Choose a JPEG, PNG or WebP image.' });
    if (chosen.size > 4 * 1024 * 1024) return setNote({ kind: 'error', text: 'That image is larger than 4 MB.' });
    setNote(null);
    setFile(chosen);
    setRemoveCover(false);
    setPreview(URL.createObjectURL(chosen));
  }

  async function submit(intent: Intent) {
    setNote(null);
    setBusy(intent);
    const data = new FormData();
    data.set('intent', intent);
    (['title', 'slug', 'topic', 'summary', 'body', 'coverUrl', 'coverAlt', 'authorName', 'authorRole'] as const).forEach((key) => data.set(key, f[key]));
    data.set('publishedDate', f.publishedDate);
    if (f.featured) data.set('featured', '1');
    if (file) data.set('coverFile', file);
    if (removeCover) data.set('removeCover', '1');
    try {
      const response = await fetch(f.id ? `/admin/api/posts/${f.id}` : '/admin/api/posts', { method: f.id ? 'PUT' : 'POST', body: data });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) return setNote({ kind: 'error', text: result.error || 'Could not save the article.' });
      if (!f.id) {
        router.replace(`/admin/posts/${result.id}?saved=${intent}`);
        return;
      }
      setF((prev) => ({
        ...prev,
        slug: result.slug,
        coverUrl: result.coverUrl ?? '',
        publishedDate: result.publishedDate || prev.publishedDate,
        status: intent === 'publish' ? 'published' : intent === 'unpublish' ? 'draft' : prev.status,
      }));
      setPreview(result.coverUrl ?? '');
      setFile(null);
      setRemoveCover(false);
      setNote({ kind: 'ok', text: intent === 'publish' ? 'Published.' : intent === 'unpublish' ? 'Moved back to drafts.' : 'Saved.' });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!f.id || !window.confirm('Delete this article permanently? This cannot be undone.')) return;
    setBusy('delete');
    const response = await fetch(`/admin/api/posts/${f.id}`, { method: 'DELETE' });
    if (response.ok) {
      router.replace('/admin');
      router.refresh();
    } else {
      setBusy(null);
      setNote({ kind: 'error', text: 'Could not delete the article.' });
    }
  }

  const live = f.status === 'published';

  return (
    <div className="editor">
      <div className="editor-main">
        <label className="field">
          Title
          <input
            value={f.title}
            maxLength={160}
            onChange={(e) => {
              set('title', e.target.value);
              if (!slugEdited) set('slug', slugify(e.target.value));
            }}
            placeholder="A clear, plain-English headline"
          />
        </label>
        <label className="field">
          Summary <small>One or two sentences shown on cards and in search results.</small>
          <textarea rows={3} maxLength={400} value={f.summary} onChange={(e) => set('summary', e.target.value)} />
        </label>

        <div className="field">
          <span>Article</span>
          <div className="tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'write'} onClick={() => setTab('write')}>Write</button>
            <button type="button" role="tab" aria-selected={tab === 'preview'} onClick={() => setTab('preview')}>Preview</button>
          </div>
          {tab === 'write' ? (
            <>
              <div className="toolbar">
                {TOOLS.map(([label, run]) => (
                  <button key={run} type="button" onClick={() => edit(run)}>{label}</button>
                ))}
              </div>
              <textarea ref={bodyRef} className="body-input" value={f.body} onChange={(e) => set('body', e.target.value)} placeholder="Write in Markdown: ## for headings, **bold**, - for lists, > for quotes." />
            </>
          ) : (
            <div className="preview-box">
              <Markdown>{f.body.trim() || '*Nothing to preview yet.*'}</Markdown>
            </div>
          )}
        </div>
      </div>

      <aside className="editor-side">
        <div className="panel">
          <p>
            Status: <span className={`badge${live ? ' live' : ''}`}>{f.status}</span>
          </p>
          {note && <p className={`note ${note.kind}`} role={note.kind === 'error' ? 'alert' : 'status'}>{note.text}</p>}
          <div className="button-row">
            <button className="btn" type="button" disabled={busy !== null} onClick={() => submit('save')}>
              {busy === 'save' ? 'Saving…' : live ? 'Update' : 'Save draft'}
            </button>
            {live ? (
              <button className="btn" type="button" disabled={busy !== null} onClick={() => submit('unpublish')}>
                {busy === 'unpublish' ? 'Working…' : 'Unpublish'}
              </button>
            ) : (
              <button className="btn primary" type="button" disabled={busy !== null} onClick={() => submit('publish')}>
                {busy === 'publish' ? 'Publishing…' : 'Publish'}
              </button>
            )}
          </div>
          {live && f.id && (
            <Link href={`/blog/${f.slug}`} target="_blank" className="view-link">View on the site</Link>
          )}
        </div>

        <div className="panel">
          <label className="field">
            Topic
            <input list="topics" value={f.topic} maxLength={40} onChange={(e) => set('topic', e.target.value)} placeholder="e.g. Property" />
            <datalist id="topics">{topics.map((t) => <option key={t} value={t} />)}</datalist>
          </label>
          <label className="field">
            Web address <small>/blog/{f.slug || 'your-article'}</small>
            <input value={f.slug} maxLength={80} onChange={(e) => { setSlugEdited(true); set('slug', slugify(e.target.value)); }} />
          </label>
          <label className="field">
            Publication date
            <input type="date" value={f.publishedDate} onChange={(e) => set('publishedDate', e.target.value)} />
            <small>Leave empty to use today. A future date schedules it.</small>
          </label>
          <label className="check">
            <input type="checkbox" checked={f.featured} onChange={(e) => set('featured', e.target.checked)} /> Feature on the blog page
          </label>
        </div>

        <div className="panel">
          <span className="field-title">Cover image</span>
          {preview && !removeCover && (
            <div className="frame cover-preview"><img src={preview} alt="" /></div>
          )}
          <label className="field">
            Upload <small>JPEG, PNG or WebP, up to 4 MB</small>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
          </label>
          <label className="field">
            Or an https:// link
            <input value={f.coverUrl.startsWith('/blog/media/') ? '' : f.coverUrl} placeholder="https://…" onChange={(e) => { set('coverUrl', e.target.value); setPreview(e.target.value); setFile(null); setRemoveCover(false); }} />
          </label>
          <label className="field">
            Describe the image <small>For screen readers</small>
            <input value={f.coverAlt} maxLength={200} onChange={(e) => set('coverAlt', e.target.value)} />
          </label>
          {preview && !removeCover && (
            <button type="button" className="btn" onClick={() => { setRemoveCover(true); setFile(null); set('coverUrl', ''); setPreview(''); }}>Remove cover</button>
          )}
        </div>

        <div className="panel">
          <label className="field">
            Author
            <input value={f.authorName} maxLength={100} onChange={(e) => set('authorName', e.target.value)} />
          </label>
          <label className="field">
            Role <small>Optional</small>
            <input value={f.authorRole} maxLength={100} onChange={(e) => set('authorRole', e.target.value)} placeholder="e.g. Partner, Corporate" />
          </label>
        </div>

        {f.id && (
          <button className="btn danger" type="button" disabled={busy !== null} onClick={remove}>
            {busy === 'delete' ? 'Deleting…' : 'Delete article'}
          </button>
        )}
      </aside>
    </div>
  );
}
