/**
 * useUserById Hook
 *
 * React Query hook for fetching a single user by UUID
 */

import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { queryKeys } from '@/api/query-keys';

export const useUserById = (uuid: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.users.detail(uuid),
    queryFn: () => usersApi.getUserById(uuid),
    enabled: enabled && !!uuid, // Only fetch if enabled and uuid exists
    staleTime: 5 * 60 * 1000, // 5 minutes (match backend cache)
  });
};
