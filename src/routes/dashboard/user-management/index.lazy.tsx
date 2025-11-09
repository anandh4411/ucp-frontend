import { createLazyFileRoute } from "@tanstack/react-router";
import UserManagement from "@/features/user-management";

export const Route = createLazyFileRoute("/dashboard/user-management/")({
  component: UserManagement,
});
