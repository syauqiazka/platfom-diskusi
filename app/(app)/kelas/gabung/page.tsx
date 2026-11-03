'use client';

import { useState } from 'react';
import { joinClass } from '@/server/actions/class';
import { useRouter } from 'next/navigation';

export default function JoinClassPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await joinClass({
      joinCode: formData.get('joinCode'),
    });

    if (result.ok && result.data) {
      router.push(`/kelas/${result.data.id}`);
    } else {
      setError(result.error || 'Gagal gabung kelas');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 32 }}>
      <h1>Gabung Kelas</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input name="joinCode" placeholder="Kode Gabung" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Bergabung...' : 'Gabung'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
