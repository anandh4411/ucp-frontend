/**
 * useCreateUser Hook
 *
 * React Query mutation for creating a new user
 * Error handling is done globally in axios interceptor
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { CreateUserRequest } from '@/types/dto/user.dto';
import { queryKeys } from '@/api/query-keys';
import { showSuccess } from '@/lib/error-handler';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),

    onSuccess: () => {
      // Invalidate users list to trigger refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      showSuccess('User created successfully');
    },

    // Note: onError removed - handled globally in axios interceptor
    // If you need custom error handling for specific cases, you can add it here
  });
};
