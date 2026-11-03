'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const COLORS_LIGHT = {
  canvas: '#F5F3E3',
  surface: '#FBFAF1',
  'border-subtle': '#DAD7BC',
  'text-primary': '#232A1C',
  action: '#56634A',
  'on-action': '#FFFFFF',
  link: '#56634A',
};

const COLORS_DARK = {
  canvas: '#151912',
  surface: '#1D221A',
  'border-subtle': '#333A2D',
  'text-primary': '#EFEEDC',
  action: '#D9D28B',
  'on-action': '#1A1F14',
  link: '#B2BD7E',
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [mounted, status, router]);

  if (!mounted || status === 'loading') {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  function toggleDarkMode() {
    const html = document.documentElement;
    const newDark = !darkMode;
    if (newDark) html.classList.add('dark');
    else html.classList.remove('dark');
    setDarkMode(newDark);
    localStorage.setItem('darkMode', String(newDark));
  }

  const colors = darkMode ? COLORS_DARK : COLORS_LIGHT;

  const globalStyles = `
    :root {
      --canvas: ${colors.canvas};
      --surface: ${colors.surface};
      --border-subtle: ${colors['border-subtle']};
      --text-primary: ${colors['text-primary']};
      --action: ${colors.action};
      --on-action: ${colors['on-action']};
      --link: ${colors.link};
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.canvas, color: colors['text-primary'] }}>
        {/* Sidebar */}
        <aside style={{
          width: 240,
          backgroundColor: colors.surface,
          borderRight: `1px solid ${colors['border-subtle']}`,
          padding: 24,
          overflowY: 'auto',
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 32, color: colors.action }}>
            Platform Diskusi
          </div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/dashboard" style={{
              padding: '8px 12px',
              borderRadius: 6,
              textDecoration: 'none',
              color: pathname === '/dashboard' ? colors.action : colors['text-primary'],
              backgroundColor: pathname === '/dashboard' ? colors.canvas : 'transparent',
              fontSize: 14,
            }}>
              Kelas Ku
            </Link>
            <Link href="/kelas/buat" style={{
              padding: '8px 12px',
              borderRadius: 6,
              textDecoration: 'none',
              color: pathname.startsWith('/kelas/buat') ? colors.action : colors['text-primary'],
              backgroundColor: pathname.startsWith('/kelas/buat') ? colors.canvas : 'transparent',
              fontSize: 14,
            }}>
              Buat Kelas
            </Link>
            <Link href="/kelas/gabung" style={{
              padding: '8px 12px',
              borderRadius: 6,
              textDecoration: 'none',
              color: pathname.startsWith('/kelas/gabung') ? colors.action : colors['text-primary'],
              backgroundColor: pathname.startsWith('/kelas/gabung') ? colors.canvas : 'transparent',
              fontSize: 14,
            }}>
              Gabung Kelas
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <header style={{
            backgroundColor: colors.surface,
            borderBottom: `1px solid ${colors['border-subtle']}`,
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button
                onClick={toggleDarkMode}
                style={{
                  border: `1px solid ${colors['border-subtle']}`,
                  backgroundColor: colors.action,
                  color: colors['on-action'],
                  padding: '6px 12px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <span style={{ fontSize: 14 }}>{session?.user?.email}</span>
            </div>
          </header>

          {/* Content */}
          <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
