import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return createPageMetadata({
    locale,
    path: "about",
    title: t("title"),
    description: t("story_text"),
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const common = await getTranslations({ locale, namespace: "common" });
  const consultant = (() =>
    null as {
      photo_url: string;
      name_ar: string;
      name_en: string;
      bio_ar: string;
      bio_en: string;
    } | null)();
  const phone = "tel:[Phone Number]";
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(common("whatsapp_prefill"))}`;
  return (
    <main>
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t("story_title")}
              title={t("title")}
              subtitle={t("story_text")}
            />
          </Reveal>
        </Container>
      </Section>
      <Section variant="sand">
        <Container>
          <div className="relative overflow-hidden">
            <Image
              src="/brand/logo.png"
              alt=""
              width={300}
              height={300}
              className="pointer-events-none absolute -end-10 -top-16 z-0 w-64 opacity-[0.06] grayscale"
              aria-hidden="true"
            />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <Reveal>
                <SectionHeading
                  title={t("standards_title")}
                  subtitle={t("standards_text")}
                />
              </Reveal>
              {consultant && (
                <Reveal>
                  <article className="rounded-card bg-white p-7 shadow-soft">
                    <Image
                      src={consultant.photo_url}
                      alt={
                        locale === "ar"
                          ? consultant.name_ar
                          : consultant.name_en
                      }
                      width={120}
                      height={120}
                      className="size-24 rounded-full object-cover"
                    />
                    <p className="mt-5 text-sm font-semibold text-[var(--blc-gold-500)]">
                      {t("consultant_label")}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-[var(--blc-green-900)]">
                      {locale === "ar"
                        ? consultant.name_ar
                        : consultant.name_en}
                    </h2>
                    <p className="mt-3 text-[var(--blc-green-700)]">
                      {locale === "ar" ? consultant.bio_ar : consultant.bio_en}
                    </p>
                  </article>
                </Reveal>
              )}
            </div>
          </div>
        </Container>
      </Section>
      <Section variant="cream">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={t("more_title")}
              title={t("more_title")}
              subtitle={t("more_text")}
            />
          </Reveal>
        </Container>
      </Section>
      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              title={`${t("mission_title")} & ${t("vision_title")}`}
            />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal>
              <article className="h-full rounded-card border border-[var(--blc-sand-200)] p-8">
                <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
                  {t("mission_title")}
                </h2>
                <p className="mt-4 text-lg text-[var(--blc-green-700)]">
                  {t("mission")}
                </p>
              </article>
            </Reveal>
            <Reveal>
              <article className="h-full rounded-card border border-[var(--blc-sand-200)] p-8">
                <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
                  {t("vision_title")}
                </h2>
                <p className="mt-4 text-lg text-[var(--blc-green-700)]">
                  {t("vision")}
                </p>
              </article>
            </Reveal>
          </div>
        </Container>
      </Section>
      <Section variant="cream">
        <Container>
          <Reveal>
            <SectionHeading title={t("promise_title")} />
            <div className="mt-8 grid gap-3">
              {(["promise_1", "promise_2", "promise_3"] as const).map((key) => (
                <p
                  key={key}
                  className="text-3xl font-bold text-[var(--blc-gold-500)] sm:text-4xl"
                >
                  {t(key)}
                </p>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>
      <Section variant="dark" className="text-center">
        <Container>
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-3xl font-bold sm:text-4xl">
              {t("cta_title")}
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--blc-cream-100)]">
              {t("cta_text")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={phone}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[var(--blc-green-900)] hover:bg-[var(--blc-cream-100)] focus-ring-light"
              >
                <Phone size={18} aria-hidden="true" />
                {common("cta_call")}
              </a>
              <a
                href={whatsapp}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[var(--blc-gold-300)] px-6 font-semibold text-white hover:bg-[var(--blc-green-700)] focus-ring-dark"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {common("cta_whatsapp")}
              </a>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex min-h-12 items-center rounded-full border-2 border-white/70 px-6 font-semibold text-white hover:bg-white/10 focus-ring-dark"
              >
                {common("cta_request")}
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}
