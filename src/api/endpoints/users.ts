/**
 * Users API Endpoints
 *
 * All user management API calls
 * Backend base: /v1/users
 */

import { apiClient } from '../client/axios';
import {
  CreateUserRequest,
  UpdateUserRequest,
  GetUsersParams,
  CreateUserResponse,
  GetUserResponse,
  GetUsersResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from '@/types/dto/user.dto';

import { env } from '@/config/env';

export const usersApi = {
  /**
   * Get Users List (with pagination)
   * GET /v1/users
   */
  getUsers: (params?: GetUsersParams) =>
    apiClient.get<GetUsersResponse>(`${env.apiVersion}/users`, { params }),

  /**
   * Get User by UUID
   * GET /v1/users/:uuid
   */
  getUserById: (uuid: string) =>
    apiClient.get<GetUserResponse>(`${env.apiVersion}/users/${uuid}`),

  /**
   * Create User
   * POST /v1/users
   */
  createUser: (data: CreateUserRequest) =>
    apiClient.post<CreateUserResponse>(`${env.apiVersion}/users`, data),

  /**
   * Update User
   * PUT /v1/users/:uuid
   */
  updateUser: (uuid: string, data: UpdateUserRequest) =>
    apiClient.put<UpdateUserResponse>(`${env.apiVersion}/users/${uuid}`, data),

  /**
   * Delete User (soft delete)
   * DELETE /v1/users/:uuid
   */
  deleteUser: (uuid: string) =>
    apiClient.delete<DeleteUserResponse>(`${env.apiVersion}/users/${uuid}`),
};
