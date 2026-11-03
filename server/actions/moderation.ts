'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { canModerateGlobal } from '@/lib/permissions';

export async function reportContent(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  const parsed = input as any;
  if (!parsed.contentId || !parsed.reason) {
    return { ok: false, error: 'ID konten dan alasan diperlukan' };
  }

  try {
    const report = await db.report.create({
      data: {
        contentType: parsed.data.contentType || 'THREAD',
        contentId: parsed.data.contentId,
        reporterId: session.user.id,
        reason: parsed.data.reason,
        status: 'OPEN',
      },
    });
    return { ok: true, data: report };
  } catch (error) {
    console.error('reportContent error:', error);
    return { ok: false, error: 'Gagal lapor konten' };
  }
}

export async function getReports(status?: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  if (!(await canModerateGlobal(session.user.id))) {
    return { ok: false, error: 'Tidak punya akses' };
  }

  try {
    const reports = await db.report.findMany({
      where: status ? { status } : {},
      include: { reporter: { select: { id: true, displayName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { ok: true, data: reports };
  } catch (error) {
    console.error('getReports error:', error);
    return { ok: false, error: 'Gagal ambil laporan' };
  }
}

export async function hideContent(contentId: string, contentType: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  if (!(await canModerateGlobal(session.user.id))) {
    return { ok: false, error: 'Tidak punya akses' };
  }

  try {
    if (contentType === 'THREAD') {
      await db.thread.update({
        where: { id: contentId },
        data: { status: 'HIDDEN' },
      });
    } else if (contentType === 'COMMENT') {
      await db.comment.update({
        where: { id: contentId },
        data: { status: 'HIDDEN' },
      });
    } else if (contentType === 'MATERIAL') {
      await db.material.update({
        where: { id: contentId },
        data: { status: 'HIDDEN' },
      });
    }

    await db.report.updateMany({
      where: { contentId, status: 'OPEN' },
      data: { status: 'ACTIONED' },
    });

    return { ok: true };
  } catch (error) {
    console.error('hideContent error:', error);
    return { ok: false, error: 'Gagal sembunyikan konten' };
  }
}

export async function suspendUser(userId: string, hours: number) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  if (!(await canModerateGlobal(session.user.id))) {
    return { ok: false, error: 'Tidak punya akses' };
  }

  try {
    const suspendedUntil = new Date(Date.now() + hours * 3600000);
    await db.user.update({
      where: { id: userId },
      data: { suspendedUntil },
    });

    return { ok: true };
  } catch (error) {
    console.error('suspendUser error:', error);
    return { ok: false, error: 'Gagal suspend user' };
  }
}
