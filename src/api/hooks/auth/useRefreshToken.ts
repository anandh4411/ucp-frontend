/**
 * useRefreshToken Hook
 *
 * React Query mutation for refreshing access tokens
 * Note: Token refresh is already handled automatically by axios interceptor
 * This hook is for manual refresh if needed
 */

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/api/endpoints/auth";
import { RefreshTokenRequest } from "@/types/dto/auth.dto";
import { TokenManager } from "@/api/client/auth";

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => authApi.refresh(data),

    onSuccess: (response: any) => {
      if (response.success && response.data) {
        TokenManager.setTokens(response.data);
      }
    },

    onError: () => {
      TokenManager.clearTokens();
      window.dispatchEvent(new CustomEvent("auth:logout"));
    },
  });
};
