import { useEffect, useRef } from "react";

export const useSmoothScroll = <T extends HTMLElement = HTMLDivElement>(
  enabled = true,
  speed = 0.35
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const element = ref.current;
    let isScrolling = false;
    let targetScroll = element.scrollTop;
    let currentScroll = element.scrollTop;

    const easeInOut = (t: number) => {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    const smoothScroll = () => {
      const maxScroll = element.scrollHeight - element.clientHeight;

      if (Math.abs(targetScroll - currentScroll) < 1) {
        isScrolling = false;
        return;
      }

      const progress = Math.abs(targetScroll - currentScroll) / 100;
      const easedProgress = easeInOut(Math.min(progress, 1));
      const adjustedSpeed = speed * (0.5 + easedProgress * 0.5);

      currentScroll += (targetScroll - currentScroll) * adjustedSpeed;
      element.scrollTop = Math.max(0, Math.min(currentScroll, maxScroll));

      if (isScrolling) {
        requestAnimationFrame(smoothScroll);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const maxScroll = element.scrollHeight - element.clientHeight;
      let newTargetScroll = targetScroll + e.deltaY;

      newTargetScroll = Math.max(0, Math.min(newTargetScroll, maxScroll));
      targetScroll = newTargetScroll;

      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(smoothScroll);
      }
    };

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [enabled, speed]);

  return ref;
};
