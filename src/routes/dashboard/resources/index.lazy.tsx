import Resources from "@/features/resources";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/resources/")({
  component: Resources,
});
