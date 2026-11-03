'use client';

import { useEffect, useState } from 'react';
import { getMyClasses } from '@/server/actions/class';
import Link from 'next/link';

export default function DashboardPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getMyClasses();
      if (result.ok) {
        setClasses(result.data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Memuat...</p>;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
      <h1>Kelas Ku</h1>
      <div style={{ marginBottom: 32 }}>
        <Link href="/kelas/buat">
          <button>Buat Kelas</button>
        </Link>
        {' '}
        <Link href="/kelas/gabung">
          <button>Gabung Kelas</button>
        </Link>
      </div>

      {classes.length === 0 ? (
        <p>Belum ada kelas.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {classes.map((m: any) => (
            <Link key={m.classId} href={`/kelas/${m.classId}`} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: 10,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
              >
                <h3>{m.class.name}</h3>
                <p style={{ color: '#666', fontSize: 14 }}>{m.class.subject}</p>
                <p style={{ fontSize: 12, color: '#999' }}>Role: {m.role}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
