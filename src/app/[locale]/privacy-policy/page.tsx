import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContentPage } from "@/components/content-page";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

type InformationItem = {
  label: string;
  description: string;
};

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
  const informationItems = t.raw("information_items") as InformationItem[];
  const useItems = t.raw("use_items") as string[];

  return (
    <ContentPage title={t("title")} intro={t("intro")}>
      <div className="max-w-3xl space-y-12 text-base leading-8 text-[var(--blc-green-700)]">
        <section
          aria-labelledby="privacy-policy-heading"
          className="border-t border-[var(--blc-sand-200)] pt-8"
        >
          <h2
            id="privacy-policy-heading"
            className="flex items-center gap-4 text-2xl font-bold text-[var(--blc-green-900)] sm:text-3xl"
          >
            <span
              aria-hidden="true"
              className="h-px w-8 shrink-0 bg-[var(--blc-gold-500)]"
            />
            {t("privacy_section_title")}
          </h2>

          <div className="mt-7 space-y-7">
            <section className="border-t border-[var(--blc-sand-200)] pt-6 first:border-0 first:pt-0">
              <h3 className="text-xl font-semibold text-[var(--blc-green-900)]">
                {t("privacy_1_title")}
              </h3>
              <p className="mt-3">{t("privacy_1_body")}</p>
            </section>

            <section className="border-t border-[var(--blc-sand-200)] pt-6">
              <h3 className="text-xl font-semibold text-[var(--blc-green-900)]">
                {t("privacy_2_title")}
              </h3>
              <p className="mt-3">{t("privacy_2_intro")}</p>
              <ul className="mt-3 list-disc space-y-2 ps-6 marker:text-[var(--blc-gold-500)]">
                {informationItems.map((item) => (
                  <li key={item.label}>
                    <strong className="font-semibold text-[var(--blc-green-900)]">
                      {item.label}
                    </strong>{" "}
                    {item.description}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-[var(--blc-sand-200)] pt-6">
              <h3 className="text-xl font-semibold text-[var(--blc-green-900)]">
                {t("privacy_3_title")}
              </h3>
              <ul className="mt-3 list-disc space-y-2 ps-6 marker:text-[var(--blc-gold-500)]">
                {useItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="border-t border-[var(--blc-sand-200)] pt-6">
              <h3 className="text-xl font-semibold text-[var(--blc-green-900)]">
                {t("privacy_4_title")}
              </h3>
              <p className="mt-3">{t("privacy_4_body")}</p>
            </section>
          </div>
        </section>

        <section
          aria-labelledby="terms-of-service-heading"
          className="border-t border-[var(--blc-sand-200)] pt-8"
        >
          <h2
            id="terms-of-service-heading"
            className="flex items-center gap-4 text-2xl font-bold text-[var(--blc-green-900)] sm:text-3xl"
          >
            <span
              aria-hidden="true"
              className="h-px w-8 shrink-0 bg-[var(--blc-gold-500)]"
            />
            {t("terms_section_title")}
          </h2>

          <div className="mt-7 space-y-7">
            {(["terms_1", "terms_2", "terms_3"] as const).map((key) => (
              <section
                key={key}
                className="border-t border-[var(--blc-sand-200)] pt-6 first:border-0 first:pt-0"
              >
                <h3 className="text-xl font-semibold text-[var(--blc-green-900)]">
                  {t(`${key}_title`)}
                </h3>
                <p className="mt-3">{t(`${key}_body`)}</p>
              </section>
            ))}
          </div>
        </section>
      </div>
    </ContentPage>
  );
}
