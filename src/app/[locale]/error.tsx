"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { whatsappLink } from "@/lib/contact";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errors = useTranslations("errors");
  const common = useTranslations("common");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] === "en" ? "en" : "ar";
  const whatsappHref = whatsappLink(common("whatsapp_prefill"));
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
      <h1 className="text-4xl font-bold text-[var(--blc-green-900)]">
        {errors("error_title")}
      </h1>
      <p className="mt-4 text-[var(--blc-green-700)]">{errors("error_text")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center rounded-full bg-[var(--blc-green-900)] px-6 font-semibold text-white focus-ring-dark"
        >
          {errors("retry")}
        </button>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex min-h-12 items-center rounded-full border-2 border-[var(--blc-gold-500)] px-6 font-semibold text-[var(--blc-green-900)] focus-ring-light"
        >
          {common("cta_request")}
        </Link>
        <a
          href={whatsappHref}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[var(--blc-gold-500)] px-6 font-semibold text-[var(--blc-green-900)] focus-ring-light"
        >
          <MessageCircle size={18} aria-hidden="true" />
          {common("cta_whatsapp")}
        </a>
      </div>
    </main>
  );
}
