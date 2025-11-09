/**
 * Query Key Factory
 *
 * Centralized query key management for React Query.
 * Provides type-safe, consistent cache keys across the application.
 *
 * Usage:
 * - Use in useQuery: queryKey: queryKeys.users.detail(uuid)
 * - Use for invalidation: queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
 */

// Base types for common query params
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SearchParams {
  search?: string;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export type GetUsersParams = PaginationParams & SearchParams & SortParams;
export type GetFormsParams = PaginationParams & SearchParams & SortParams;
export type GetSubmissionsParams = PaginationParams & SearchParams & SortParams;
export type GetTemplatesParams = PaginationParams & SearchParams & SortParams;
export type GetPhasesParams = PaginationParams & SearchParams & SortParams;
export type GetProductsParams = PaginationParams & SearchParams & SortParams;

/**
 * Query Keys Factory
 *
 * Hierarchical structure:
 * - all: Base key for the resource
 * - lists(): Key for all list queries
 * - list(params): Key for specific list query with params
 * - details(): Key for all detail queries
 * - detail(id): Key for specific detail query
 */
export const queryKeys = {
  // Auth queries
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
    session: () => [...queryKeys.auth.all, "session"] as const,
  },

  // Users queries
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (params?: GetUsersParams) =>
      [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (uuid: string) => [...queryKeys.users.details(), uuid] as const,
  },

  // Institutions queries
  institutions: {
    all: ["institutions"] as const,
    lists: () => [...queryKeys.institutions.all, "list"] as const,
    list: (params?: PaginationParams & SearchParams & SortParams) =>
      [...queryKeys.institutions.lists(), params] as const,
    details: () => [...queryKeys.institutions.all, "detail"] as const,
    detail: (uuid: string) =>
      [...queryKeys.institutions.details(), uuid] as const,
  },
} as const;
