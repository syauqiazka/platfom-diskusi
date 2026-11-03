// Prisma seed script untuk test data
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.thread.deleteMany();
  await prisma.classMember.deleteMany();
  await prisma.user.deleteMany();
  await prisma.class.deleteMany();

  // Create test users
  const passwordHash = await bcrypt.hash('TestPass123!', 10);

  await prisma.user.create({
    data: {
      email: 'admin@test.com',
      username: 'admin',
      displayName: 'Admin User',
      passwordHash,
      role: 'ADMIN',
    },
  });

  const teacher = await prisma.user.create({
    data: {
      email: 'teacher@test.com',
      username: 'teacher',
      displayName: 'Guru Matematika',
      passwordHash,
      role: 'MEMBER',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student1@test.com',
      username: 'student1',
      displayName: 'Siswa 1',
      passwordHash,
      role: 'MEMBER',
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@test.com',
      username: 'student2',
      displayName: 'Siswa 2',
      passwordHash,
      role: 'MEMBER',
    },
  });

  // Create class
  const kelas = await prisma.class.create({
    data: {
      name: 'Matematika Lanjut',
      description: 'Diskusi dan belajar bersama',
      subject: 'Matematika',
      joinCode: 'MATH001ABC',
    },
  });

  // Add members
  await prisma.classMember.create({
    data: {
      userId: teacher.id,
      classId: kelas.id,
      role: 'TEACHER',
    },
  });

  await prisma.classMember.create({
    data: {
      userId: student1.id,
      classId: kelas.id,
      role: 'STUDENT',
    },
  });

  await prisma.classMember.create({
    data: {
      userId: student2.id,
      classId: kelas.id,
      role: 'STUDENT',
    },
  });

  // Create thread
  await prisma.thread.create({
    data: {
      classId: kelas.id,
      title: 'Pertanyaan tentang integral',
      content: 'Gimana cara hitung integral ini?',
      authorId: student1.id,
      status: 'VISIBLE',
      state: 'OPEN',
    },
  });

  console.log('✅ Seeded test data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
