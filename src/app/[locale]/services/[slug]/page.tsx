import Link from "next/link";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";
import {
  ServiceOverview,
  type ServiceOverviewBlock,
} from "@/components/services/ServiceOverview";
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

function sanitizeServiceHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "strong", "em", "ul", "ol", "li"],
    allowedAttributes: {},
  });
}

function decodeTextEntities(value: string) {
  return value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function removeNumbering(title: string) {
  let index = 0;
  while (index < title.length && title[index].trim() === "") {
    index += 1;
  }

  const numberStart = index;
  while (index < title.length && title[index] >= "0" && title[index] <= "9") {
    index += 1;
  }
  if (index === numberStart) return null;

  while (index < title.length && title[index].trim() === "") {
    index += 1;
  }
  if (title[index] !== "." && title[index] !== ")") return null;

  index += 1;
  while (index < title.length && title[index].trim() === "") {
    index += 1;
  }

  const cleanTitle = decodeTextEntities(title.slice(index)).trim();
  return cleanTitle || null;
}

function paragraphBoundary(html: string, headingStart: number) {
  const paragraphStart = html.lastIndexOf("<p>", headingStart);
  const paragraphEnd = html.lastIndexOf("</p>", headingStart);
  return paragraphStart > paragraphEnd ? paragraphStart : headingStart;
}

function getShortBlockLabel(title: string) {
  return title.split(" ").filter(Boolean).slice(0, 2).join(" ");
}

function parseServiceDescription(html: string): {
  introHtml: string;
  blocks: ServiceOverviewBlock[];
} {
  const safeHtml = sanitizeServiceHtml(html);
  const headings: Array<{
    start: number;
    bodyStart: number;
    end: number;
    title: string;
  }> = [];
  let searchFrom = 0;

  while (searchFrom < safeHtml.length) {
    const headingStart = safeHtml.indexOf("<strong", searchFrom);
    if (headingStart === -1) break;

    const openingEnd = safeHtml.indexOf(">", headingStart);
    const closingStart = safeHtml.indexOf("</strong>", openingEnd + 1);
    if (openingEnd === -1 || closingStart === -1) break;

    const headingContent = safeHtml.slice(openingEnd + 1, closingStart);
    const title = removeNumbering(stripHtml(headingContent));
    const headingEnd = closingStart + "</strong>".length;

    if (title) {
      const blockStart = paragraphBoundary(safeHtml, headingStart);
      const titleParagraphEnd = safeHtml.indexOf("</p>", headingEnd);
      const titleParagraphContent =
        titleParagraphEnd === -1
          ? ""
          : stripHtml(safeHtml.slice(headingEnd, titleParagraphEnd)).trim();

      headings.push({
        start: blockStart,
        bodyStart:
          titleParagraphEnd !== -1 && !titleParagraphContent
            ? titleParagraphEnd + "</p>".length
            : headingEnd,
        end: headingEnd,
        title,
      });
    }

    searchFrom = headingEnd;
  }

  if (headings.length === 0) {
    return {
      introHtml: "",
      blocks: safeHtml.trim()
        ? [{ title: "", label: "", body: safeHtml.trim() }]
        : [],
    };
  }

  const introHtml = sanitizeServiceHtml(
    safeHtml.slice(0, headings[0].start),
  ).trim();
  const blocks = headings.map((heading, index) => {
    const bodyEnd = headings[index + 1]?.start ?? safeHtml.length;
    const body = sanitizeServiceHtml(
      safeHtml.slice(heading.bodyStart, bodyEnd),
    ).trim();

    return {
      title: heading.title,
      label: getShortBlockLabel(heading.title),
      body,
    };
  });

  return { introHtml, blocks };
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
  const nav = await getTranslations({ locale, namespace: "nav" });

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

  const serviceImage = isArabic
    ? service.image_ar || service.image_en
    : service.image_en || service.image_ar;

  const features = isArabic
    ? service.ar_service_feature?.length
      ? service.ar_service_feature
      : service.service_feature || []
    : service.service_feature || [];

  const { introHtml, blocks } = parseServiceDescription(description);

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
      <ServiceOverview
        key={service.name}
        locale={locale}
        title={title || ""}
        tagline={tagline || ""}
        introHtml={introHtml}
        blocks={blocks}
        image={serviceImage}
        ctaHref={requestHref}
        labels={{
          home: nav("home"),
          services: nav("services"),
          breadcrumb: t("title"),
          imageAlt: t("hero_image_alt"),
          requestCare: common("cta_request"),
        }}
      />

      <Section dir={isArabic ? "rtl" : "ltr"}>
        <Container>
          <div
            className={
              features.length > 0
                ? "grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
                : "grid gap-12"
            }
          >
            {features.length > 0 && (
              <div>
                <Reveal>
                  <SectionHeading title={t("included")} />
                </Reveal>

                <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                  {features.map((feature, index) => (
                    <li key={feature.name} className="h-full">
                      <Reveal delay={index * 80} className="h-full">
                        <div className="flex h-full gap-3 rounded-xl bg-[var(--blc-cream-100)] p-4 text-[var(--blc-green-700)]">
                          <span
                            className="mt-1 shrink-0 text-[var(--blc-gold-500)]"
                            aria-hidden="true"
                          >
                            ✓
                          </span>
                          <span>{feature.feature}</span>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Reveal
              className={
                features.length > 0
                  ? "lg:sticky lg:top-28"
                  : "mx-auto w-full max-w-xl"
              }
            >
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
        <Section variant="cream" dir={isArabic ? "rtl" : "ltr"}>
          <Container>
            <Reveal>
              <SectionHeading title={t("related")} />
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {related.map((relatedService, index) => {
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
                  <Reveal key={relatedService.name} delay={index * 100}>
                    <Link
                      href={`/${locale}/${servicesSegment}/${encodeURIComponent(relatedSlug)}`}
                      className="group block h-full rounded-card bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 focus-ring-light motion-reduce:transition-none"
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
