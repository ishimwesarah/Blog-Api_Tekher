import { z } from 'zod';

// Schema for creating a new recipe
// ...
export const createRecipeSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    cookTime: z.string().min(1),
    // imageUrl is now handled by the file upload, so we remove it from here.
    ingredients: z.array(z.string().min(1)).min(1),
    instructions: z.array(z.string().min(1)).min(1),
  })
});
// ...

// Schema for updating an existing recipe
// All fields are optional because the user might only want to change one thing.
export const updateRecipeSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    cookTime: z.string().min(1).optional(),
    imageUrl: z.string().url().optional(),
    ingredients: z.array(z.string().min(1)).min(1).optional(),
    instructions: z.array(z.string().min(1)).min(1).optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"), // Ensure the ID in the URL is a number
  }),
});

// Define TypeScript types from our schemas
export type CreateRecipeInput = z.infer<typeof createRecipeSchema>['body'];
export type UpdateRecipeInput = z.infer<typeof updateRecipeSchema>['body'];