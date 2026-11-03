'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { canModerateGlobal } from '@/lib/permissions';

export async function getUsers(page = 1) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  if (!(await canModerateGlobal(session.user.id))) {
    return { ok: false, error: 'Tidak punya akses' };
  }

  try {
    const users = await db.user.findMany({
      skip: (page - 1) * 20,
      take: 20,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        role: true,
        suspendedUntil: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await db.user.count();

    return { ok: true, data: { users, total, pages: Math.ceil(total / 20) } };
  } catch (error) {
    console.error('getUsers error:', error);
    return { ok: false, error: 'Gagal ambil users' };
  }
}

export async function updateUserRole(userId: string, role: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== 'ADMIN') {
    return { ok: false, error: 'Hanya admin bisa ubah role' };
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { role: role as any },
    });
    return { ok: true };
  } catch (error) {
    console.error('updateUserRole error:', error);
    return { ok: false, error: 'Gagal ubah role' };
  }
}

export async function getSystemStats() {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  if (!(await canModerateGlobal(session.user.id))) {
    return { ok: false, error: 'Tidak punya akses' };
  }

  try {
    const [userCount, classCount, threadCount, reportCount] = await Promise.all([
      db.user.count(),
      db.class.count(),
      db.thread.count(),
      db.report.count({ where: { status: 'OPEN' } }),
    ]);

    return {
      ok: true,
      data: { userCount, classCount, threadCount, reportCount },
    };
  } catch (error) {
    console.error('getSystemStats error:', error);
    return { ok: false, error: 'Gagal ambil statistik' };
  }
}
