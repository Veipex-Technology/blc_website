import Link from "next/link";
import {
  ArrowUpRight,
  Accessibility,
  FlaskConical,
  Footprints,
  Heart,
  MessageCircle,
  Phone,
  RefreshCw,
  Stethoscope,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import { getService, getServices, getSiteSettings } from "@/lib/erp/api";
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

export async function generateStaticParams() {
  const locales: Locale[] = ["ar", "en"];
  return (
    await Promise.all(
      locales.map(async (locale) =>
        (await getServices(locale)).map((service) => ({
          locale,
          slug: service.slug,
        })),
      ),
    )
  ).flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getService(slug, locale);
  if (!service) return {};
  return createPageMetadata({
    locale,
    path: `services/${slug}`,
    title: service.title,
    description: sanitizeHtml(service.description, {
      allowedTags: [],
      allowedAttributes: {},
    }),
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const service = await getService(slug, locale);
  if (!service) notFound();
  const t = await getTranslations({ locale, namespace: "services" });
  const common = await getTranslations({ locale, namespace: "common" });
  const Icon = serviceIcons[service.icon] ?? Heart;
  const description = service.description;
  const safeDescription = sanitizeHtml(description, {
    allowedTags: ["p", "br", "strong", "em", "ul", "ol", "li"],
    allowedAttributes: {},
  });
  const [allServices, settings] = await Promise.all([
    getServices(locale),
    getSiteSettings(locale),
  ]);
  const related = allServices
    .filter((candidate) => candidate.slug !== service.slug)
    .slice(0, 3);
  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const whatsappHref = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(common("whatsapp_prefill"))}`;
  const requestHref = `/${locale}/contact?service=${encodeURIComponent(service.slug)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: sanitizeHtml(description, {
      allowedTags: [],
      allowedAttributes: {},
    }),
    serviceType: service.title,
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
                    <p className="text-lg font-semibold text-[var(--blc-gold-500)]">
                      {service.tagline}
                    </p>
                    <h1 className="mt-2 text-4xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-5xl">
                      {service.title}
                    </h1>
                  </div>
                </div>
                <div
                  className="mt-10 max-w-3xl text-lg leading-relaxed text-[var(--blc-green-700)] [&_p+ p]:mt-5"
                  dangerouslySetInnerHTML={{ __html: safeDescription }}
                />
                {service.note && (
                  <p className="mt-6 rounded-xl border-s-4 border-[var(--blc-gold-500)] bg-[var(--blc-cream-100)] p-4 font-semibold text-[var(--blc-green-900)]">
                    {t("partners_note")}
                  </p>
                )}
              </Reveal>
              <Reveal className="mt-14">
                <SectionHeading title={t("included")} />
                <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature.text}
                      className="flex gap-3 rounded-xl bg-[var(--blc-cream-100)] p-4 text-[var(--blc-green-700)]"
                    >
                      <span className="mt-1 text-[var(--blc-gold-500)]">✓</span>
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </Reveal>
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
      <Section variant="cream">
        <Container>
          <Reveal>
            <SectionHeading title={t("related")} />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((relatedService) => (
              <Reveal key={relatedService.slug}>
                <Link
                  href={`/${locale}/services/${relatedService.slug}`}
                  className="group block h-full rounded-card bg-white p-6 shadow-soft hover:-translate-y-1 focus-ring-light"
                >
                  <h2 className="text-xl font-bold text-[var(--blc-green-900)]">
                    {relatedService.title}
                  </h2>
                  <p className="mt-3 text-[var(--blc-green-700)]">
                    {relatedService.tagline}
                  </p>
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
            ))}
          </div>
        </Container>
      </Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
