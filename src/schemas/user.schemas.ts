import { z } from "zod";

import {
  emailSchema,
  passwordSchema,
  nameSchema,
  idParamSchema,
} from "./common.schemas";

export const createUserSchema = z.object({
  body: z.object({
   username: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(["user", "admin"]).default("user"),
  }),
});

export const updateUserSchema = z.object({
  params: idParamSchema,
  body: z
    .object({
      name: nameSchema.optional(),
      email: emailSchema.optional(),
      role: z.enum(["user", "admin"]).optional(),
      isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const getUserByIdSchema = z.object({
  params: idParamSchema,
});

export const searchUsersSchema = z.object({
  query: z
    .object({
      name: z.string().min(1, "Search term is required").optional(),
      email: z.string().email().optional(),
      role: z.enum(["user", "admin"]).optional(),
      isActive: z.boolean().optional(),
      isVerified: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one search parameter is required",
    }),
});

export const deleteUserSchema = z.object({
  params: idParamSchema,
});
// ...
export const changeRoleSchema = z.object({
  body: z.object({
    // Ensure the role being assigned is one of the valid roles
    role: z.enum(['user', 'admin']), // A super_admin can only assign 'user' or 'admin' roles
  }),
});
export const inviteUserSchema = z.object({
  body: z.object({
    username: nameSchema,
    email: emailSchema,
    // The role can only be 'user' or 'admin'. A super admin cannot create another super admin.
    role: z.enum(['user', 'admin'], {
      errorMap: () => ({ message: "Role must be either 'user' or 'admin'." })
    }),
  }),
});
export const updateMyProfileSchema = z.object({
  body: z.object({
    username: z.string().min(2, "Username is too short").optional(),
    bio: z.string().max(200, "Bio cannot be longer than 200 characters").nullable().optional(),
  }),
});
export type UpdateMyProfileInput = z.infer<typeof updateMyProfileSchema>;


export type InviteUserInput = z.infer<typeof inviteUserSchema>;



export const setupAccountSchema = z.object({
  params: z.object({
    token: z.string().min(1, 'A setup token is required.'),
  }),
  body: z.object({
    newPassword: passwordSchema, 
  }),
});


export type SetupAccountInput = z.infer<typeof setupAccountSchema>;
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserByIdInput = z.infer<typeof getUserByIdSchema>;
export type SearchUsersInput = z.infer<typeof searchUsersSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;