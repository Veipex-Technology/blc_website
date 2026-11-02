import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, HeartPulse } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";
import { createPageMetadata } from "@/lib/metadata";
import { getServicesFromERP } from "@/lib/erp/services";
import type { Locale } from "@/i18n/routing";

const fallbackImage = "/images/hero-placeholder.jpg";

function resolveServiceImage(image?: string) {
  const source = image?.trim();
  if (!source) {
    return fallbackImage;
  }

  if (/^(https?:|data:)/i.test(source)) {
    return source;
  }

  const erpBaseUrl = process.env.ERP_BASE_URL;
  if (!erpBaseUrl) {
    return source.startsWith("/") ? source : `/${source}`;
  }

  return new URL(source, `${erpBaseUrl.replace(/\/+$/, "")}/`).toString();
}

function toPlainText(value: string) {
  return sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

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

  const [t, common, services] = await Promise.all([
    getTranslations({ locale, namespace: "services" }),
    getTranslations({ locale, namespace: "common" }),
    getServicesFromERP(),
  ]);

  const isArabic = locale === "ar";
  const serviceItems = services.flatMap((service) => {
    const title = isArabic
      ? service.service_name_ar || service.service_name
      : service.service_name;
    const tagline = isArabic
      ? service.service_sub_title_ar || service.service_sub_title
      : service.service_sub_title;
    const description = isArabic
      ? service.ar_service_description || service.service_description
      : service.service_description;
    const image = isArabic
      ? service.image_ar || service.image_en
      : service.image_en || service.image_ar;
    const slug = isArabic
      ? service.ar_slug || service.en_slug
      : service.en_slug || service.ar_slug;

    if (!title || !slug) {
      return [];
    }

    return [
      {
        id: service.name,
        title,
        description: toPlainText(tagline || description || ""),
        image: resolveServiceImage(image),
        href: `/${locale}/services/${encodeURIComponent(slug)}`,
      },
    ];
  });
  const heroImage =
    serviceItems.find((service) => service.image !== fallbackImage)?.image ??
    fallbackImage;

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[var(--blc-cream-100)] py-14 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-32 -top-32 size-96 rounded-full bg-[var(--blc-gold-300)]/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -start-24 size-[28rem] rounded-full border-[32px] border-[var(--blc-green-900)]/[0.05]"
        />
        <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--blc-gold-500)]">
              <span className="h-px w-9 bg-[var(--blc-gold-500)]" />
              {t("hero_eyebrow")}
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-5xl lg:text-6xl">
              {t("hero_title")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--blc-green-700)]">
              {t("hero_description")}
            </p>
            <Link
              href="#services-list"
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--blc-green-900)] px-6 font-semibold text-white shadow-soft transition hover:bg-[var(--blc-green-700)] focus-ring-dark motion-reduce:transition-none"
            >
              {t("hero_cta")}
              <ArrowUpRight
                size={18}
                aria-hidden="true"
                className="rtl:rotate-180"
              />
            </Link>
          </Reveal>

          <Reveal variant="zoom" className="relative mx-auto w-full max-w-2xl">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2.5rem] border border-[var(--blc-gold-500)]/25 sm:-inset-5"
            />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[var(--blc-sand-200)] shadow-[0_24px_60px_rgb(2_56_48_/_0.18)]">
              <Image
                src="/images/illustrations/services-page-header.jpg"
                alt={heroImage === fallbackImage ? "" : t("hero_image_alt")}
                fill
                priority
                unoptimized
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              {heroImage === fallbackImage && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_42%,rgb(255_255_255/0.78),transparent_48%)]"
                >
                  <div className="flex size-44 items-center justify-center rounded-full border border-[var(--blc-gold-500)]/20 bg-white/65 text-[var(--blc-green-900)] shadow-[0_18px_45px_rgb(2_56_48/0.1)] sm:size-56">
                    <HeartPulse
                      size={112}
                      strokeWidth={1.2}
                      className="text-[var(--blc-gold-500)]"
                    />
                  </div>
                </div>
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[var(--blc-green-900)]/25 via-transparent to-transparent"
              />
            </div>
            <div className="absolute -bottom-5 start-5 flex items-center gap-3 rounded-2xl border border-[var(--blc-sand-200)] bg-white p-4 shadow-soft sm:start-8">
              <span className="flex size-11 items-center justify-center rounded-full bg-[var(--blc-cream-100)] text-[var(--blc-gold-500)]">
                <Heart size={21} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-[var(--blc-green-900)]">
                {t("hero_image_caption")}
              </span>
            </div>
          </Reveal>
        </Container>
      </section>

      <section
        id="services-list"
        aria-labelledby="services-intro-title"
        className="py-16 sm:py-20 lg:py-24"
      >
        <Container>
          <Reveal className="grid gap-6 md:grid-cols-2 md:items-end md:gap-12">
            <div>
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--blc-gold-500)]">
                <span className="h-px w-9 bg-[var(--blc-gold-500)]" />
                {t("intro_eyebrow")}
              </p>
              <h2
                id="services-intro-title"
                className="mt-4 max-w-2xl text-3xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-4xl"
              >
                {t("intro_title")}
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[var(--blc-green-700)] md:justify-self-end">
              {t("intro_description")}
            </p>
          </Reveal>

          {serviceItems.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
              {serviceItems.map((service, index) => (
                <Reveal
                  key={service.id}
                  delay={Math.min(index * 90, 450)}
                  className="h-full"
                >
                  <Link
                    href={service.href}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--blc-sand-200)] bg-white shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-[var(--blc-gold-500)] hover:shadow-[0_22px_42px_rgb(2_56_48/0.14)] focus-ring-light motion-reduce:transition-none"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-[var(--blc-cream-100)]">
                      <Image
                        src={service.image}
                        alt={
                          service.image === fallbackImage ? "" : service.title
                        }
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      />
                      {service.image === fallbackImage && (
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgb(255_255_255/0.75),transparent_52%)]"
                        >
                          <HeartPulse
                            size={74}
                            strokeWidth={1.3}
                            className="text-[var(--blc-green-700)]/75"
                          />
                        </div>
                      )}
                      <span className="absolute start-5 top-5 flex size-12 items-center justify-center rounded-full border border-white/70 bg-white/95 text-[var(--blc-gold-500)] shadow-soft">
                        <Heart size={21} aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <h3 className="text-xl font-bold text-[var(--blc-green-900)] sm:text-2xl">
                        {service.title}
                      </h3>
                      {service.description && (
                        <p className="mt-3 line-clamp-3 text-[var(--blc-green-700)]">
                          {service.description}
                        </p>
                      )}
                      <span className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-[var(--blc-gold-500)]">
                        {common("cta_learn_more")}
                        <ArrowUpRight
                          size={17}
                          aria-hidden="true"
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl border border-[var(--blc-sand-200)] bg-[var(--blc-cream-100)] p-6 text-[var(--blc-green-700)]">
              {t("empty")}
            </p>
          )}
        </Container>
      </section>
    </main>
  );
}
