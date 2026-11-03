'use server';

import { db } from '@/lib/db';
import { SignupSchema, LoginSchema } from '@/lib/validators';
import { signIn } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function signup(input: unknown) {
  const parsed = SignupSchema.safeParse(input);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || 'Data tidak valid';
    return { ok: false, error: msg };
  }

  try {
    const existing = await db.user.findFirst({
      where: {
        OR: [
          { email: parsed.data.email },
          { username: parsed.data.username },
        ],
      },
    });

    if (existing) {
      return { ok: false, error: 'Email atau username sudah terdaftar' };
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await db.user.create({
      data: {
        email: parsed.data.email,
        username: parsed.data.username,
        displayName: parsed.data.displayName,
        passwordHash,
      },
    });

    return { ok: true, data: user };
  } catch (error) {
    console.error('signup error:', error);
    return { ok: false, error: 'Gagal daftar' };
  }
}

export async function login(email: string, password: string) {
  const parsed = LoginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { ok: false, error: 'Email atau password tidak valid' };
  }

  try {
    const result = await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });

    if (!result || !result.ok) {
      return { ok: false, error: 'Email atau password salah' };
    }

    return { ok: true };
  } catch (error) {
    console.error('login error:', error);
    return { ok: false, error: 'Gagal masuk' };
  }
}
