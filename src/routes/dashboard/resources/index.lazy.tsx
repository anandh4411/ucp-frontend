import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/resources/")({
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground">Share and access unit resources</p>
      </div>
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">Resources page - Coming soon</p>
      </div>
    </div>
  );
}
