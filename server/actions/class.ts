'use server';

import { db } from '@/lib/db';
import { CreateClassSchema, JoinClassSchema } from '@/lib/validators';
import { auth } from '@/lib/auth';
import { nanoid } from 'nanoid';

export async function createClass(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  const parsed = CreateClassSchema.safeParse(input);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || 'Data tidak valid';
    return { ok: false, error: msg };
  }

  try {
    const joinCode = nanoid(12).toUpperCase().slice(0, 12);
    
    const newClass = await db.class.create({
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        subject: parsed.data.subject,
        joinCode,
      },
    });

    // Creator menjadi teacher
    await db.classMember.create({
      data: {
        userId: session.user.id,
        classId: newClass.id,
        role: 'TEACHER',
      },
    });

    return { ok: true, data: newClass };
  } catch (error) {
    console.error('createClass error:', error);
    return { ok: false, error: 'Gagal buat kelas' };
  }
}

export async function joinClass(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  const parsed = JoinClassSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: 'Kode gabung tidak valid' };
  }

  try {
    const kelas = await db.class.findUnique({
      where: { joinCode: parsed.data.joinCode },
    });

    if (!kelas) return { ok: false, error: 'Kode gabung tidak ditemukan' };

    // Cek sudah member atau belum
    const existing = await db.classMember.findUnique({
      where: { userId_classId: { userId: session.user.id, classId: kelas.id } },
    });

    if (existing) return { ok: false, error: 'Kamu sudah di kelas ini' };

    // Join sebagai STUDENT
    await db.classMember.create({
      data: {
        userId: session.user.id,
        classId: kelas.id,
        role: 'STUDENT',
      },
    });

    return { ok: true, data: kelas };
  } catch (error) {
    console.error('joinClass error:', error);
    return { ok: false, error: 'Gagal gabung kelas' };
  }
}

export async function getMyClasses() {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  try {
    const memberships = await db.classMember.findMany({
      where: { userId: session.user.id },
      include: { class: true },
    });

    return { ok: true, data: memberships };
  } catch (error) {
    console.error('getMyClasses error:', error);
    return { ok: false, error: 'Gagal ambil daftar kelas' };
  }
}

export async function getClassMembers(classId: string) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: 'Belum masuk' };

  try {
    const canView = await db.classMember.findUnique({
      where: { userId_classId: { userId: session.user.id, classId } },
    });

    if (!canView) return { ok: false, error: 'Kamu tidak anggota kelas ini' };

    const members = await db.classMember.findMany({
      where: { classId },
      include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
      orderBy: { role: 'asc' },
    });

    return { ok: true, data: members };
  } catch (error) {
    console.error('getClassMembers error:', error);
    return { ok: false, error: 'Gagal ambil anggota' };
  }
}
