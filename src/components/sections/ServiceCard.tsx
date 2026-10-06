"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export type ServiceCardData = {
  number: string;
  icon: string;
  title: string;
  description: string;
  href: string;
};

type ServiceCardProps = {
  service: ServiceCardData;
  label: string;
  title: string;
  description: string;
  href: string;
  isRtl: boolean;
};

const easing = [0.22, 1, 0.36, 1] as const;

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: easing },
  },
};

export function ServiceCard({
  service,
  label,
  title,
  description,
  href,
  isRtl,
}: ServiceCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const motionClasses = shouldReduceMotion
    ? ""
    : "hover:-translate-y-2 hover:shadow-[0_22px_42px_rgb(2_56_48/0.16)]";
  const iconMotionClasses = shouldReduceMotion
    ? ""
    : "group-hover:scale-110 group-hover:-rotate-6";

  return (
    <motion.article
      variants={cardVariants}
      whileHover={shouldReduceMotion ? undefined : { y: -8 }}
      className={`group relative flex min-h-[25rem] flex-col overflow-hidden rounded-3xl border border-[var(--blc-sand-200)] bg-white p-7 shadow-soft transition-[transform,box-shadow,border-color] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[var(--blc-green-900)] focus-within:border-[var(--blc-green-900)] motion-reduce:transition-none ${motionClasses}`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-bottom scale-y-0 bg-[var(--blc-green-900)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-focus-within:scale-y-100 motion-reduce:transition-none"
      />

      <Link
        href={href}
        aria-label={`${title} - ${description}`}
        className="relative z-10 flex h-full flex-col outline-none"
      >
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--blc-green-700)] transition-colors duration-300 group-hover:text-white group-focus-within:text-white">
          {label} {service.number}
        </span>

        <div className="mt-8 flex size-16 items-center justify-center rounded-2xl border border-[var(--blc-sand-200)] bg-[var(--blc-cream-100)] transition-colors duration-500 group-hover:border-white/20 group-hover:bg-white/10 group-focus-within:border-white/20 group-focus-within:bg-white/10">
          <Image
            src={service.icon}
            alt=""
            width={64}
            height={64}
            className={`size-12 object-contain transition duration-500 ease-out ${iconMotionClasses} group-hover:brightness-0 group-hover:invert group-focus-within:brightness-0 group-focus-within:invert`}
          />
        </div>

        <h3 className="mt-8 text-2xl font-bold text-[var(--blc-green-900)] transition-colors duration-300 group-hover:text-white group-focus-within:text-white">
          {title}
        </h3>
        <p className="mt-3 max-w-sm text-[var(--blc-green-700)] transition-colors duration-300 group-hover:text-white/80 group-focus-within:text-white/80">
          {description}
        </p>

        <span className="mt-auto flex size-12 items-center justify-center rounded-full border border-[var(--blc-green-900)] text-[var(--blc-green-900)] transition duration-500 group-hover:border-white group-hover:bg-white group-hover:text-[var(--blc-green-900)] group-focus-within:border-white group-focus-within:bg-white group-focus-within:text-[var(--blc-green-900)]">
          <ArrowRight
            size={20}
            aria-hidden="true"
            className={`transition-transform duration-500 ease-out ${isRtl ? "rotate-180" : "-rotate-45"} group-hover:rotate-0 group-focus-within:rotate-0`}
          />
        </span>
      </Link>
    </motion.article>
  );
}
