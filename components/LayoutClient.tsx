'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

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

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  function toggleDarkMode() {
    const html = document.documentElement;
    const newDark = !darkMode;
    if (newDark) html.classList.add('dark');
    else html.classList.remove('dark');
    setDarkMode(newDark);
    localStorage.setItem('darkMode', String(newDark));
  }

  const colors = mounted && darkMode ? COLORS_DARK : COLORS_LIGHT;

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
    * { box-sizing: border-box; }
    body { transition: background 0.2s, color 0.2s; }
    button:hover { background: var(--surface); }
    button:active { background: var(--action); color: var(--on-action); }
    input:focus, textarea:focus { border-color: var(--action); }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: 280,
            background: colors.surface,
            borderRight: `1px solid ${colors['border-subtle']}`,
            padding: 20,
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
        >
          <Link href="/">
            <h2 style={{ margin: '0 0 24px 0', color: colors['text-primary'], fontSize: 18 }}>
              Diskusi
            </h2>
          </Link>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/dashboard" style={{ color: colors.link }}>Kelas Ku</Link>
            <Link href="/kelas/buat" style={{ color: colors.link }}>Buat Kelas</Link>
            <Link href="/kelas/gabung" style={{ color: colors.link }}>Gabung Kelas</Link>
            <Link href="/auth/login" style={{ color: colors.link }}>Masuk</Link>
          </nav>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <header
            style={{
              background: colors.canvas,
              borderBottom: `1px solid ${colors['border-subtle']}`,
              padding: '12px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ color: colors['text-primary'], fontSize: 14 }}>Platform Diskusi</div>
            <button
              onClick={toggleDarkMode}
              style={{
                background: colors.action,
                color: colors['on-action'],
                border: 'none',
                padding: '6px 12px',
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {mounted && (darkMode ? '☀️' : '🌙')}
            </button>
          </header>

          {/* Content */}
          <main style={{ flex: 1, background: colors.canvas, color: colors['text-primary'], overflow: 'auto', padding: 20 }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
