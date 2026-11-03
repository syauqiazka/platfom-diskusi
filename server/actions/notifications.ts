'use server';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export async function sendNotification(userId: string, message: string, type: string = 'info') {
  try {
    const notif = {
      id: `${Date.now()}`,
      userId,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };

    // Store in Redis with 24h expiration
    await redis.setex(
      `notification:${userId}:${notif.id}`,
      86400,
      JSON.stringify(notif)
    );

    // Also push to user's notification list
    await redis.lpush(`notifications:${userId}`, JSON.stringify(notif));

    return { ok: true, data: notif };
  } catch (error) {
    console.error('notification error:', error);
    return { ok: false, error: 'Gagal kirim notifikasi' };
  }
}

export async function getUserNotifications(userId: string) {
  try {
    const notifs = await redis.lrange(`notifications:${userId}`, 0, 20);
    return { ok: true, data: notifs.map((n: string) => JSON.parse(n)) };
  } catch (error) {
    console.error('get notifications error:', error);
    return { ok: false, error: 'Gagal ambil notifikasi' };
  }
}

export async function markNotificationRead(userId: string, notifId: string) {
  try {
    await redis.del(`notification:${userId}:${notifId}`);
    return { ok: true };
  } catch (error) {
    console.error('mark read error:', error);
    return { ok: false, error: 'Gagal tandai dibaca' };
  }
}
