'use client';

import { useEffect, useState } from 'react';
import { getSystemStats } from '@/server/actions/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getSystemStats();
      if (result.ok) setStats(result.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Memuat...</p>;
  if (!stats) return <p>Tidak ada akses.</p>;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 32 }}>
      <h1>Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: '#666' }}>Pengguna</p>
          <h2 style={{ margin: 0 }}>{stats.userCount}</h2>
        </div>
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: '#666' }}>Kelas</p>
          <h2 style={{ margin: 0 }}>{stats.classCount}</h2>
        </div>
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: '#666' }}>Diskusi</p>
          <h2 style={{ margin: 0 }}>{stats.threadCount}</h2>
        </div>
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
          <p style={{ fontSize: 12, color: '#666' }}>Laporan Terbuka</p>
          <h2 style={{ margin: 0 }}>{stats.reportCount}</h2>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <a href="/moderator/dashboard">
          <button>Dashboard Moderator</button>
        </a>
        {' '}
        <a href="/admin/users">
          <button>Kelola Pengguna</button>
        </a>
      </div>
    </div>
  );
}
