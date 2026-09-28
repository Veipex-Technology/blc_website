"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import { isLocale, type Locale } from "@/i18n/routing";

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentSegment = segments[1];
  const nextLocale = locale === "ar" ? "en" : "ar";

  if (isLocale(currentSegment)) {
    segments[1] = nextLocale;
  }

  const href = segments.join("/") || `/${nextLocale}`;

  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--blc-sand-200)] px-4 text-sm font-semibold text-[var(--blc-green-900)] transition-colors hover:border-[var(--blc-gold-500)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blc-yellow-400)]"
      aria-label={label}
    >
      <ArrowLeftRight size={16} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
