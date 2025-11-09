/**
 * useDeleteUser Hook
 *
 * React Query mutation for deleting a user (soft delete)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { queryKeys } from '@/api/query-keys';
import { handleApiError, showSuccess } from '@/lib/error-handler';

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => usersApi.deleteUser(uuid),

    onSuccess: (data, uuid) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(uuid) });
      showSuccess('User deleted successfully');
    },
  });
};
