import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number),
});

export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default("1"),
  limit: z.string().regex(/^\d+$/).transform(Number).default("10"),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const emailSchema = z
  .string()
  .email("Invalid email format")
  .max(100, "Email must be less than 100 characters");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(255, "Password must be less than 255 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  );

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");
  

  export const idParamSchemas = z.object({
  id: z.string().uuid("Invalid ID format"), // or z.string().regex(...) for other ID formats
});

export const titleSchema = z.string().min(5, "Title should be at least 5 characters");
export const contentSchema = z.string().min(10, "Content should be at least 10 characters");