'use server';

import { db } from '@/lib/db';
import { SignupSchema } from '@/lib/validators';
import bcrypt from 'bcryptjs';

export async function signupReal(input: unknown) {
  const parsed = SignupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || 'Data tidak valid' };
  }

  try {
    const existing = await db.user.findFirst({
      where: { OR: [{ email: parsed.data.email }, { username: parsed.data.username }] },
    });

    if (existing) return { ok: false, error: 'Email atau username sudah terdaftar' };

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const user = await db.user.create({
      data: {
        email: parsed.data.email,
        username: parsed.data.username,
        displayName: parsed.data.displayName,
        passwordHash,
        role: 'MEMBER',
      },
    });

    return { ok: true, data: { id: user.id, email: user.email } };
  } catch (error) {
    console.error('signup error:', error);
    return { ok: false, error: 'Gagal daftar' };
  }
}

export async function verifyCredentials(email: string, password: string) {
  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) return null;

    if (user.suspendedUntil && user.suspendedUntil > new Date()) return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;

    return { id: user.id, email: user.email, username: user.username, name: user.displayName };
  } catch (error) {
    console.error('verify error:', error);
    return null;
  }
}
