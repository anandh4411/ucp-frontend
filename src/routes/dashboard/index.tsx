import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/features/dashboard/index.lazy";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});
