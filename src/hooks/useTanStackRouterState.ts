import { useRouterState } from "@tanstack/react-router";
import { NavigationState } from "../components/layout/types";

export function useTanStackRouterState(): NavigationState {
  const state = useRouterState();

  return {
    status: state.status === "pending" ? "pending" : "idle",
    location: {
      pathname: state.location.pathname,
    },
  };
}
