'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (result?.ok) {
      router.push('/dashboard');
    } else {
      setError(result?.error || 'Gagal masuk');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, padding: 32 }}>
      <h1 style={{ color: '#D9D28B' }}>Masuk</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
          {loading ? 'Masuk...' : 'Masuk'}
        </button>
      </form>
      {error && <p style={{ color: '#FF6B6B' }}>{error}</p>}
      <p style={{ color: '#EFEEDC' }}>
        Belum punya akun? <a href="/auth/signup" style={{ color: '#B2BD7E' }}>Daftar</a>
      </p>
    </div>
  );
}
