import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import {
  canViewClass,
  canEditClass,
  canModerateGlobal,
  canModerateClass,
  canDeleteOwnContent,
} from '@/lib/permissions';

const prisma = new PrismaClient();

describe('permissions', () => {
  let userId: string;
  let classId: string;
  let teacherId: string;
  let adminId: string;

  beforeEach(async () => {
    await prisma.classMember.deleteMany();
    await prisma.class.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: {
        email: 'user@test.com',
        username: 'user',
        displayName: 'Test User',
        passwordHash: 'hash',
        role: 'MEMBER',
      },
    });
    userId = user.id;

    const teacher = await prisma.user.create({
      data: {
        email: 'teacher@test.com',
        username: 'teacher',
        displayName: 'Teacher',
        passwordHash: 'hash',
        role: 'MEMBER',
      },
    });
    teacherId = teacher.id;

    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        username: 'admin',
        displayName: 'Admin',
        passwordHash: 'hash',
        role: 'ADMIN',
      },
    });
    adminId = admin.id;

    const kelas = await prisma.class.create({
      data: {
        name: 'Test Class',
        description: 'Test',
        subject: 'Math',
        joinCode: 'TEST001',
      },
    });
    classId = kelas.id;

    await prisma.classMember.create({
      data: {
        userId: teacherId,
        classId,
        role: 'TEACHER',
      },
    });

    await prisma.classMember.create({
      data: {
        userId,
        classId,
        role: 'STUDENT',
      },
    });
  });

  afterEach(async () => {
    await prisma.classMember.deleteMany();
    await prisma.class.deleteMany();
    await prisma.user.deleteMany();
  });

  it('canDeleteOwnContent: true sama user', async () => {
    const result = await canDeleteOwnContent(userId, userId);
    expect(result).toBe(true);
  });

  it('canDeleteOwnContent: false beda user', async () => {
    const result = await canDeleteOwnContent(userId, teacherId);
    expect(result).toBe(false);
  });

  it('canViewClass: true member', async () => {
    const result = await canViewClass(userId, classId);
    expect(result).toBe(true);
  });

  it('canViewClass: false non-member', async () => {
    const otherUser = await prisma.user.create({
      data: {
        email: 'other@test.com',
        username: 'other',
        displayName: 'Other',
        passwordHash: 'hash',
        role: 'MEMBER',
      },
    });
    const result = await canViewClass(otherUser.id, classId);
    expect(result).toBe(false);
  });

  it('canEditClass: true teacher', async () => {
    const result = await canEditClass(teacherId, classId);
    expect(result).toBe(true);
  });

  it('canEditClass: true admin', async () => {
    const result = await canEditClass(adminId, classId);
    expect(result).toBe(true);
  });

  it('canEditClass: false student', async () => {
    const result = await canEditClass(userId, classId);
    expect(result).toBe(false);
  });

  it('canModerateGlobal: true admin', async () => {
    const result = await canModerateGlobal(adminId);
    expect(result).toBe(true);
  });

  it('canModerateGlobal: false member', async () => {
    const result = await canModerateGlobal(userId);
    expect(result).toBe(false);
  });

  it('canModerateClass: true teacher', async () => {
    const result = await canModerateClass(teacherId, classId);
    expect(result).toBe(true);
  });

  it('canModerateClass: true admin', async () => {
    const result = await canModerateClass(adminId, classId);
    expect(result).toBe(true);
  });

  it('canModerateClass: false student', async () => {
    const result = await canModerateClass(userId, classId);
    expect(result).toBe(false);
  });
});
