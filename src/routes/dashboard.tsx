import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuthGuard } from "@/guards/useAuthGuard";
import { DashboardLayout } from "@/layouts/dashboard";
import { Loader2 } from "lucide-react";

function DashboardLayoutRoute() {
  const { isAuthenticated, isLoading } = useAuthGuard();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If not authenticated, guard will redirect to /sign-in
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayoutRoute,
});
