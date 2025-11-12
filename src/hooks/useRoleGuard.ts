import { useRouter } from "@tanstack/react-router";
import { getCurrentUser, hasRole } from "@/guards/useAuthGuard";
import { toast } from "sonner";

export type UserRole = "adjt" | "it_jco" | "user";

/**
 * Hook for role-based route protection
 *
 * @param allowedRoles - Array of roles that can access the route
 * @param redirectTo - Path to redirect if user doesn't have required role
 * @returns Object with isAuthorized flag and checkAccess function
 *
 * @example
 * ```tsx
 * const { isAuthorized } = useRoleGuard(["adjt", "it_jco"]);
 *
 * if (!isAuthorized) {
 *   return <div>Access Denied</div>;
 * }
 * ```
 */
export function useRoleGuard(allowedRoles: UserRole[], redirectTo: string = "/dashboard") {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const isAuthorized = hasRole(allowedRoles);

  const checkAccess = (showToast: boolean = true) => {
    if (!isAuthorized) {
      if (showToast) {
        toast.error("Access Denied", {
          description: "You don't have permission to access this page.",
        });
      }
      router.navigate({ to: redirectTo });
      return false;
    }
    return true;
  };

  return {
    isAuthorized,
    checkAccess,
    currentUser,
    userRole: currentUser?.role as UserRole | undefined,
  };
}

/**
 * Function to use in TanStack Router's beforeLoad
 * Checks role and redirects if unauthorized
 *
 * @param allowedRoles - Array of roles that can access the route
 * @returns undefined if authorized, throws redirect if not
 *
 * @example
 * ```tsx
 * export const Route = createFileRoute('/dashboard/user-management')({
 *   beforeLoad: () => checkRouteAccess(["adjt", "it_jco"]),
 *   component: UserManagement,
 * })
 * ```
 */
export function checkRouteAccess(allowedRoles: UserRole[]) {
  const isAuthorized = hasRole(allowedRoles);

  if (!isAuthorized) {
    toast.error("Access Denied", {
      description: "You don't have permission to access this page.",
    });

    // Throw redirect to dashboard
    throw new Error("REDIRECT:/dashboard");
  }
}
