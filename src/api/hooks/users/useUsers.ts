/**
 * useUsers Hook
 *
 * React Query hook for fetching users list with pagination
 */

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { queryKeys, GetUsersParams } from '@/api/query-keys';

export const useUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes (match backend cache)
  });
};
