import { z } from 'zod';
import { emailSchema, passwordSchema, nameSchema } from './common.schemas';

export const signupSchema = z.object({
  body: z.object({
    username: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(['user', 'admin', 'super_admin']).default('user')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required')
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema
  })
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, 'Token is required')
  }),
  body: z.object({
    newPassword: passwordSchema
  })
});

export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string().min(1, 'Token is required')
  })
});
export const ResendVerificationInput = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;