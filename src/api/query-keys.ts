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
  sortOrder?: 'asc' | 'desc';
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
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Users queries
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params?: GetUsersParams) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.users.details(), uuid] as const,
  },

  // Institutions queries
  institutions: {
    all: ['institutions'] as const,
    lists: () => [...queryKeys.institutions.all, 'list'] as const,
    list: (params?: PaginationParams & SearchParams & SortParams) => [...queryKeys.institutions.lists(), params] as const,
    details: () => [...queryKeys.institutions.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.institutions.details(), uuid] as const,
  },

  // Forms queries
  forms: {
    all: ['forms'] as const,
    lists: () => [...queryKeys.forms.all, 'list'] as const,
    list: (params?: GetFormsParams) => [...queryKeys.forms.lists(), params] as const,
    details: () => [...queryKeys.forms.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.forms.details(), uuid] as const,
  },

  // Submissions queries
  submissions: {
    all: ['submissions'] as const,
    lists: () => [...queryKeys.submissions.all, 'list'] as const,
    list: (params?: GetSubmissionsParams) => [...queryKeys.submissions.lists(), params] as const,
    details: () => [...queryKeys.submissions.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.submissions.details(), uuid] as const,
  },

  // Templates queries
  templates: {
    all: ['templates'] as const,
    lists: () => [...queryKeys.templates.all, 'list'] as const,
    list: (params?: GetTemplatesParams) => [...queryKeys.templates.lists(), params] as const,
    details: () => [...queryKeys.templates.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.templates.details(), uuid] as const,
  },

  // Phases queries
  phases: {
    all: ['phases'] as const,
    lists: () => [...queryKeys.phases.all, 'list'] as const,
    list: (params?: GetPhasesParams) => [...queryKeys.phases.lists(), params] as const,
    details: () => [...queryKeys.phases.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.phases.details(), uuid] as const,
  },

  // Products queries
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (params?: GetProductsParams) => [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (uuid: string) => [...queryKeys.products.details(), uuid] as const,
  },
} as const;
