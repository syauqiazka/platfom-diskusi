'use server';

import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import { canEditClass } from '@/lib/permissions';

export async function createMaterial(classId: string | null, input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  if (classId && !(await canEditClass(session.user.id, classId))) {
    return { ok: false, error: 'Tidak punya akses' };
  }

  const parsed = input as any;
  if (!parsed.title) return { ok: false, error: 'Judul diperlukan' };

  try {
    const material = await db.material.create({
      data: {
        classId: classId || null,
        title: parsed.title,
        type: parsed.type || 'DOCUMENT',
        fileUrl: parsed.fileUrl || null,
        authorId: session.user.id,
      },
    });
    return { ok: true, data: material };
  } catch (error) {
    console.error('createMaterial error:', error);
    return { ok: false, error: 'Gagal upload materi' };
  }
}

export async function getMaterials(classId?: string) {
  try {
    const materials = await db.material.findMany({
      where: classId ? { classId } : { classId: null },
      include: { author: { select: { id: true, displayName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { ok: true, data: materials };
  } catch (error) {
    console.error('getMaterials error:', error);
    return { ok: false, error: 'Gagal ambil materi' };
  }
}

export async function deleteMaterial(materialId: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  try {
    const material = await db.material.findUnique({ where: { id: materialId } });
    if (!material) return { ok: false, error: 'Materi tidak ditemukan' };
    if (material.authorId !== session.user.id) return { ok: false, error: 'Hanya uploader bisa hapus' };

    await db.material.delete({ where: { id: materialId } });
    return { ok: true };
  } catch (error) {
    console.error('deleteMaterial error:', error);
    return { ok: false, error: 'Gagal hapus materi' };
  }
}
