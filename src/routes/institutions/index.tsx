import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/institutions/")({
  component: () => <Navigate to="/institutions/dashboard" />,
});
