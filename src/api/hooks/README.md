# API Hooks - Usage Guide

## Overview

This directory contains React Query hooks for API integration. Error handling is **centralized in the axios interceptor**, eliminating the need for repetitive error handling in each hook.

## Architecture

### Error Handling Flow

```
API Call → Axios Interceptor → Error Transformer → Global Toast Handler
```

1. **Axios Interceptor** (`src/api/client/axios.ts`): Catches all API errors
2. **Error Transformer**: Converts backend `ErrorResponse` to frontend `ApiError`
3. **Global Handler** (`src/lib/error-handler.ts`): Shows toast notifications automatically

### Benefits

- **DRY**: No duplicate error handling in hooks
- **Consistent UX**: All errors shown in same format
- **Loosely Coupled**: Hooks don't need to know about toasts
- **Production-Ready**: Matches backend error structure exactly

## Basic Usage

### Query Hook (GET)

```typescript
// src/api/hooks/users/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { queryKeys } from '@/api/query-keys';

export const useUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.getUsers(params),
  });
};

// Usage in component
const { data, isLoading, error } = useUsers({ page: 1 });
// Errors automatically show toast - no manual handling needed!
```

### Mutation Hook (POST/PUT/DELETE)

```typescript
// src/api/hooks/users/useCreateUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { queryKeys } from '@/api/query-keys';
import { showSuccess } from '@/lib/error-handler';

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      showSuccess('User created successfully');
    },

    // No onError needed - handled globally!
  });
};

// Usage
const createUser = useCreateUser();
await createUser.mutateAsync({ name: 'John', email: 'john@example.com' });
```

## Advanced Usage

### Custom Error Handling (Optional)

If you need **specific error handling** for a particular hook, you can override the global behavior:

```typescript
import { useMutation } from '@tanstack/react-query';
import { handleApiError } from '@/lib/error-handler';
import { ApiError } from '@/api/client/types';

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (uuid: string) => usersApi.deleteUser(uuid),

    onSuccess: () => {
      showSuccess('User deleted successfully');
    },

    onError: (error: ApiError) => {
      // Custom handling for 404
      if (error.code === 'NOT_FOUND') {
        // Custom logic - global toast still shows
        router.navigate({ to: '/users' });
      }

      // Or suppress global toast and show custom message
      handleApiError(error, {
        silent: true // Suppress global toast
      });
      showError('Failed to delete user. Please try again.');
    },
  });
};
```

### Silent Mode (No Toast)

For background operations where you don't want to show toasts:

```typescript
export const usePrefetchUser = () => {
  return useQuery({
    queryKey: queryKeys.users.detail(uuid),
    queryFn: () => usersApi.getUserById(uuid),

    // Errors won't show toast, but are still logged in dev mode
    meta: {
      errorHandler: (error: ApiError) => {
        handleApiError(error, { silent: true });
      },
    },
  });
};
```

### Optimistic Updates

```typescript
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(uuid, data),

    // Before mutation
    onMutate: async ({ uuid, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(uuid) });
      const previous = queryClient.getQueryData(queryKeys.users.detail(uuid));

      queryClient.setQueryData(queryKeys.users.detail(uuid), (old: any) => ({
        ...old,
        data: { ...old.data, ...data },
      }));

      return { previous };
    },

    // On error, rollback
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.users.detail(variables.uuid),
          context.previous
        );
      }
      // Global error toast still shows automatically
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(variables.uuid)
      });
    },

    onSuccess: () => {
      showSuccess('User updated successfully');
    },
  });
};
```

## Manual Toast Usage

You can manually trigger toasts anywhere in your application:

```typescript
import { showSuccess, showError, showInfo, showWarning } from '@/lib/error-handler';
import { toaster } from '@/lib/toaster';

// Using helper functions
showSuccess('Operation completed!');
showError('Something went wrong');
showInfo('New feature available');
showWarning('Your session will expire soon');

// Direct toaster access (more control)
toaster.success('Title', 'Description here');
toaster.error('Error Title', 'Error description');
toaster.info('Info', 'Some information');
toaster.warn('Warning', 'Be careful!');
```

## Error Codes from Backend

The system automatically handles these error codes from backend:

- `UNAUTHORIZED` (401): "Authentication Required"
- `FORBIDDEN` (403): "Access Denied"
- `BAD_REQUEST` (400): "Invalid Request" (with validation details)
- `NOT_FOUND` (404): "Not Found"
- `CONFLICT` (409): "Conflict"
- `UNPROCESSABLE_ENTITY` (422): "Invalid Data"
- `TOO_MANY_REQUESTS` (429): "Rate Limit Exceeded"
- `INTERNAL_ERROR` (500+): "Server Error"

## Validation Errors

Backend validation errors are automatically formatted:

```typescript
// Backend sends:
{
  success: false,
  error: {
    code: "BAD_REQUEST",
    message: "Validation failed",
    details: {
      errors: [
        { field: "email", message: "Invalid email format", code: "invalid_string" },
        { field: "name", message: "Required", code: "required" }
      ]
    }
  }
}

// Frontend shows toast:
// Title: "Validation Failed"
// Description:
// email: Invalid email format
// name: Required
```

## Best Practices

1. **Don't repeat error handling**: Let the global handler do its job
2. **Use `showSuccess`** for success messages after mutations
3. **Only add custom `onError`** if you need specific logic (e.g., navigation, rollback)
4. **Use `silent: true`** for background operations that shouldn't notify users
5. **Keep hooks simple**: Focus on data fetching, not error UI

## Migration from Old Code

### Before (Repetitive)
```typescript
export const useCreateUser = () => {
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      toast.success('User created');
    },
    onError: (error: any) => {
      if (error.status === 400) {
        toast.error('Validation error', formatErrors(error.errors));
      } else if (error.status === 401) {
        toast.error('Unauthorized');
      } else {
        toast.error('Error', error.message);
      }
    },
  });
};
```

### After (Clean)
```typescript
export const useCreateUser = () => {
  return useMutation({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      showSuccess('User created successfully');
    },
    // That's it! Errors handled globally
  });
};
```

## Debugging

In development mode, all errors are logged to console with full details:

```javascript
// Console output
API Error: {
  code: "BAD_REQUEST",
  statusCode: 400,
  message: "Validation failed",
  details: { ... },
  requestId: "req-123",
  timestamp: "2025-01-08T...",
  path: "/v1/users",
  url: "/v1/users",
  method: "POST"
}
```

## Testing

When testing hooks, mock the API client, not the error handler:

```typescript
import { renderHook } from '@testing-library/react';
import { useCreateUser } from './useCreateUser';
import * as usersApi from '@/api/endpoints/users';

jest.mock('@/api/endpoints/users');

it('creates user successfully', async () => {
  (usersApi.createUser as jest.Mock).mockResolvedValue({
    success: true,
    data: { id: 1, name: 'John' },
  });

  const { result } = renderHook(() => useCreateUser());
  await result.current.mutateAsync({ name: 'John', email: 'john@test.com' });

  expect(result.current.isSuccess).toBe(true);
});
```
