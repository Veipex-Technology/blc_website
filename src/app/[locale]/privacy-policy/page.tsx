import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/erp/api";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return createPageMetadata({
    locale,
    path: "privacy-policy",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const settings = await getSiteSettings(locale);
  const useItems = t.raw("use_items") as string[];
  const contact = t("contact")
    .replaceAll("[Phone Number]", settings.phone)
    .replaceAll("[Email Address]", settings.email)
    .replaceAll("[Business Address]", settings.address)
    .replaceAll("[رقم الهاتف]", settings.phone)
    .replaceAll("[البريد الإلكتروني]", settings.email)
    .replaceAll("[عنوان النشاط]", settings.address);
  const sections = ["medical", "sharing", "security", "rights"] as const;

  return (
    <ContentPage title={t("title")} intro={t("intro")}>
      <div className="max-w-3xl space-y-10 text-[var(--blc-green-700)]">
        <section>
          <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
            {t("heading")}
          </h2>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
            {t("collection_title")}
          </h2>
          <p className="mt-3">{t("collection")}</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
            {t("use_title")}
          </h2>
          <ul className="mt-4 list-disc space-y-2 ps-6">
            {useItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        {sections.map((section) => (
          <section key={section}>
            <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
              {t(`${section}_title`)}
            </h2>
            <p className="mt-3">{t(section)}</p>
          </section>
        ))}
        <section>
          <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
            {t("contact_title")}
          </h2>
          <p className="mt-3">{contact}</p>
        </section>
      </div>
    </ContentPage>
  );
}
