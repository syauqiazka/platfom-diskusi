'use client';

import { useState, useEffect } from 'react';
import { getComments, createComment } from '@/server/actions/comment';

interface CommentsProps {
  threadId: string;
}

export default function Comments({ threadId }: CommentsProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const result = await getComments(threadId);
    if (result.ok) setComments(result.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [threadId]);

  async function handleAddComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createComment(threadId, {
      content: formData.get('content'),
    });

    if (result.ok) {
      (e.target as HTMLFormElement).reset();
      load();
    }
  }

  return (
    <div>
      <h3>Komentar</h3>

      <form onSubmit={handleAddComment} style={{ marginBottom: 24, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
        <textarea
          name="content"
          placeholder="Tulis komentar..."
          required
          rows={3}
          style={{ width: '100%', padding: 8, marginBottom: 8, boxSizing: 'border-box' }}
        />
        <button type="submit">Kirim</button>
      </form>

      {loading ? (
        <p>Memuat komentar...</p>
      ) : comments.length === 0 ? (
        <p>Belum ada komentar.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {comments.map((c: any) => (
            <li key={c.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 6, marginBottom: 8 }}>
              <strong>{c.author.displayName}</strong>
              <p>{c.content}</p>
              {c.replies.length > 0 && (
                <ul style={{ listStyle: 'none', paddingLeft: 16, marginTop: 8 }}>
                  {c.replies.map((r: any) => (
                    <li key={r.id} style={{ padding: 8, background: '#f5f5f5', borderRadius: 4, marginBottom: 4 }}>
                      <strong>{r.author.displayName}</strong>
                      <p>{r.content}</p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
