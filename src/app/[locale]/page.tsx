import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  MessageCircle,
  Phone,
  Quote,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link as LocaleLink } from "@/i18n/navigation";
import { Accordion } from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { MotionCard } from "@/components/motion/motion-card";
import { MotionSection } from "@/components/motion/motion-section";
import { HeroMotion, HeroTextLayer } from "@/components/sections/HeroMotion";
import { Section } from "@/components/ui/section";
import { Services } from "@/components/sections/Services";
import { AboutIntro } from "@/components/about-intro";
import { SectionHeading } from "@/components/ui/section-heading";
import { NewsletterSection } from "@/components/newsletter-section";
import { createPageMetadata } from "@/lib/metadata";
import { whatsappLink } from "@/lib/contact";
import { getMainServicesFromERP } from "@/lib/erp/services";
import {
  getFaqs,
  getPartners,
  getPosts,
  getSiteSettings,
  getTestimonials,
} from "@/lib/erp/api";

import { getServicesFromERP } from "@/lib/erp/services";
import type { Locale } from "@/i18n/routing";

const trustIcons = [ShieldCheck, GraduationCap, ClipboardCheck, HeartHandshake];
const whyChooseCards = [
  {
    titleKey: "why_choose_card_1_title",
    descriptionKey: "why_choose_card_1_description",
    icon: ShieldCheck,
  },
  {
    titleKey: "why_choose_card_2_title",
    descriptionKey: "why_choose_card_2_description",
    icon: HeartHandshake,
  },
  {
    titleKey: "why_choose_card_3_title",
    descriptionKey: "why_choose_card_3_description",
    icon: HeartPulse,
  },
] as const;
const howItWorksSteps = [
  {
    icon: Phone,
    titleKey: "how_step_1_title",
    descriptionKey: "how_step_1_description",
  },
  {
    icon: ClipboardList,
    titleKey: "how_step_2_title",
    descriptionKey: "how_step_2_description",
  },
  {
    icon: HeartPulse,
    titleKey: "how_step_3_title",
    descriptionKey: "how_step_3_description",
  },
] as const;
type TrustBadgeKey =
  | "trust_german_standards"
  | "trust_certified_nursing"
  | "trust_24_7_support"
  | "trust_personalized_care";

