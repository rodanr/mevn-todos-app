import { z } from 'zod';

export const registerUserSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name is too short')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(2, 'Last name is too short')
    .max(50, 'Last name is too long'),
  email: z.string().email('Invalid email format').max(255, 'Email is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').max(255, 'Email is too long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

// Inferred types from schemas
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
