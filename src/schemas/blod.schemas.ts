import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255),
    content: z.string().min(10),
  }),
});

export const updatePostSchema = z.object({
  params: z.object({ id: z.string().transform(Number) }),
  body: z.object({
    title: z.string().min(3).max(255).optional(),
    content: z.string().min(10).optional(),
    isActive: z.boolean().optional(), // admin‑only
  }),
});

export const postIdSchema = z.object({
  params: z.object({ id: z.string().transform(Number) }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostIdInput     = z.infer<typeof postIdSchema>;
