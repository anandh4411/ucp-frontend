import { useEffect, useRef } from "react";
import { ProgressBar, ProgressBarRef, ProgressBarProps } from "./progress-bar";
import { NavigationState } from "../types";

interface LoaderBarProps extends ProgressBarProps {
  // Navigation state (can be from any router)
  navigationState?: NavigationState;

  // Custom hooks for router integration
  useRouterState?: () => NavigationState;

  // Timing configuration
  completeDelay?: number;
  fallbackTimeout?: number;

  // Global progress control
  enableGlobalControl?: boolean;

  // Callbacks
  onStart?: () => void;
  onComplete?: () => void;
}

// Global progress control
let globalProgressRef: ProgressBarRef | null = null;

export const startProgress = () => {
  globalProgressRef?.start();
};

export const completeProgress = () => {
  globalProgressRef?.complete();
};

export function LoaderBar({
  navigationState,
  useRouterState,
  completeDelay = 100,
  fallbackTimeout = 3000,
  enableGlobalControl = true,
  onStart,
  onComplete,
  ...progressBarProps
}: LoaderBarProps) {
  const ref = useRef<ProgressBarRef>(null);

  // Get navigation state from prop or hook
  const routerState = useRouterState?.();
  const currentState = navigationState || routerState;

  // Set global reference
  useEffect(() => {
    if (enableGlobalControl) {
      globalProgressRef = ref.current;
    }
  }, [enableGlobalControl]);

  // Handle navigation state changes
  useEffect(() => {
    if (!currentState) return;

    if (
      currentState.status === "pending" ||
      currentState.status === "loading"
    ) {
      ref.current?.start();
      onStart?.();
    } else if (currentState.status === "idle") {
      const timer = setTimeout(() => {
        ref.current?.complete();
        onComplete?.();
      }, completeDelay);

      return () => clearTimeout(timer);
    }
  }, [currentState?.status, completeDelay, onStart, onComplete]);

  // Handle document load state
  useEffect(() => {
    const handleLoad = () => {
      ref.current?.complete();
      onComplete?.();
    };

    if (document.readyState === "complete") {
      ref.current?.complete();
      onComplete?.();
    } else {
      window.addEventListener("load", handleLoad);

      // Fallback timer for safety
      const fallbackTimer = setTimeout(() => {
        ref.current?.complete();
        onComplete?.();
        window.removeEventListener("load", handleLoad);
      }, fallbackTimeout);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallbackTimer);
      };
    }
  }, [fallbackTimeout, onComplete]);

  return <ProgressBar ref={ref} {...progressBarProps} />;
}
