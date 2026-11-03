'use client';

import { useState, useEffect } from 'react';
import { createThread, getThreads } from '@/server/actions/thread';
import { useRouter } from 'next/navigation';

interface ThreadsTabProps {
  classId?: string;
}

export default function ThreadsTab({ classId }: ThreadsTabProps) {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  async function load() {
    const result = await getThreads(classId);
    if (result.ok) setThreads(result.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [classId]);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createThread(classId || null, {
      title: formData.get('title'),
      content: formData.get('content'),
    });

    if (result.ok) {
      setShowForm(false);
      load();
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Batal' : 'Buat Diskusi'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ marginBottom: 24, padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <input name="title" placeholder="Judul diskusi" required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
          <textarea name="content" placeholder="Isi diskusi" required rows={4} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
          <button type="submit">Posting</button>
        </form>
      )}

      {loading ? (
        <p>Memuat...</p>
      ) : threads.length === 0 ? (
        <p>Belum ada diskusi.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {threads.map((t: any) => (
            <li
              key={t.id}
              style={{
                padding: 16,
                border: '1px solid #ddd',
                borderRadius: 8,
                marginBottom: 12,
                cursor: 'pointer',
              }}
              onClick={() => router.push(`/diskusi/${t.id}`)}
            >
              <h3>{t.title}</h3>
              <p style={{ color: '#666', fontSize: 14 }}>{t.content.slice(0, 100)}...</p>
              <p style={{ fontSize: 12, color: '#999' }}>
                {t.author.displayName} • {t._count.comments} komentar
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
