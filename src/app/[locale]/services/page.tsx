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
import { getServices } from "@/lib/erp/api";
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
  const t = await getTranslations({ locale, namespace: "services" });
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
  const t = await getTranslations({ locale, namespace: "services" });
  const common = await getTranslations({ locale, namespace: "common" });
  const services = await getServices(locale);
  return (
    <main>
      <Section>
        <Container>
          <Reveal>
            <SectionHeading title={t("title")} subtitle={t("intro")} />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = serviceIcons[service.icon] ?? Heart;
              return (
                <Reveal key={service.slug}>
                  <Link
                    href={`/${locale}/services/${service.slug}`}
                    className="group block h-full rounded-card border border-[var(--blc-sand-200)] bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:border-[var(--blc-gold-500)] hover:shadow-lg focus-ring-light"
                  >
                    <Icon
                      size={30}
                      aria-hidden="true"
                      className="text-[var(--blc-gold-500)]"
                    />
                    <h2 className="mt-6 text-xl font-bold text-[var(--blc-green-900)]">
                      {service.title}
                    </h2>
                    <p className="mt-3 text-[var(--blc-green-700)]">
                      {service.tagline}
                    </p>
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
