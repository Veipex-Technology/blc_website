"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

type BlogHeroImageProps = {
  alt: string;
  badge: string;
};

export function BlogHeroImage({ alt, badge }: BlogHeroImageProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-md"
    >
      <div
        className="pointer-events-none absolute inset-0 translate-x-4 translate-y-4 rounded-3xl border border-[var(--blc-gold-300)]/70 rtl:-translate-x-4"
        aria-hidden="true"
      />

      <motion.div
        animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 6, ease: "easeInOut", repeat: Infinity }
        }
        className="relative overflow-hidden rounded-3xl shadow-2xl shadow-[rgb(0_24_20_/_0.32)]"
      >
        <Image
          src="/images/illustrations/blog-page.jpg"
          alt={alt}
          width={1621}
          height={913}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          quality={90}
          className="block h-auto w-full"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--blc-green-900)]/35 via-transparent to-transparent"
          aria-hidden="true"
        />
        <div className="absolute bottom-4 end-4 rounded-2xl border border-[var(--blc-gold-300)]/70 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
          {badge}
        </div>
      </motion.div>
    </motion.div>
  );
}
