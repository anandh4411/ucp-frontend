/**
 * useLogin Hook
 *
 * React Query mutation for user login
 * Handles login request and updates auth context on success
 * Error handling is done globally in axios interceptor
 */

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/auth-context";
import { authApi } from "@/api/endpoints/auth";
import { LoginRequest } from "@/types/dto/auth.dto";
import { showSuccess } from "@/lib/error-handler";

export const useLogin = () => {
  const { login } = useAuth();
  const router = useRouter();

  const { mutate, isPending: isLoading } = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),

    onSuccess: (response: any) => {
      if (response.success && response.data) {
        login(response.data);
        showSuccess("Welcome back!", "Login successful");
        router.navigate({ to: "/dashboard" });
      } else {
        console.error("[useLogin] Invalid response structure:", response);
      }
    },

    onError: (error: any) => {
      // Error toast already shown by global handler
      // Just log for debugging
    },
  });

  return { loginUser: mutate, isLoading };
};
