import Announcements from "@/features/announcements";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/announcements/")({
  component: Announcements,
});
