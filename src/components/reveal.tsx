"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "fade",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade" | "zoom";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.classList.add("reveal-visible");
      return;
    }

    element.classList.add(
      variant === "zoom" ? "reveal-zoom-pending" : "reveal-pending",
    );
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [variant]);

  return (
    <div
      ref={ref}
      className={`reveal ${
        visible
          ? variant === "zoom"
            ? "reveal-zoom-visible"
            : "reveal-visible"
          : ""
      } ${className}`}
      style={
        delay > 0
          ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
