import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/calendar/")({
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View upcoming events and schedules
        </p>
      </div>
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">Calendar page - Coming soon</p>
      </div>
    </div>
  );
}
