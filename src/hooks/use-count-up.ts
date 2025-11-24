"use client";

import { useEffect, useState, useRef } from "react";

interface UseCountUpOptions {
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  startOnView?: boolean;
}

export function useCountUp(
  end: number,
  options: UseCountUpOptions = {}
) {
  const {
    duration = 1.5,
    decimals = 2,
    prefix = "",
    suffix = "",
    startOnView = true,
  } = options;

  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (startOnView && !hasStarted) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setHasStarted(true);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.1, rootMargin: "-50px" }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (end - startValue) * easeOut;

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  const formattedCount = count.toFixed(decimals);
  const displayValue = `${prefix}${formattedCount}${suffix}`;

  return { count, displayValue, ref };
}

