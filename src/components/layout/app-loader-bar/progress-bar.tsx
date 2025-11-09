import { useRef, useImperativeHandle, forwardRef } from "react";
import LoadingBar, { LoadingBarRef } from "react-top-loading-bar";

export interface ProgressBarProps {
  color?: string;
  height?: number;
  shadow?: boolean;
  className?: string;
}

export interface ProgressBarRef {
  start: () => void;
  complete: () => void;
  continuousStart: () => void;
}

export const ProgressBar = forwardRef<ProgressBarRef, ProgressBarProps>(
  ({ color = "var(--primary)", height = 2, shadow = true, className }, ref) => {
    const loadingBarRef = useRef<LoadingBarRef>(null);

    useImperativeHandle(ref, () => ({
      start: () => loadingBarRef.current?.continuousStart(),
      complete: () => loadingBarRef.current?.complete(),
      continuousStart: () => loadingBarRef.current?.continuousStart(),
    }));

    return (
      <LoadingBar
        color={color}
        ref={loadingBarRef}
        shadow={shadow}
        height={height}
        className={className}
      />
    );
  }
);

ProgressBar.displayName = "ProgressBar";
