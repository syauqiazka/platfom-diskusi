'use client';

import { useEffect, useState } from 'react';
import { getReports, hideContent } from '@/server/actions/moderation';

export default function ModeratorDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const result = await getReports('OPEN');
    if (result.ok) setReports(result.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleHideContent(contentId: string, contentType: string) {
    const result = await hideContent(contentId, contentType);
    if (result.ok) {
      load();
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 32 }}>
      <h1>Dashboard Moderator</h1>

      {loading ? (
        <p>Memuat laporan...</p>
      ) : reports.length === 0 ? (
        <p>Tidak ada laporan.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Jenis</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Alasan</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Pelapor</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r: any) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{r.contentType}</td>
                <td style={{ padding: 8 }}>{r.reason}</td>
                <td style={{ padding: 8 }}>{r.reporter.displayName}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => handleHideContent(r.contentId, r.contentType)}>
                    Sembunyikan
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
