'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function addGamificationPoints(userId: string, action: string, points: number) {
  const pointsMap = {
    'thread-create': 10,
    'comment-create': 5,
    'thread-vote': 1,
    'comment-helpful': 3,
    'class-join': 2,
  };

  const pts = pointsMap[action as keyof typeof pointsMap] || points;

  try {
    // Placeholder: akan simpan ke DB saat DB real ready
    console.log(`Added ${pts} points to ${userId} for ${action}`);
    return { ok: true, points: pts };
  } catch (error) {
    console.error('gamification error:', error);
    return { ok: false, error: 'Gagal tambah poin' };
  }
}

export async function getUserStats(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        threads: true,
        comments: true,
        memberships: true,
      },
    });

    if (!user) return { ok: false, error: 'User tidak ditemukan' };

    return {
      ok: true,
      data: {
        username: user.username,
        displayName: user.displayName,
        threads: user.threads.length,
        comments: user.comments.length,
        classes: user.memberships.length,
      },
    };
  } catch (error) {
    console.error('stats error:', error);
    return { ok: false, error: 'Gagal ambil statistik' };
  }
}
