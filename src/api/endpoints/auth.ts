/**
 * Auth API Endpoints
 *
 * All authentication-related API calls
 * Backend base: /v1/auth
 */

import { apiClient } from '../client/axios';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  LogoutResponse,
  RegisterRequest,
} from '@/types/dto/auth.dto';

import { env } from '@/config/env';

export const authApi = {
  /**
   * Login
   * POST /v1/auth/login
   */
  login: (credentials: LoginRequest) =>
    apiClient.post<LoginResponse>(`${env.apiVersion}/auth/login`, credentials),

  /**
   * Logout
   * POST /v1/auth/logout
   */
  logout: () => apiClient.post<LogoutResponse>(`${env.apiVersion}/auth/logout`),

  /**
   * Refresh Token
   * POST /v1/auth/refresh
   */
  refresh: (data: RefreshTokenRequest) =>
    apiClient.post<RefreshTokenResponse>(`${env.apiVersion}/auth/refresh`, data),

  /**
   * Register (if backend supports)
   * POST /v1/auth/register
   */
  register: (data: RegisterRequest) =>
    apiClient.post<LoginResponse>(`${env.apiVersion}/auth/register`, data),
};
