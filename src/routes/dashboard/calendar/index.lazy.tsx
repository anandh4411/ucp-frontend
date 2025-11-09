import Calendar from "@/features/calender";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/calendar/")({
  component: Calendar,
});
