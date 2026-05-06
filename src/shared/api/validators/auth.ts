import { z } from 'zod';

/**
 * Schema for user profile in authentication context
 */
export const UserProfileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  availableBalance: z.number(),
  reservedBalance: z.number(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * Schema for login request input
 */
export const LoginInputSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

/**
 * Schema for registration request input
 */
export const RegisterInputSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  fullName: z.string().min(1, 'Full name is required'),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

/**
 * Schema for authentication response from server
 */
export const AuthResponseSchema = z.object({
  accessToken: z.string(),
  user: UserProfileSchema,
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

/**
 * Schema for registration response from server
 */
export const RegisterResponseSchema = z.object({
  message: z.string(),
  email: z.string().email(),
});

export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
