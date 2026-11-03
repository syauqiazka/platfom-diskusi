'use client';

import { useEffect, useState } from 'react';
import { getClassMembers } from '@/server/actions/class';

interface ClassDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassDetailPage({ params }: ClassDetailPageProps) {
  const { id } = await params;
  const [tab, setTab] = useState('diskusi');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadMembers() {
    if (tab === 'anggota') {
      setLoading(true);
      const result = await getClassMembers(id);
      if (result.ok) {
        setMembers(result.data || []);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, [tab, id]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <h1>Detail Kelas</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid #ccc' }}>
        {['diskusi', 'materi', 'anggota'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 16px',
              background: tab === t ? '#000' : '#f5f5f5',
              color: tab === t ? '#fff' : '#000',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 4,
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'diskusi' && (
        <div>
          <h2>Diskusi</h2>
          <p>Belum ada diskusi.</p>
        </div>
      )}

      {tab === 'materi' && (
        <div>
          <h2>Materi</h2>
          <p>Belum ada materi.</p>
        </div>
      )}

      {tab === 'anggota' && (
        <div>
          <h2>Anggota</h2>
          {loading ? (
            <p>Memuat...</p>
          ) : members.length === 0 ? (
            <p>Belum ada anggota.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {members.map((m: any) => (
                <li key={m.userId} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <strong>{m.user.displayName}</strong> ({m.user.username}) - {m.role}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
