'use client';

import { useState } from 'react';
import { signup } from '@/server/actions/auth';
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
    const result = await signup({
      email: formData.get('email'),
      username: formData.get('username'),
      displayName: formData.get('displayName'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (result.ok) {
      router.push('/login');
    } else {
      setError(result.error || 'Gagal daftar');
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 32 }}>
      <h1>Daftar</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="username" placeholder="Username" required />
        <input name="displayName" placeholder="Nama Tampilan" required />
        <input name="password" type="password" placeholder="Password" required />
        <input name="confirmPassword" type="password" placeholder="Konfirmasi Password" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Mendaftar...' : 'Daftar'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Sudah punya akun? <a href="/login">Masuk</a>
      </p>
    </div>
  );
}
