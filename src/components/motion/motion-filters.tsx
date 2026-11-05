"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/i18n/routing";

type Filter = {
  title: string;
  slug: string;
};

type MotionFiltersProps = {
  locale: Locale;
  filters: Filter[];
  currentCategory?: string;
  allLabel: string;
  ariaLabel: string;
};

export function MotionFilters({
  locale,
  filters,
  currentCategory,
  allLabel,
  ariaLabel,
}: MotionFiltersProps) {
  const shouldReduceMotion = useReducedMotion();
  const items = [{ title: allLabel, slug: "" }, ...filters];

  return (
    <nav aria-label={ariaLabel} className="mt-10 flex flex-wrap gap-3">
      {items.map((filter) => {
        const active = filter.slug === (currentCategory ?? "");
        const href = filter.slug
          ? `/${locale}/blog?category=${encodeURIComponent(filter.slug)}`
          : `/${locale}/blog`;

        return (
          <Link
            key={filter.slug || "all"}
            href={href}
            prefetch={false}
            aria-current={active ? "page" : undefined}
            className={`relative isolate overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold focus-ring-light ${
              active
                ? "border-[var(--blc-green-900)] text-white"
                : "border-[var(--blc-sand-200)] text-[var(--blc-green-900)] hover:border-[var(--blc-gold-500)]"
            }`}
          >
            {active && (
              <motion.span
                layoutId="blog-filter-active"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 38 }
                }
                className="absolute inset-0 -z-10 rounded-full bg-[var(--blc-green-900)]"
                aria-hidden="true"
              />
            )}
            <span className="relative">{filter.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
