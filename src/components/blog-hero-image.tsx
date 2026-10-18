"use client";

import Image from "next/image";
import { useState } from "react";

const fallbackImage = "/images/hero-placeholder.jpg";

export function BlogHeroImage({ src, alt }: { src?: string; alt: string }) {
  const [imageSrc, setImageSrc] = useState(src || fallbackImage);

  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-card border border-[var(--blc-sand-200)] bg-[var(--blc-sand-200)] shadow-[0_24px_70px_rgb(2_56_48_/_0.14)]">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 1100px"
        className="object-cover transition-transform duration-700 hover:scale-[1.02]"
        onError={() => setImageSrc(fallbackImage)}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,rgb(2_56_48_/_0.18))]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -end-16 size-48 rounded-full border-[24px] border-white/20"
        aria-hidden="true"
      />
    </div>
  );
}
