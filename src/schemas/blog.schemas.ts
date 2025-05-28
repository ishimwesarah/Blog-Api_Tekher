import { z } from "zod";
import { idParamSchema, titleSchema, contentSchema } from "./common.schemas";

export const createPostSchema = z.object({
  body: z.object({
    title: titleSchema,
    content: contentSchema,
    // No authorId here; we'll get it from the token
  }),
});

export const updatePostSchema = z.object({
  params: idParamSchema,
  body: z
    .object({
      title: titleSchema.optional(),
      content: contentSchema.optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const getPostByIdSchema = z.object({
  params: idParamSchema,
});

export const deletePostSchema = z.object({
  params: idParamSchema,
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type GetPostByIdInput = z.infer<typeof getPostByIdSchema>;
export type DeletePostInput = z.infer<typeof deletePostSchema>;
