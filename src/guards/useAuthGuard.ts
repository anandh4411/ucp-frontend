import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "@tanstack/react-router";
import { env } from "@/config/env";

export const useAuthGuard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Skip auth guard if disabled via env (dev only)
    if (env.isAuthGuardDisabled) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: "/sign-in" });
    }
  }, [isAuthenticated, isLoading, router]);

  // If guard is disabled, always return authenticated
  if (env.isAuthGuardDisabled) {
    return {
      isAuthenticated: true,
      isLoading: false,
    };
  }

  return {
    isAuthenticated,
    isLoading,
  };
};
