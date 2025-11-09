import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/analytics/")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Communication trends and engagement metrics
        </p>
      </div>
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">Analytics page - Coming soon</p>
      </div>
    </div>
  );
}
