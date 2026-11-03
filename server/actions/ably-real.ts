'use server';

export async function getAblyAuthToken() {
  try {
    // Server generates token for client to connect to Ably
    const response = await fetch('https://rest.ably.io/keys', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.ABLY_API_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyName: process.env.ABLY_API_KEY?.split(':')[0],
        ttl: 3600,
      }),
    });

    if (!response.ok) {
      return { ok: false, error: 'Failed to get Ably token' };
    }

    const token = await response.json();
    return { ok: true, data: token };
  } catch (error) {
    console.error('ably token error:', error);
    return { ok: false, error: 'Gagal ambil token Ably' };
  }
}

export async function publishChatMessage(channelName: string, message: { userId: string; username: string; content: string }) {
  try {
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) return { ok: false, error: 'Ably not configured' };

    const auth = Buffer.from(`${apiKey}:`).toString('base64');
    const response = await fetch(`https://rest.ably.io/channels/${encodeURIComponent(channelName)}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'chat-message',
        data: message,
      }),
    });

    if (!response.ok) {
      return { ok: false, error: 'Failed to publish message' };
    }

    return { ok: true };
  } catch (error) {
    console.error('publish error:', error);
    return { ok: false, error: 'Gagal kirim pesan' };
  }
}
