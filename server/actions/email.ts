'use server';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

interface EmailData {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(data: EmailData) {
  try {
    if (!RESEND_API_KEY || RESEND_API_KEY === 're_placeholder_key') {
      console.log('📧 [Dev] Email not sent (no API key):', data.subject);
      return { ok: true, message: 'Dev mode - email logged' };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'noreply@platform-diskusi.local',
        ...data,
      }),
    });

    if (!response.ok) {
      return { ok: false, error: 'Email service error' };
    }

    return { ok: true };
  } catch (error) {
    console.error('email error:', error);
    return { ok: false, error: 'Gagal kirim email' };
  }
}

export async function sendWelcomeEmail(email: string, displayName: string) {
  return sendEmail({
    to: email,
    subject: 'Selamat datang di Platform Diskusi',
    html: `
      <h2>Selamat datang, ${displayName}!</h2>
      <p>Akun kamu sudah siap. Mulai bergabung dengan kelas dan diskusi sekarang.</p>
      <a href="http://localhost:3000/dashboard">Buka Dashboard</a>
    `,
  });
}

export async function sendClassInviteEmail(email: string, className: string, joinCode: string) {
  return sendEmail({
    to: email,
    subject: `Undangan bergabung kelas: ${className}`,
    html: `
      <h2>Kamu diundang bergabung kelas</h2>
      <p><strong>${className}</strong></p>
      <p>Kode gabung: <code>${joinCode}</code></p>
      <a href="http://localhost:3000/kelas/gabung">Gabung Kelas</a>
    `,
  });
}

export async function sendNotificationEmail(email: string, message: string) {
  return sendEmail({
    to: email,
    subject: 'Notifikasi dari Platform Diskusi',
    html: `<p>${message}</p>`,
  });
}
