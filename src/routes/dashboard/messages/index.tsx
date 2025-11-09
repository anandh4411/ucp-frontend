import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/messages/")({
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Send and receive secure communications
        </p>
      </div>
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">Messages page - Coming soon</p>
      </div>
    </div>
  );
}
