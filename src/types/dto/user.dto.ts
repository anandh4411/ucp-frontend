/**
 * User DTOs
 *
 * Zod schemas matching backend user DTOs exactly (see backend CLAUDE.md)
 * Backend: src/dto/user.dto.ts
 */

import { z } from 'zod';

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Create User Request
 * Backend: POST /v1/users
 */
export const CreateUserRequestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

/**
 * Update User Request
 * Backend: PUT /v1/users/:uuid
 */
export const UpdateUserRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

/**
 * User UUID Parameter
 * Backend: UserIdParam
 */
export const UserUuidParamSchema = z.object({
  uuid: z.string().uuid('Invalid UUID format'),
});

export type UserUuidParam = z.infer<typeof UserUuidParamSchema>;

/**
 * Get Users Query Parameters
 * Backend: Query parameters for GET /v1/users
 */
export const GetUsersParamsSchema = z.object({
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type GetUsersParams = z.infer<typeof GetUsersParamsSchema>;

// ============================================================================
// DATA SCHEMAS
// ============================================================================

/**
 * User Data
 * Backend: UserData (matches backend response)
 */
export const UserDataSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  status: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  roles: z.array(z.string()).optional(),
});

export type User = z.infer<typeof UserDataSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Create User Response
 * Backend: CreateUserResponse
 */
export const CreateUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: UserDataSchema,
});

export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

/**
 * Get User Response
 * Backend: GetUserResponse
 */
export const GetUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: UserDataSchema,
});

export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;

/**
 * Get Users List Response
 * Backend: GetUsersResponse (paginated)
 */
export const GetUsersResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(UserDataSchema),
  meta: z
    .object({
      current_page: z.number(),
      per_page: z.number(),
      total: z.number(),
      last_page: z.number(),
    })
    .optional(),
});

export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;

/**
 * Update User Response
 * Backend: UpdateUserResponse
 */
export const UpdateUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: UserDataSchema,
});

export type UpdateUserResponse = z.infer<typeof UpdateUserResponseSchema>;

/**
 * Delete User Response
 * Backend: DeleteUserResponse
 */
export const DeleteUserResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.null().optional(),
});

export type DeleteUserResponse = z.infer<typeof DeleteUserResponseSchema>;
