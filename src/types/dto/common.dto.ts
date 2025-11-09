/**
 * Common DTOs
 *
 * Shared response types and error schemas
 * Backend: src/dto/common.dto.ts
 */

import { z } from 'zod';

// ============================================================================
// COMMON RESPONSE SCHEMAS
// ============================================================================

/**
 * Generic Success Response
 * Wraps data in standard API response format
 */
export const createSuccessResponse = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema,
  });
};

/**
 * Success Message Response (no data)
 * Backend: SuccessMessageResponse
 */
export const SuccessMessageResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.null().optional(),
});

export type SuccessMessageResponse = z.infer<typeof SuccessMessageResponseSchema>;

// ============================================================================
// ERROR RESPONSE SCHEMAS
// ============================================================================

/**
 * Validation Error Detail
 */
export const ValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});

/**
 * Error Response
 * Backend: ErrorResponse
 */
export const ErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  code: z.string().optional(),
  errors: z.record(z.array(z.string())).optional(),
  requestId: z.string().optional(),
  timestamp: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Bad Request Response (400)
 */
export const BadRequestResponseSchema = ErrorResponseSchema;
export type BadRequestResponse = z.infer<typeof BadRequestResponseSchema>;

/**
 * Unauthorized Response (401)
 */
export const UnauthorizedResponseSchema = ErrorResponseSchema;
export type UnauthorizedResponse = z.infer<typeof UnauthorizedResponseSchema>;

/**
 * Forbidden Response (403)
 */
export const ForbiddenResponseSchema = ErrorResponseSchema;
export type ForbiddenResponse = z.infer<typeof ForbiddenResponseSchema>;

/**
 * Not Found Response (404)
 */
export const NotFoundResponseSchema = ErrorResponseSchema;
export type NotFoundResponse = z.infer<typeof NotFoundResponseSchema>;

/**
 * Conflict Response (409)
 */
export const ConflictResponseSchema = ErrorResponseSchema;
export type ConflictResponse = z.infer<typeof ConflictResponseSchema>;

/**
 * Internal Server Error Response (500)
 */
export const InternalServerErrorResponseSchema = ErrorResponseSchema;
export type InternalServerErrorResponse = z.infer<typeof InternalServerErrorResponseSchema>;

// ============================================================================
// PAGINATION SCHEMAS
// ============================================================================

/**
 * Pagination Metadata
 */
export const PaginationMetaSchema = z.object({
  current_page: z.number(),
  per_page: z.number(),
  total: z.number(),
  last_page: z.number(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

/**
 * Paginated Response
 * Generic paginated list response
 */
export const createPaginatedResponse = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    success: z.boolean(),
    message: z.string(),
    data: z.array(dataSchema),
    meta: PaginationMetaSchema,
  });
};
