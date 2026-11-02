"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function MissionVisionCollage({
  imageUrl,
  secondaryImageUrl,
  secondaryImageAlt,
  secondaryImageSizes,
  title,
  imageLabel,
  secondaryImageLabel,
  mirrored = false,
}: {
  imageUrl?: string | null;
  secondaryImageUrl?: string | null;
  secondaryImageAlt?: string;
  secondaryImageSizes?: string;
  title: string;
  imageLabel: string;
  secondaryImageLabel: string;
  mirrored?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smallImageY = useTransform(scrollYProgress, [0, 1], [0, 30]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const placeholder = (label: string) => (
    <div className="mission-vision-placeholder absolute inset-0 flex flex-col items-center justify-center border-2 border-dashed border-[var(--blc-sand-200)] bg-gradient-to-br from-[var(--blc-sand-200)] to-white px-4 text-center text-[var(--blc-green-700)]">
      <span className="flex size-14 items-center justify-center rounded-full border border-[var(--blc-sand-200)] bg-white/80 text-[var(--blc-green-900)] shadow-sm">
        <ImageIcon size={25} strokeWidth={1.4} aria-hidden="true" />
      </span>
      <span className="mt-3 text-sm font-semibold">{label}</span>
    </div>
  );

  return (
    <div
      ref={ref}
      className="mission-vision-collage relative mx-auto max-w-xl pb-[16%]"
    >
      <div
        className={`mission-vision-accent absolute -top-7 size-24 rounded-full border-[12px] border-[var(--blc-gold-300)]/70 sm:-top-10 sm:size-32 ${mirrored ? "-start-5 sm:-start-8" : "-end-5 sm:-end-8"}`}
        aria-hidden="true"
      />
      <div
        className={`mission-vision-large-frame relative aspect-[4/3] w-[70%] overflow-hidden rounded-3xl shadow-[0_20px_45px_rgb(2_56_48_/_0.15)] ${mirrored ? "ms-auto" : ""}`}
      >
        <div className="mission-vision-large absolute inset-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="mission-vision-image object-cover"
            />
          ) : (
            placeholder(imageLabel)
          )}
        </div>
      </div>
      <motion.div
        className={`mission-vision-small absolute bottom-0 z-10 w-[45%] aspect-square rounded-2xl border-[6px] border-white shadow-[0_16px_35px_rgb(2_56_48_/_0.2)] ${secondaryImageUrl ? "overflow-hidden" : ""} ${mirrored ? "start-0" : "end-0"}`}
        style={{ y: reducedMotion || isMobile ? 0 : smallImageY }}
      >
        {secondaryImageUrl ? (
          <Image
            src={secondaryImageUrl}
            alt={secondaryImageAlt ?? title}
            fill
            sizes={
              secondaryImageSizes ??
              "(min-width: 1024px) 18vw, (min-width: 640px) 25vw, 45vw"
            }
            className={
              mirrored ? "object-cover" : "rounded-[0.65rem] object-cover"
            }
          />
        ) : (
          placeholder(secondaryImageLabel)
        )}
      </motion.div>
    </div>
  );
}
