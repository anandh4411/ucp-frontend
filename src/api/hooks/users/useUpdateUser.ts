/**
 * useUpdateUser Hook
 *
 * React Query mutation for updating a user with optimistic updates
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { UpdateUserRequest } from '@/types/dto/user.dto';
import { queryKeys } from '@/api/query-keys';
import { handleApiError, showSuccess } from '@/lib/error-handler';

interface UpdateUserVariables {
  uuid: string;
  data: UpdateUserRequest;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: UpdateUserVariables) => usersApi.updateUser(uuid, data),

    // Optimistic update - before API call
    onMutate: async ({ uuid, data }: UpdateUserVariables) => {
      // Cancel outgoing queries for this user
      await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(uuid) });

      // Snapshot the previous value
      const previousUser = queryClient.getQueryData(queryKeys.users.detail(uuid));

      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.users.detail(uuid), (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            ...data,
          },
        };
      });

      // Return context with previous value for rollback
      return { previousUser, uuid };
    },

    // On error, rollback to previous value
    onError: (error: any, variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.users.detail(context.uuid), context.previousUser);
      }
    },

    // Always refetch after success or error
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.uuid) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    },

    onSuccess: () => {
      showSuccess('User updated successfully');
    },
  });
};
