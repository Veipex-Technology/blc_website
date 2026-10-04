import Link from "next/link";
import {
  ArrowUpRight,
  Accessibility,
  FlaskConical,
  Footprints,
  Heart,
  RefreshCw,
  Stethoscope,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import { getServicesFromERP } from "@/lib/erp/services";
import type { Locale } from "@/i18n/routing";

const serviceIcons: Record<string, LucideIcon> = {
  heart: Heart,
  stethoscope: Stethoscope,
  refresh: RefreshCw,
  accessibility: Accessibility,
  flask: FlaskConical,
  users: Users,
  footprints: Footprints,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "services",
  });

  return createPageMetadata({
    locale,
    path: "services",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "services",
  });

  const common = await getTranslations({
    locale,
    namespace: "common",
  });

  const services = await getServicesFromERP();

  const isArabic = locale === "ar";

  return (
    <main>
      <Section>
        <Container>
          <Reveal>
            <SectionHeading title={t("title")} subtitle={t("intro")} />
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              /*
               * Select the correct fields according to the current locale.
               */
              const title = isArabic
                ? service.service_name_ar || service.service_name
                : service.service_name;

              const tagline = isArabic
                ? service.service_sub_title_ar || service.service_sub_title
                : service.service_sub_title;

              const slug = isArabic
                ? service.ar_slug || service.en_slug
                : service.en_slug || service.ar_slug;

              /*
               * Your ERP Service DocType currently does not have
               * an icon field, so Heart remains the default icon.
               */
              const Icon = Heart;

              /*
               * Skip invalid ERP records that don't have a name/slug.
               */
              if (!title || !slug) {
                return null;
              }

              return (
                <Reveal key={service.name}>
                  <Link
                    href={`/${locale}/services/${encodeURIComponent(slug)}`}
                    className="group block h-full rounded-card border border-[var(--blc-sand-200)] bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:border-[var(--blc-gold-500)] hover:shadow-lg focus-ring-light"
                  >
                    <Icon
                      size={30}
                      aria-hidden="true"
                      className="text-[var(--blc-gold-500)]"
                    />

                    <h2 className="mt-6 text-xl font-bold text-[var(--blc-green-900)]">
                      {title}
                    </h2>

                    {tagline && (
                      <p className="mt-3 text-[var(--blc-green-700)]">
                        {tagline}
                      </p>
                    )}

                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-[var(--blc-gold-500)]">
                      {common("cta_learn_more")}

                      <ArrowUpRight
                        size={17}
                        aria-hidden="true"
                        className="rtl:rotate-180"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>
    </main>
  );
}
