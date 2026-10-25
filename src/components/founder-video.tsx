"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type FounderVideoProps = {
  /** attach_wpov_url from ERPNext. When missing, the "coming soon" state is shown. */
  videoUrl?: string | null;
  /** t("founderMessage.videoComingSoon") */
  label: string;
};

export function FounderVideo({ videoUrl, label }: FounderVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const manuallyPausedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!manuallyPausedRef.current) {
            video.play().catch(() => {});
          }
          return;
        }

        manuallyPausedRef.current = false;
        video.pause();
      },
      { threshold: 0.5 },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [videoUrl]);

  function handlePlay() {
    manuallyPausedRef.current = false;
    videoRef.current?.play().catch(() => {});
  }

  function handleTogglePlayback() {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      handlePlay();
    } else {
      manuallyPausedRef.current = true;
      video.pause();
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-video w-full max-w-4xl overflow-hidden rounded-3xl border border-[var(--blc-gold-500)]/30 bg-gradient-to-br from-[var(--blc-green-900)] via-[var(--blc-green-700)] to-[var(--blc-gold-500)]/70 shadow-[0_24px_70px_rgb(2_56_48_/_0.2),0_8px_24px_rgb(185_135_57_/_0.12)]"
    >
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          muted={muted}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full bg-black object-cover"
        />
      ) : (
        <div className="absolute inset-0 p-6 sm:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(var(--blc-cream-100)_1px,transparent_1px)] [background-size:22px_22px]"
            aria-hidden="true"
          />
          <div className="relative flex h-full flex-col items-center justify-center text-center text-white">
            <button
              type="button"
              onClick={videoUrl ? handleTogglePlayback : undefined}
              disabled={!videoUrl}
              aria-label={playing ? "Pause video" : label}
              className="group absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--blc-green-900)] disabled:cursor-not-allowed motion-reduce:transition-none md:h-20 md:w-20"
            >
              <span
                className="pointer-events-none absolute -inset-2 rounded-full border border-white/40 motion-safe:animate-[ping_2.4s_ease-out_infinite] motion-reduce:animate-none"
                aria-hidden="true"
              />
              <span
                className="ms-1 size-0 border-y-[9px] border-y-transparent border-s-[14px] border-s-white transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </button>
            {!videoUrl && (
              <p className="mt-5 text-sm font-semibold tracking-wide text-white/90">
                {label}
              </p>
            )}
          </div>
        </div>
      )}
      {videoUrl && !playing && (
        <button
          type="button"
          onClick={handleTogglePlayback}
          aria-label={label}
          className="group absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-lg backdrop-blur-md transition-transform duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--blc-green-900)] motion-reduce:transition-none md:h-20 md:w-20"
        >
          <span
            className="pointer-events-none absolute -inset-2 rounded-full border border-white/40 motion-safe:animate-[ping_2.4s_ease-out_infinite] motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span
            className="ms-1 size-0 border-y-[9px] border-y-transparent border-s-[14px] border-s-white transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </button>
      )}
      {videoUrl && (
        <button
          type="button"
          onClick={() => setMuted((currentMuted) => !currentMuted)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute end-4 top-4 z-10 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {muted ? (
            <VolumeX size={18} aria-hidden="true" />
          ) : (
            <Volume2 size={18} aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
}
