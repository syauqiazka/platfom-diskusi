'use client';

import { useState } from 'react';
import { createClass } from '@/server/actions/class';
import { useRouter } from 'next/navigation';

export default function CreateClassPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await createClass({
      name: formData.get('name'),
      description: formData.get('description'),
      subject: formData.get('subject'),
    });

    if (result.ok && result.data) {
      router.push(`/kelas/${result.data.id}`);
    } else {
      setError(result.error || 'Gagal buat kelas');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1>Buat Kelas</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input name="name" placeholder="Nama Kelas" required />
        <textarea name="description" placeholder="Deskripsi" rows={4} />
        <input name="subject" placeholder="Mata Pelajaran" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Membuat...' : 'Buat Kelas'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
