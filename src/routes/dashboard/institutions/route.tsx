// src/routes/_authenticated/institutions/route.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/institutions")({
  component: InstitutionsLayout,
});

function InstitutionsLayout() {
  return (
    <div>
      {/* Just render the child routes without any special layout */}
      <Outlet />
    </div>
  );
}
