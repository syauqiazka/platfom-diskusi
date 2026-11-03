'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
        displayName: formData.get('displayName'),
      }),
    }).then(r => r.json());

    if (result.ok) {
      router.push('/auth/login');
    } else {
      setError(result.error || 'Gagal daftar');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, padding: 32 }}>
      <h1 style={{ color: '#D9D28B' }}>Daftar</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input 
          name="displayName" 
          placeholder="Nama Lengkap" 
          required 
          style={{ padding: 8, borderRadius: 4, border: '1px solid #333A2D', backgroundColor: '#1D221A', color: '#EFEEDC' }}
        />
        <input 
          name="email" 
          type="email" 
          placeholder="Email" 
          required 
          style={{ padding: 8, borderRadius: 4, border: '1px solid #333A2D', backgroundColor: '#1D221A', color: '#EFEEDC' }}
        />
        <input 
          name="password" 
          type="password" 
          placeholder="Password" 
          required 
          style={{ padding: 8, borderRadius: 4, border: '1px solid #333A2D', backgroundColor: '#1D221A', color: '#EFEEDC' }}
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: 8,
            borderRadius: 4,
            backgroundColor: '#D9D28B',
            color: '#1A1F14',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          {loading ? 'Daftar...' : 'Daftar'}
        </button>
      </form>
      {error && <p style={{ color: '#FF6B6B' }}>{error}</p>}
      <p style={{ color: '#EFEEDC' }}>
        Sudah punya akun? <a href="/auth/login" style={{ color: '#B2BD7E' }}>Masuk</a>
      </p>
    </div>
  );
}
