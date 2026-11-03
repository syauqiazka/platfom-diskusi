import { describe, it, expect } from 'vitest';
import {
  SignupSchema,
  LoginSchema,
  CreateClassSchema,
  JoinClassSchema,
} from '@/lib/validators';

describe('Validators', () => {
  describe('SignupSchema', () => {
    it('valid signup data', () => {
      const data = {
        email: 'user@example.com',
        username: 'testuser',
        displayName: 'Test User',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };
      const result = SignupSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('reject mismatched passwords', () => {
      const data = {
        email: 'user@example.com',
        username: 'testuser',
        displayName: 'Test User',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!',
      };
      const result = SignupSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('reject invalid email', () => {
      const data = {
        email: 'not-an-email',
        username: 'testuser',
        displayName: 'Test User',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };
      const result = SignupSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('LoginSchema', () => {
    it('valid login data', () => {
      const data = {
        email: 'user@example.com',
        password: 'SecurePass123!',
      };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('reject missing email', () => {
      const data = {
        password: 'SecurePass123!',
      };
      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('CreateClassSchema', () => {
    it('valid class data', () => {
      const data = {
        name: 'Advanced React',
        description: 'Learn React at advanced level',
        subject: 'Programming',
      };
      const result = CreateClassSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('accept optional description', () => {
      const data = {
        name: 'Math 101',
        subject: 'Mathematics',
      };
      const result = CreateClassSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('reject missing name', () => {
      const data = {
        subject: 'Programming',
      };
      const result = CreateClassSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('JoinClassSchema', () => {
    it('valid join code', () => {
      const data = {
        joinCode: 'ABC123DEF456',
      };
      const result = JoinClassSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('reject empty join code', () => {
      const data = {
        joinCode: '',
      };
      const result = JoinClassSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
