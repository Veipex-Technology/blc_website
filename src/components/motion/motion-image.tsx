"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function MotionImage({ className = "", ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <span
        className="motion-image-shimmer absolute inset-0 bg-[var(--blc-cream-100)]"
        aria-hidden="true"
      />
      <Image
        {...props}
        alt={props.alt ?? ""}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`motion-image ${loaded ? "motion-image-loaded" : ""} ${className}`}
      />
    </>
  );
}
