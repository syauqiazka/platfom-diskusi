import { z } from 'zod';

export const SignupSchema = z.object({
  email: z.string().email('Email tidak valid'),
  username: z.string().min(3, 'Username minimal 3 karakter').max(30),
  displayName: z.string().min(2, 'Nama tampilan minimal 2 karakter').max(60),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

export const LoginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib'),
});

export const CreateClassSchema = z.object({
  name: z.string().min(3, 'Nama kelas minimal 3 karakter').max(100),
  description: z.string().max(500).optional(),
  subject: z.string().max(80).optional(),
});

export const JoinClassSchema = z.object({
  joinCode: z.string().length(12, 'Kode gabung harus 12 karakter'),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateClassInput = z.infer<typeof CreateClassSchema>;
export type JoinClassInput = z.infer<typeof JoinClassSchema>;
