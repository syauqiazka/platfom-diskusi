'use client';

import { useState } from 'react';
import { login } from '@/server/actions/auth';
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
    const result = await login(
      formData.get('email') as string,
      formData.get('password') as string
    );

    if (result.ok) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Gagal masuk');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 32 }}>
      <h1>Masuk</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Masuk...' : 'Masuk'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Belum punya akun? <a href="/auth/signup">Daftar</a>
      </p>
    </div>
  );
}
