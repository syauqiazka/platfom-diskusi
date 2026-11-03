'use client';

import { useEffect, useState } from 'react';
import Comments from '@/components/Comments';

interface ThreadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ThreadDetailPage({ params }: ThreadDetailPageProps) {
  const { id } = await params;
  const [thread, setThread] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Placeholder: real implementation needs Server Action
      setThread({
        id,
        title: 'Contoh Diskusi',
        content: 'Ini adalah konten diskusi contoh.',
        author: { displayName: 'User' },
      });
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p>Memuat...</p>;
  if (!thread) return <p>Diskusi tidak ditemukan.</p>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1>{thread.title}</h1>
      <p style={{ color: '#666', fontSize: 14 }}>Oleh {thread.author.displayName}</p>
      <div style={{ marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #ddd' }}>
        {thread.content}
      </div>
      <Comments threadId={id} />
    </div>
  );
}
