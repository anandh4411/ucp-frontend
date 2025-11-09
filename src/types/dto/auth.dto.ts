/**
 * Auth DTOs
 *
 * Zod schemas matching backend auth DTOs exactly (see backend CLAUDE.md)
 * Backend: src/dto/auth.dto.ts
 */

import { z } from "zod";

// ============================================================================
// REQUEST SCHEMAS
// ============================================================================

/**
 * Login Request
 * Backend: POST /v1/auth/login
 */
export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/**
 * Refresh Token Request
 * Backend: POST /v1/auth/refresh
 */
export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;

/**
 * Register/Signup Request (if backend supports it)
 * Backend: POST /v1/auth/register
 */
export const RegisterRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

// ============================================================================
// RESPONSE SCHEMAS
// ============================================================================

/**
 * Auth Tokens Data
 * Returned by login and refresh endpoints
 */
export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type AuthTokens = z.infer<typeof AuthTokensSchema>;

/**
 * Login Response
 * Backend: LoginResponse
 */
export const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: AuthTokensSchema,
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;

/**
 * Refresh Token Response
 * Backend: RefreshTokenResponse
 */
export const RefreshTokenResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: AuthTokensSchema,
});

export type RefreshTokenResponse = z.infer<typeof RefreshTokenResponseSchema>;

/**
 * Logout Response
 * Backend: SuccessMessageResponse
 */
export const LogoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.null().optional(),
});

export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
