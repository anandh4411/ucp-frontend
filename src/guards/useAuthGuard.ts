import { useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";

export const useAuthGuard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("ucp_token");
        const user = localStorage.getItem("ucp_user");

        if (token && user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.navigate({ to: "/sign-in" });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        router.navigate({ to: "/sign-in" });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, isLoading };
};

// Helper to get current user
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("ucp_user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Helper to check if user has role
export const hasRole = (allowedRoles: string[]) => {
  const user = getCurrentUser();
  return user && allowedRoles.includes(user.role);
};
