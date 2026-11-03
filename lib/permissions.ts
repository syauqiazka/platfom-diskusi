import { db } from '@/lib/db';

export async function canViewClass(userId: string, classId: string): Promise<boolean> {
  const member = await db.classMember.findUnique({
    where: { userId_classId: { userId, classId } },
  });
  return !!member;
}

export async function canEditClass(userId: string, classId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  if (user.role === 'ADMIN') return true;

  const member = await db.classMember.findUnique({
    where: { userId_classId: { userId, classId } },
  });
  return member?.role === 'TEACHER' || member?.role === 'ASSISTANT';
}

export async function canModerateGlobal(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } });
  return user?.role === 'MODERATOR' || user?.role === 'ADMIN';
}

export async function canModerateClass(userId: string, classId: string): Promise<boolean> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return false;
  if (user.role === 'ADMIN') return true;

  const member = await db.classMember.findUnique({
    where: { userId_classId: { userId, classId } },
  });
  return member?.role === 'TEACHER' || member?.role === 'ASSISTANT';
}

export async function canDeleteOwnContent(userId: string, authorId: string): Promise<boolean> {
  return userId === authorId;
}
