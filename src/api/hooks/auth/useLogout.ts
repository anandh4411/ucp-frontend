/**
 * useLogout Hook
 *
 * React Query mutation for user logout
 * Handles logout request and clears auth context
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { authApi } from "@/api/endpoints/auth";
import { showSuccess } from "@/lib/error-handler";

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),

    onSuccess: () => {
      queryClient.clear();
      logout();
      showSuccess("Logged out successfully", "See you soon!");
    },

    onError: () => {
      // Even if API call fails, clear local auth
      queryClient.clear();
      logout();
    },
  });
};
