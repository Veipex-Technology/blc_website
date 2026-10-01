import Link from "next/link";
import { ArrowUpRight, Heart, MessageCircle, Phone } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";

import { getSiteSettings } from "@/lib/erp/api";
import { getServicesFromERP, type Service } from "@/lib/erp/services";

import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: Locale; slug: string }>;
};

function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function findService(services: Service[], slug: string) {
  const decoded = decodeSlug(slug);
  return services.find(
    (item) =>
      item.en_slug === decoded ||
      item.ar_slug === decoded ||
      item.en_slug === slug ||
      item.ar_slug === slug,
  );
}

function stripHtml(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });
}

export async function generateStaticParams() {
  const services = await getServicesFromERP();

  const enParams = services
    .filter((service) => service.en_slug)
    .map((service) => ({
      locale: "en" as Locale,
      slug: service.en_slug!,
    }));

  const arParams = services
    .filter((service) => service.ar_slug)
    .map((service) => ({
      locale: "ar" as Locale,
      slug: service.ar_slug!,
    }));

  return [...enParams, ...arParams];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isArabic = locale === "ar";

  const services = await getServicesFromERP();
  const service = findService(services, slug);

  if (!service) return {};

  const title = isArabic
    ? service.service_name_ar || service.service_name
    : service.service_name;

  const description = isArabic
    ? service.ar_service_description || service.service_description || ""
    : service.service_description || "";

  return createPageMetadata({
    locale,
    path: `${isArabic ? "خدمات" : "services"}/${decodeSlug(slug)}`,
    title: title || "Service",
    description: stripHtml(description),
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const isArabic = locale === "ar";
  const servicesSegment = isArabic ? "خدمات" : "services";

  const [t, common, services, settings] = await Promise.all([
    getTranslations({ locale, namespace: "services" }),
    getTranslations({ locale, namespace: "common" }),
    getServicesFromERP(),
    getSiteSettings(locale),
  ]);

  const service = findService(services, slug);

  if (!service) {
    notFound();
  }

  const title = isArabic
    ? service.service_name_ar || service.service_name
    : service.service_name;

  const tagline = isArabic
    ? service.service_sub_title_ar || service.service_sub_title
    : service.service_sub_title;

  const description = isArabic
    ? service.ar_service_description || service.service_description || ""
    : service.service_description || "";

  const features = isArabic
    ? service.ar_service_feature?.length
      ? service.ar_service_feature
      : service.service_feature || []
    : service.service_feature || [];

  const Icon = Heart;

  const safeDescription = sanitizeHtml(description, {
    allowedTags: ["p", "br", "strong", "em", "ul", "ol", "li"],
    allowedAttributes: {},
  });

  const related = services
    .filter((candidate) => candidate.name !== service.name)
    .filter((candidate) =>
      Boolean(
        isArabic ? candidate.ar_slug || candidate.en_slug : candidate.en_slug,
      ),
    )
    .slice(0, 3);

  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;

  const whatsappHref = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
    common("whatsapp_prefill"),
  )}`;

  // Change "contact" to your real contact/request route.
  const requestHref = `/${locale}/contact`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: stripHtml(description),
    serviceType: title,
    areaServed: { "@type": "City", name: "Alexandria" },
    provider: { "@type": "Organization", name: "Better Life Care" },
  };

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
            <div>
              <Reveal>
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-[var(--blc-cream-100)] p-4">
                    <Icon
                      size={34}
                      aria-hidden="true"
                      className="text-[var(--blc-gold-500)]"
                    />
                  </div>

                  <div>
                    {tagline && (
                      <p className="text-lg font-semibold text-[var(--blc-gold-500)]">
                        {tagline}
                      </p>
                    )}

                    <h1 className="mt-2 text-4xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-5xl">
                      {title}
                    </h1>
                  </div>
                </div>

                {safeDescription && (
                  <div
                    className="mt-10 max-w-3xl text-lg leading-relaxed text-[var(--blc-green-700)] [&_p+p]:mt-5"
                    dangerouslySetInnerHTML={{ __html: safeDescription }}
                  />
                )}
              </Reveal>

              {features.length > 0 && (
                <Reveal className="mt-14">
                  <SectionHeading title={t("included")} />

                  <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                    {features.map((feature) => (
                      <li
                        key={feature.name}
                        className="flex gap-3 rounded-xl bg-[var(--blc-cream-100)] p-4 text-[var(--blc-green-700)]"
                      >
                        <span
                          className="mt-1 shrink-0 text-[var(--blc-gold-500)]"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        <span>{feature.feature}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>

            <Reveal className="lg:sticky lg:top-28">
              <aside className="rounded-card bg-[var(--blc-green-900)] p-6 text-white shadow-soft">
                <h2 className="text-xl font-bold">{common("cta_request")}</h2>

                <p className="mt-3 text-[var(--blc-cream-100)]">
                  {common("whatsapp_prefill")}
                </p>

                <div className="mt-7 grid gap-3">
                  <a
                    href={phoneHref}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-5 font-semibold text-[var(--blc-green-900)] hover:bg-[var(--blc-cream-100)] focus-ring-light"
                  >
                    <Phone size={18} aria-hidden="true" />
                    {common("cta_call")}
                  </a>

                  <a
                    href={whatsappHref}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[var(--blc-gold-300)] px-5 font-semibold text-white hover:bg-[var(--blc-green-700)] focus-ring-dark"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    {common("cta_whatsapp")}
                  </a>

                  <Link
                    href={requestHref}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/60 px-5 font-semibold text-white hover:bg-white/10 focus-ring-dark"
                  >
                    {common("cta_request")}
                  </Link>
                </div>
              </aside>
            </Reveal>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section variant="cream">
          <Container>
            <Reveal>
              <SectionHeading title={t("related")} />
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {related.map((relatedService) => {
                const relatedSlug = isArabic
                  ? relatedService.ar_slug || relatedService.en_slug
                  : relatedService.en_slug;

                const relatedTitle = isArabic
                  ? relatedService.service_name_ar ||
                    relatedService.service_name
                  : relatedService.service_name;

                const relatedTagline = isArabic
                  ? relatedService.service_sub_title_ar ||
                    relatedService.service_sub_title
                  : relatedService.service_sub_title;

                if (!relatedSlug || !relatedTitle) return null;

                return (
                  <Reveal key={relatedService.name}>
                    <Link
                      href={`/${locale}/${servicesSegment}/${encodeURIComponent(relatedSlug)}`}
                      className="group block h-full rounded-card bg-white p-6 shadow-soft hover:-translate-y-1 focus-ring-light"
                    >
                      <h2 className="text-xl font-bold text-[var(--blc-green-900)]">
                        {relatedTitle}
                      </h2>

                      {relatedTagline && (
                        <p className="mt-3 text-[var(--blc-green-700)]">
                          {relatedTagline}
                        </p>
                      )}

                      <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[var(--blc-gold-500)]">
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
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
