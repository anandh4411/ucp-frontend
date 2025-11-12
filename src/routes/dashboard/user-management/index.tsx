import { createFileRoute, redirect } from "@tanstack/react-router";
import { hasRole } from "@/guards/useAuthGuard";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/user-management/")({
  beforeLoad: () => {
    const isAuthorized = hasRole(["adjt", "it_jco"]);
    if (!isAuthorized) {
      toast.error("Access Denied", {
        description: "You don't have permission to access this page.",
      });
      throw redirect({ to: "/dashboard" });
    }
  },
});