const trustBadges: {
  id: string;
  icon: LucideIcon;
  labelKey: TrustBadgeKey;
}[] = [
  {
    id: "german-standards",
    icon: ShieldCheck,
    labelKey: "trust_german_standards",
  },
  {
    id: "certified-nursing",
    icon: Stethoscope,
    labelKey: "trust_certified_nursing",
  },
  { id: "24-7-support", icon: Clock3, labelKey: "trust_24_7_support" },
  {
    id: "personalized-care",
    icon: HeartHandshake,
    labelKey: "trust_personalized_care",
  },
];

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
  const [
    services,
    mainServices,
    testimonials,
    partners,
    postsResult,
    faqs,
    settings,
  ] = await Promise.all([
    getServicesFromERP(),
    getMainServicesFromERP(),
    getTestimonials(locale),
    getPartners(locale),
    getPosts({ lang: locale, page: 1 }),
    getFaqs(locale),
    getSiteSettings(locale),
  ]);
  const posts = postsResult.posts;
  const phone = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const whatsapp = whatsappLink(common("whatsapp_prefill"));
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

        <HeroMotion>
          <Container className="relative z-10 grid min-h-[clamp(42rem,78vh,54rem)] items-center gap-14 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-24">
            <Reveal className="relative z-10 max-w-2xl">
              <HeroTextLayer delay={0.05}>
                <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--blc-gold-500)]/40 bg-white/60 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--blc-gold-500)]">
                  <HeartHandshake size={17} aria-hidden="true" />
                  {common("tagline")}
                </p>
              </HeroTextLayer>
              <HeroTextLayer delay={0.15}>
                <h1 className="max-w-xl text-start text-5xl font-bold leading-[1.05] text-[var(--blc-green-900)] sm:text-6xl lg:text-7xl">
                  {t("title")}
                </h1>
              </HeroTextLayer>
              <HeroTextLayer delay={0.25}>
                <p className="mt-7 max-w-xl text-start text-lg leading-8 text-[var(--blc-green-700)] sm:text-xl">
                  {t("subtitle")}
                </p>
              </HeroTextLayer>
              <HeroTextLayer delay={0.38}>
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
              </HeroTextLayer>
            </Reveal>

            <HeroTextLayer delay={0.2} className="relative z-10">
              <Reveal className="relative mx-auto w-full max-w-xl overflow-visible lg:max-w-none">
                <div
                  className="absolute -inset-5 rounded-[2rem] border border-[var(--blc-gold-300)]/50 lg:-inset-7"
                  aria-hidden="true"
                />
                {/* A separate oval shadow stays outside the clipping layer for a curved floating effect. */}
                <div
                  className="pointer-events-none absolute inset-x-[8%] bottom-[-18px] z-0 h-10 rounded-[50%] bg-[rgb(2_56_48_/_0.24)] blur-[42px]"
                  aria-hidden="true"
                />
                {/* The image card remains above the oval while clipping its own rounded contents. */}
                <div className="relative z-10 isolate aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/70 bg-[var(--blc-green-900)] sm:aspect-[5/4] lg:aspect-[4/5]">
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
                  {/* Full-card overlay follows the image shape and stays above the photo. */}
                  <div
                    className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-gradient-to-t from-[var(--blc-green-900)]/65 via-transparent to-[var(--blc-green-900)]/10"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -end-16 -top-16 size-48 rounded-full border-[20px] border-[var(--blc-cream-100)]/20"
                    aria-hidden="true"
                  />
                  {/* Brand badge remains above the gradient for readable contrast. */}
                  <div className="absolute bottom-5 start-5 z-20 flex items-center gap-3 rounded-card border border-white/30 bg-[var(--blc-green-900)]/85 px-4 py-3 text-white shadow-soft backdrop-blur-sm sm:bottom-7 sm:start-7">
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
            </HeroTextLayer>
          </Container>
        </HeroMotion>
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
        <AboutIntro
          eyebrow={t("trust_heading")}
          title={t("intro_title")}
          description={t.rich("intro_text", {
            strong: (chunks) => <strong>{chunks}</strong>,
            break: () => <span className="mt-4 block" />,
          })}
        />
      </Section>

      <Services services={mainServices} locale={locale} />

      <section className="overflow-hidden bg-[var(--blc-sand-200)] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold text-[var(--blc-green-900)] sm:text-4xl">
              {t("why_choose_title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--blc-green-700)]">
              {t("why_choose_subtitle")}
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseCards.map(
              ({ titleKey, descriptionKey, icon: Icon }, index) => {
                return (
                  <Reveal key={titleKey} delay={index * 120} className="h-full">
                    <article className="group flex h-full flex-col rounded-2xl border-t-4 border-[var(--blc-green-700)] bg-white p-6 text-start shadow-soft transition duration-300 hover:-translate-y-2 hover:shadow-[0_20px_45px_var(--blc-green-900)] motion-reduce:transition-none lg:p-8">
                      <div className="flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--blc-cream-100)] text-[var(--blc-green-700)] transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none">
                          <Icon
                            size={24}
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="text-sm font-semibold text-[var(--blc-green-700)]/50">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="mt-6 text-lg font-semibold leading-snug text-[var(--blc-green-900)]">
                        {t(titleKey)}
                      </h3>
                      <p className="mt-3 text-base leading-relaxed text-[var(--blc-green-900)]/80">
                        {t(descriptionKey)}
                      </p>
                    </article>
                  </Reveal>
                );
              },
            )}
          </div>

          <Reveal delay={360} className="mx-auto mt-12 max-w-3xl text-center">
            <p className="text-lg leading-relaxed">
              <span className="font-bold text-[var(--blc-green-700)]">
                {t("why_choose_closing_title")}
              </span>{" "}
              <span className="text-[var(--blc-green-700)]/80">
                {t("why_choose_closing_text")}
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      <Section variant="dark" className="text-center">
        <Container>
          <Reveal>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--blc-gold-300)]">
                {t("final_eyebrow")}
              </p>
              <h2 className="mt-4 max-w-3xl text-balance text-3xl font-bold sm:text-4xl">
                {t("final_title")}
              </h2>
              <p className="mt-5 max-w-2xl text-[var(--blc-cream-100)]">
                {t("final_text")}
              </p>
              <div className="mt-8 flex flex-col items-center gap-3">
                <LocaleLink
                  href="/contact"
                  className="group relative inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[var(--blc-cream-100)] px-10 py-4 text-base font-semibold text-[var(--blc-green-900)] shadow-soft transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgb(2_56_48/0.25)] focus-visible:ring-2 focus-visible:ring-[var(--blc-gold-300)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--blc-green-900)] motion-reduce:transition-none"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-1 rounded-full border border-[var(--blc-gold-300)]/60 motion-safe:animate-[ping_2.4s_ease-out_infinite] motion-reduce:animate-none"
                  />
                  <span className="relative z-10 inline-flex items-center gap-3">
                    {t("final_contact_cta")}
                    <ArrowRight
                      size={20}
                      aria-hidden="true"
                      className={`transition-transform duration-300 motion-reduce:transition-none ${
                        locale === "ar"
                          ? "rotate-180 group-hover:-translate-x-1"
                          : "group-hover:translate-x-1"
                      }`}
                    />
                  </span>
                </LocaleLink>
                <a
                  href={whatsapp}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-ring-dark"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  {common("cta_whatsapp")}
                </a>
              </div>
              <p className="mt-5 text-sm text-[var(--blc-cream-100)]/80">
                {t("final_reassurance")}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <section className="bg-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="text-2xl font-bold text-[var(--blc-green-900)] sm:text-3xl"></h2>
          </Reveal>

          <MotionSection
            variant="stagger"
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {trustBadges.map(({ id, icon: Icon, labelKey }) => (
              <MotionCard
                key={id}
                withHoverShadow={false}
                className="group flex items-center justify-center gap-3 text-center transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none"
              >
                <div className="relative flex flex-col items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[var(--blc-green-700)] bg-[var(--blc-cream-100)] text-[var(--blc-green-700)] transition-colors duration-300 group-hover:bg-[var(--blc-green-700)] group-hover:text-white motion-reduce:transition-none lg:h-20 lg:w-20"
                  >
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full border border-[var(--blc-green-700)] motion-safe:animate-[ping_1s_ease-out_1] motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                    <Icon
                      className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-[var(--blc-green-900)] transition-colors duration-300 group-hover:text-[var(--blc-green-700)]">
                    {t(labelKey)}
                  </span>
                </div>
              </MotionCard>
            ))}
          </MotionSection>
        </div>
      </section>

      <Section>
        <Container>
          <div className="mb-16 text-center">
            <Reveal>
              <h2 className="text-3xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-4xl">
                {t("how_title")}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-lg text-[var(--blc-green-700)]">
                {t("how_subtitle")}
              </p>
            </Reveal>
          </div>
          <div className="relative">
            <Reveal className="pointer-events-none absolute start-0 top-1/2 hidden h-1 w-full -translate-y-1/2 md:block">
              <span
                className="block h-full w-full bg-[var(--blc-green-700)]/20"
                aria-hidden="true"
              />
            </Reveal>
            <div className="grid gap-12 md:grid-cols-3">
              {howItWorksSteps.map(
                ({ icon: Icon, titleKey, descriptionKey }, index) => (
                  <Reveal key={titleKey} delay={index * 150}>
                    <article className="relative text-center">
                      <div className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--blc-green-700)] text-white shadow-lg ring-8 ring-white transition duration-300 hover:scale-105 hover:shadow-xl motion-reduce:transition-none">
                        <Icon
                          className="h-10 w-10"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <span className="absolute -end-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--blc-gold-500)] text-xs font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <h3 className="mb-2 mt-6 text-xl font-bold text-[var(--blc-green-900)]">
                        {t(titleKey)}
                      </h3>
                      <p className="text-[var(--blc-green-700)] leading-relaxed">
                        {t(descriptionKey)}
                      </p>
                    </article>
                  </Reveal>
                ),
              )}
            </div>
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

      <NewsletterSection />
    </>
  );
}
