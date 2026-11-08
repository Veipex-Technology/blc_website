import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { whatsappLink } from "@/lib/contact";

export default async function NotFound() {
  const locale = await getLocale();
  const errors = await getTranslations({ locale, namespace: "errors" });
  const common = await getTranslations({ locale, namespace: "common" });
  const whatsappHref = whatsappLink(common("whatsapp_prefill"));
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center">
      <h1 className="text-4xl font-bold text-[var(--blc-green-900)]">
        {errors("not_found")}
      </h1>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/${locale}`}
          className="inline-flex min-h-12 items-center rounded-full bg-[var(--blc-green-900)] px-6 font-semibold text-white focus-ring-dark"
        >
          {common("brand_name")}
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
