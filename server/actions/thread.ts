'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { canViewClass } from '@/lib/permissions';

export async function createThread(classId: string | null, input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  if (classId && !(await canViewClass(session.user.id, classId))) {
    return { ok: false, error: 'Tidak punya akses' };
  }

  const parsed = input as any;
  if (!parsed.title || !parsed.content) {
    return { ok: false, error: 'Judul dan isi diperlukan' };
  }

  try {
    const thread = await db.thread.create({
      data: {
        classId: classId || null,
        title: parsed.title,
        content: parsed.content,
        authorId: session.user.id,
        status: 'VISIBLE',
        state: 'OPEN',
      },
    });
    return { ok: true, data: thread };
  } catch (error) {
    console.error('createThread error:', error);
    return { ok: false, error: 'Gagal buat diskusi' };
  }
}

export async function getThreads(classId?: string) {
  try {
    const threads = await db.thread.findMany({
      where: classId ? { classId } : { classId: null },
      include: {
        author: { select: { id: true, username: true, displayName: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    return { ok: true, data: threads };
  } catch (error) {
    console.error('getThreads error:', error);
    return { ok: false, error: 'Gagal ambil diskusi' };
  }
}

export async function deleteThread(threadId: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  try {
    const thread = await db.thread.findUnique({ where: { id: threadId } });
    if (!thread) return { ok: false, error: 'Diskusi tidak ditemukan' };
    if (thread.authorId !== session.user.id) return { ok: false, error: 'Hanya pembuat bisa hapus' };

    await db.thread.update({
      where: { id: threadId },
      data: { status: 'REMOVED' },
    });
    return { ok: true };
  } catch (error) {
    console.error('deleteThread error:', error);
    return { ok: false, error: 'Gagal hapus diskusi' };
  }
}
