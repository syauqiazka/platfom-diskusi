'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { canDeleteOwnContent } from '@/lib/permissions';

export async function createComment(threadId: string, input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  const parsed = input as any;
  if (!parsed.content) return { ok: false, error: 'Isi komentar diperlukan' };

  try {
    const comment = await db.comment.create({
      data: {
        threadId,
        parentCommentId: parsed.parentCommentId || null,
        authorId: session.user.id,
        content: parsed.content,
        status: 'VISIBLE',
      },
    });
    return { ok: true, data: comment };
  } catch (error) {
    console.error('createComment error:', error);
    return { ok: false, error: 'Gagal buat komentar' };
  }
}

export async function getComments(threadId: string) {
  try {
    const comments = await db.comment.findMany({
      where: { threadId, status: 'VISIBLE' },
      include: {
        author: { select: { id: true, username: true, displayName: true } },
        replies: {
          where: { status: 'VISIBLE' },
          include: { author: { select: { id: true, username: true, displayName: true } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return { ok: true, data: comments };
  } catch (error) {
    console.error('getComments error:', error);
    return { ok: false, error: 'Gagal ambil komentar' };
  }
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  try {
    const comment = await db.comment.findUnique({ where: { id: commentId } });
    if (!comment) return { ok: false, error: 'Komentar tidak ditemukan' };

    if (!(await canDeleteOwnContent(session.user.id, comment.authorId))) {
      return { ok: false, error: 'Hanya pembuat bisa hapus' };
    }

    await db.comment.update({
      where: { id: commentId },
      data: { status: 'REMOVED' },
    });
    return { ok: true };
  } catch (error) {
    console.error('deleteComment error:', error);
    return { ok: false, error: 'Gagal hapus komentar' };
  }
}
