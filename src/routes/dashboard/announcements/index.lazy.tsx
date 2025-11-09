import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/announcements/")({
  component: AnnouncementsPage,
});

function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground">
          Unit-wide announcements and notices
        </p>
      </div>
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">
          Announcements page - Coming soon
        </p>
      </div>
    </div>
  );
}
