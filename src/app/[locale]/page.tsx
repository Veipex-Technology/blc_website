import Image from "next/image";
import Link from "next/link";
import {
  Accessibility,
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  FlaskConical,
  Footprints,
  GraduationCap,
  Heart,
  HeartHandshake,
  MessageCircle,
  Phone,
  Quote,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import {
  getFaqs,
  getPartners,
  getPosts,
  getSiteSettings,
  getTestimonials,
} from "@/lib/erp/api";

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
const trustIcons = [ShieldCheck, GraduationCap, ClipboardCheck, HeartHandshake];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return createPageMetadata({
    locale,
    title: `${t("title")} | Better Life Care`,
    description: t("subtitle"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const common = await getTranslations({ locale, namespace: "common" });
  const [services, testimonials, partners, postsResult, faqs, settings] =
    await Promise.all([
      getServicesFromERP(),
      getTestimonials(locale),
      getPartners(locale),
      getPosts({ lang: locale, page: 1 }),
      getFaqs(locale),
      getSiteSettings(locale),
    ]);
  const posts = postsResult.posts;
  const phone = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const whatsapp = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(common("whatsapp_prefill"))}`;
  const publishedFaqs = faqs.filter((faq) => faq.published);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: publishedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <section
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="relative isolate overflow-hidden bg-[var(--blc-cream-100)] text-[var(--blc-green-900)]"
      >
        <div
          className="pointer-events-none absolute -end-24 -top-28 size-96 rounded-full border-[32px] border-[var(--blc-gold-300)]/20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 -start-32 size-[30rem] rounded-full bg-[var(--blc-green-900)]/[0.06]"
          aria-hidden="true"
        />

        <Container className="relative grid min-h-[clamp(42rem,78vh,54rem)] items-center gap-14 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-24">
          <Reveal className="relative z-10 max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--blc-gold-500)]/40 bg-white/60 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--blc-gold-500)]">
              <HeartHandshake size={17} aria-hidden="true" />
              {common("tagline")}
            </p>
            <h1 className="max-w-xl text-start text-5xl font-bold leading-[1.05] text-[var(--blc-green-900)] sm:text-6xl lg:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-7 max-w-xl text-start text-lg leading-8 text-[var(--blc-green-700)] sm:text-xl">
              {t("subtitle")}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={phone}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--blc-green-900)] px-6 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[var(--blc-green-700)] focus-ring-dark"
              >
                <Phone size={18} aria-hidden="true" />
                {common("cta_call")}
              </a>
              <a
                href={whatsapp}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[var(--blc-green-900)] px-6 font-semibold text-[var(--blc-green-900)] transition hover:-translate-y-0.5 hover:bg-white/60 focus-ring-light"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {common("cta_whatsapp")}
              </a>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex min-h-11 items-center text-start font-semibold text-[var(--blc-green-900)] underline decoration-[var(--blc-gold-500)] underline-offset-4 hover:text-[var(--blc-green-700)] focus-ring-light"
              >
                {t("request_care")}
              </Link>
            </div>
          </Reveal>

          <Reveal className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div
              className="absolute -inset-5 rounded-[2rem] border border-[var(--blc-gold-300)]/50 lg:-inset-7"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/70 bg-[var(--blc-green-900)] shadow-[0_24px_70px_rgb(2_56_48_/_0.2)] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/images/hero-placeholder.jpg"
                alt={
                  locale === "ar"
                    ? "رعاية منزلية دافئة في الإسكندرية"
                    : "Warm home care in Alexandria"
                }
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[var(--blc-green-900)]/65 via-transparent to-[var(--blc-green-900)]/10"
                aria-hidden="true"
              />
              <div
                className="absolute -end-16 -top-16 size-48 rounded-full border-[20px] border-[var(--blc-cream-100)]/20"
                aria-hidden="true"
              />
              <div className="absolute bottom-5 start-5 flex items-center gap-3 rounded-card border border-white/30 bg-[var(--blc-green-900)]/85 px-4 py-3 text-white shadow-soft backdrop-blur-sm sm:bottom-7 sm:start-7">
                <HeartHandshake
                  size={21}
                  className="text-[var(--blc-gold-300)]"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold">
                  {common("brand_name")}
                </span>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <Section variant="cream" className="py-8 lg:py-10">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(["trust_1", "trust_2", "trust_3", "trust_4"] as const).map(
              (key, index) => {
                const Icon = trustIcons[index];
                return (
                  <Reveal
                    key={key}
                    className="flex items-start gap-3 text-start font-semibold text-[var(--blc-green-700)]"
                  >
                    <Icon
                      size={24}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-[var(--blc-gold-500)]"
                    />
                    {t(key)}
                  </Reveal>
                );
              },
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t("trust_heading")}
              title={t("intro_title")}
              subtitle={t("intro_text")}
            />
          </Reveal>
        </Container>
      </Section>

      <Section variant="cream">
        <Container>
          <Reveal>
            <SectionHeading
              title={t("services_title")}
              subtitle={t("services_subtitle")}
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((service) => {
              const isArabic = locale === "ar";

              const slug = isArabic
                ? service.ar_slug || service.en_slug
                : service.en_slug;

              const title = isArabic
                ? service.service_name_ar || service.service_name
                : service.service_name;

              const tagline = isArabic
                ? service.service_sub_title_ar || service.service_sub_title
                : service.service_sub_title;

              const Icon = Heart;

              if (!slug || !title) {
                return null;
              }

              return (
                <Reveal key={service.name}>
                  <Link
                    href={`/${locale}/services/${slug}`}
                    className="group block h-full rounded-card bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-ring-light"
                  >
                    <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-card bg-[var(--blc-green-900)]">
                      <div
                        className="absolute -end-10 -top-14 size-44 rounded-full border border-[var(--blc-gold-300)]/25"
                        aria-hidden="true"
                      />
                      <div
                        className="absolute -bottom-16 -start-8 size-48 rounded-full bg-[var(--blc-green-700)]/50"
                        aria-hidden="true"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-16 items-center justify-center rounded-full border border-[var(--blc-cream-100)]/40 bg-[var(--blc-cream-100)]/10 transition-transform duration-500 group-hover:scale-105">
                          <Icon
                            size={30}
                            strokeWidth={1.5}
                            aria-hidden="true"
                            className="text-[var(--blc-cream-100)]"
                          />
                        </div>
                      </div>
                    </div>

                    <Icon
                      size={30}
                      aria-hidden="true"
                      className="text-[var(--blc-gold-500)]"
                    />

                    <h3 className="mt-6 text-xl font-bold text-[var(--blc-green-900)]">
                      {title}
                    </h3>

                    <p className="mt-3 text-[var(--blc-green-700)]">
                      {tagline}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-[var(--blc-gold-500)]">
                      {common("cta_learn_more")}

                      <ArrowUpRight
                        size={17}
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1 rtl:rotate-180"
                      />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section variant="sand">
        <Container>
          <div className="relative overflow-hidden">
            <Image
              src="/brand/logo.png"
              alt=""
              width={280}
              height={280}
              className="pointer-events-none absolute -end-12 -top-16 z-0 w-64 opacity-[0.07] grayscale"
              aria-hidden="true"
            />
            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
              <Reveal>
                <SectionHeading
                  title={t("standards_title")}
                  subtitle={t("standards_text")}
                />
              </Reveal>
              <Reveal className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <Badge>{t("standards_badge_1")}</Badge>
                <Badge>{t("standards_badge_2")}</Badge>
                <Badge>{t("standards_badge_3")}</Badge>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <SectionHeading title={t("how_title")} />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(["step_1", "step_2", "step_3"] as const).map((key, index) => (
              <Reveal key={key}>
                <article className="h-full border-s-2 border-[var(--blc-gold-300)] ps-6">
                  <span className="text-4xl font-bold text-[var(--blc-gold-500)]">
                    0{index + 1}
                  </span>
                  <p className="mt-4 text-lg text-[var(--blc-green-700)]">
                    {t(key)}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {testimonials.length > 0 && (
        <Section variant="cream">
          <Container>
            <Reveal>
              <SectionHeading title={t("testimonials_title")} />
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {testimonials
                .filter((testimonial) => testimonial.published)
                .map((testimonial) => (
                  <Reveal key={testimonial.id}>
                    <article className="rounded-card bg-white p-7 shadow-soft">
                      <Quote
                        size={28}
                        className="text-[var(--blc-gold-500)]"
                        aria-hidden="true"
                      />
                      <p className="mt-4 text-lg text-[var(--blc-green-700)]">
                        {testimonial.quote}
                      </p>
                      <p className="mt-5 font-semibold text-[var(--blc-green-900)]">
                        {testimonial.author_name}
                      </p>
                      <p className="text-sm text-[var(--blc-green-700)]">
                        {testimonial.relation}
                      </p>
                    </article>
                  </Reveal>
                ))}
            </div>
          </Container>
        </Section>
      )}

      {partners.length > 0 && (
        <Section>
          <Container>
            <Reveal>
              <SectionHeading
                title={t("partners_title")}
                subtitle={t("partners_text")}
              />
            </Reveal>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {partners
                .filter((partner) => partner.published)
                .map((partner) => (
                  <Reveal key={partner.id}>
                    <a
                      href={partner.website_url}
                      className="flex min-h-24 items-center justify-center rounded-card border border-[var(--blc-sand-200)] p-5 font-semibold text-[var(--blc-green-900)] hover:border-[var(--blc-gold-500)] focus-ring-light"
                    >
                      {partner.name}
                    </a>
                  </Reveal>
                ))}
            </div>
          </Container>
        </Section>
      )}

      <Section variant="cream">
        <Container>
          <Reveal>
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading title={t("blog_title")} />
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 font-semibold text-[var(--blc-gold-500)] focus-ring-light"
              >
                {t("blog_link")}
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="rtl:rotate-180"
                />
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {posts
              .filter((post) => post.published)
              .map((post) => (
                <Reveal key={post.slug}>
                  <article className="h-full rounded-card bg-white p-6 shadow-soft">
                    <BookOpen
                      size={26}
                      className="text-[var(--blc-gold-500)]"
                      aria-hidden="true"
                    />
                    <h3 className="mt-5 text-xl font-bold text-[var(--blc-green-900)]">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-[var(--blc-green-700)]">
                      {post.excerpt}
                    </p>
                  </article>
                </Reveal>
              ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <SectionHeading title={t("faq_title")} />
          </Reveal>
          <div className="mt-10">
            <Accordion
              items={publishedFaqs.map((faq) => ({
                question: faq.question,
                answer: faq.answer,
              }))}
            />
          </div>
        </Container>
      </Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Section variant="dark" className="text-center">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-3xl font-bold sm:text-4xl">
              {t("final_title")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--blc-cream-100)]">
              {t("final_text")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={phone}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[var(--blc-green-900)] hover:bg-[var(--blc-cream-100)] focus-ring-light"
              >
                <Phone size={18} aria-hidden="true" />
                {common("cta_call")}
              </a>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex min-h-12 items-center rounded-full border-2 border-[var(--blc-gold-300)] px-6 font-semibold text-white hover:bg-[var(--blc-green-700)] focus-ring-dark"
              >
                {t("request_care")}
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
