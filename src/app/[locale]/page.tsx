import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Quote,
  ShieldCheck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link as LocaleLink } from "@/i18n/navigation";
import { Accordion } from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { HeroMotion, HeroTextLayer } from "@/components/sections/HeroMotion";
import { Section } from "@/components/ui/section";
import { Services } from "@/components/sections/Services";
import { AboutIntro } from "@/components/about-intro";
import { SectionHeading } from "@/components/ui/section-heading";
import { NewsletterSection } from "@/components/newsletter-section";
import { createPageMetadata } from "@/lib/metadata";
import { whatsappLink } from "@/lib/contact";
import { getWhatsAppNumberFromERP } from "@/lib/erp/contact-info";
import { getMainServicesFromERP } from "@/lib/erp/services";
import { getFaqs, getPartners, getTestimonials } from "@/lib/erp/api";

import type { Locale } from "@/i18n/routing";
import { FounderVideo } from "@/components/founder-video";
import { getMediaForWebsiteFromERP } from "@/lib/erp/media-for-website";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { TrustBadgesSection } from "@/components/trust-badges-section";

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
  const [mainServices, testimonials, partners, faqs, media] = await Promise.all(
    [
      getMainServicesFromERP(),
      getTestimonials(locale),
      getPartners(locale),
      getFaqs(locale),
      getMediaForWebsiteFromERP("Home Page").catch((error) => {
        console.log("media:", media, "founderVideoUrl:", founderVideoUrl);
        return [];
      }),
    ],
  );
  const founderVideoUrl = media[0]?.attach_wpov_url ?? null;
  console.log("media:", media, "founderVideoUrl:", founderVideoUrl);
  const whatsappNumber = await getWhatsAppNumberFromERP().catch(() => null);
  const whatsapp = whatsappLink(whatsappNumber, common("whatsapp_prefill"));
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
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--blc-green-900)] px-6 font-semibold text-white shadow-soft transition hover:bg-[var(--blc-green-700)] focus-ring-dark motion-reduce:transition-none"
                  >
                    {common("cta_whatsapp")}
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="rtl:rotate-180"
                    />
                  </a>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--blc-green-900)] px-6 font-semibold text-white shadow-soft transition hover:bg-[var(--blc-green-700)] focus-ring-dark motion-reduce:transition-none"
                  >
                    {t("request_care")}
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="rtl:rotate-180"
                    />
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
                    src="/images/illustrations/hero-section.jpg"
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

      <Section variant="sand" className="overflow-hidden">
        <Container>
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--blc-gold-500)]">
              {t("founderMessage.label")}
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-balance text-3xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-4xl">
              {t("founderMessage.title")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[var(--blc-green-700)]">
              {t("founderMessage.description")}
            </p>
          </Reveal>

          {/* VIDEO PLACEHOLDER: replace this div's content with <video> or an <iframe> */}
          <Reveal
            className="relative mx-auto mt-10 max-w-[960px]"
            variant="zoom"
          >
            <div
              className="pointer-events-none absolute -inset-8 rounded-[4rem] bg-[var(--blc-gold-300)]/20 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -end-12 -top-10 size-40 rounded-full bg-[var(--blc-green-700)]/20 blur-3xl"
              aria-hidden="true"
            />
            <FounderVideo
              videoUrl={founderVideoUrl}
              label={t("founderMessage.videoComingSoon")}
            />
          </Reveal>
        </Container>
      </Section>

      <div aria-hidden="true" className="relative z-10 h-0 overflow-visible">
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center">
          <span className="h-px w-full bg-gradient-to-r from-transparent via-[var(--blc-gold-500)]/45 to-transparent rtl:bg-gradient-to-l" />
          <span className="absolute size-3 rounded-full border-2 border-[var(--blc-cream-100)] bg-[var(--blc-gold-500)] shadow-[0_0_0_5px_rgb(185_135_57_/_0.14)]" />
        </div>
      </div>

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

      <HowItWorksSection locale={locale} />

      <TrustBadgesSection locale={locale} />

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
