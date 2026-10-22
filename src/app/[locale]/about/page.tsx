import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Activity,
  Brain,
  CheckCircle2,
  Compass,
  Globe2,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  ImageIcon,
  MessageCircle,
  PersonStanding,
  Phone,
  ShieldCheck,
  ShieldPlus,
  TrendingUp,
  Users,
  UsersRound,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import sanitizeHtml from "sanitize-html";

import { MissionVisionCollage } from "@/components/motion/mission-vision-collage";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import { whatsappLink } from "@/lib/contact";
import type { Locale } from "@/i18n/routing";
import { getMissionVisionFromERP } from "@/lib/erp/mission-vision";

function ImagePlaceholder({
  src,
  alt,
  label,
  className = "",
}: {
  src?: string;
  alt?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br from-[var(--blc-cream-100)] to-[var(--blc-sand-200)] ${className}`}
      aria-hidden={src || label ? undefined : true}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center text-[var(--blc-green-900)]">
          <span className="flex size-14 items-center justify-center rounded-full border border-[var(--blc-sand-200)] bg-white/70 shadow-sm">
            <ImageIcon size={28} strokeWidth={1.25} aria-hidden="true" />
          </span>
          {label && <span className="text-sm font-semibold">{label}</span>}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "about",
  });

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

  const t = await getTranslations({
    locale,
    namespace: "about",
  });

  const common = await getTranslations({
    locale,
    namespace: "common",
  });

  const missionVisionRecords = await getMissionVisionFromERP();

  const missionVision = missionVisionRecords[0] ?? null;

  /*
   * Select Mission/Vision content according to locale.
   *
   * English:
   * title / description / mission_image
   * vission_title / vission_description / vission_image
   *
   * Arabic:
   * ar_mission_title / ar_mission_description / ar_mission_image
   * ar_vission_title / ar_vission_description / ar_vission_image
   */

  const isArabic = locale === "ar";

  const missionTitle = isArabic
    ? missionVision?.ar_mission_title || missionVision?.title
    : missionVision?.title;

  const missionDescription = isArabic
    ? missionVision?.ar_mission_description || missionVision?.description
    : missionVision?.description;

  const missionImage = isArabic
    ? missionVision?.ar_mission_image || missionVision?.mission_image
    : missionVision?.mission_image;

  const visionTitle = isArabic
    ? missionVision?.ar_vission_title || missionVision?.vission_title
    : missionVision?.vission_title;

  const visionDescription = isArabic
    ? missionVision?.ar_vission_description ||
      missionVision?.vission_description
    : missionVision?.vission_description;

  const visionImage = isArabic
    ? missionVision?.ar_vission_image || missionVision?.vission_image
    : missionVision?.vission_image;

  /**
   * Convert ERPNext file paths to full URLs.
   */
  const getErpImageUrl = (image?: string) => {
    if (!image) return null;

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    const baseUrl = process.env.ERP_BASE_URL;

    if (!baseUrl) {
      return image;
    }

    return `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`;
  };

  const missionImageUrl = getErpImageUrl(missionImage);
  const visionImageUrl = getErpImageUrl(visionImage);

  const missionHtml = missionDescription
    ? sanitizeHtml(missionDescription)
    : "";

  const visionHtml = visionDescription ? sanitizeHtml(visionDescription) : "";

  const missionVisionPresentation = isArabic
    ? {
        eyebrow: "هدفنا",
        title: "نسترشد برسالتنا ونقود برؤيتنا.",
        subtitle:
          "التزامنا بالرعاية الحانية والتميز المهني وتحسين جودة الحياة يوجّه كل ما نفعله.",
        missionLabel: "رسالتنا",
        visionLabel: "رؤيتنا",
        missionFallback: "الرسالة",
        visionFallback: "الرؤية",
      }
    : {
        eyebrow: "Our Purpose",
        title: "Driven by Mission. Guided by Vision.",
        subtitle:
          "Our commitment to compassionate care, professional excellence, and a better quality of life guides everything we do.",
        missionLabel: "Our Mission",
        visionLabel: "Our Vision",
        missionFallback: "Mission",
        visionFallback: "Vision",
      };

  const phone = "tel:[Phone Number]";

  const whatsapp = whatsappLink(common("whatsapp_prefill"));

  const consultant = (() =>
    null as {
      photo_url: string;
      name_ar: string;
      name_en: string;
      bio_ar: string;
      bio_en: string;
    } | null)();

  const consultantSection = isArabic
    ? {
        eyebrow: "التعليم التمريضي المهني",
        title: "مستشار تمريض ألماني",
        subtitle: "التعلم من الخبرة الدولية",
        consultantName: "",
        bio: "",
        intro:
          "يقدم مستشارنا الألماني خبرة مهنية في التمريض إلى فريقنا، ويساعد ممرضينا على التعلم والتطور والالتزام بالممارسات التمريضية المهنية لتقديم مستوى أعلى من الرعاية.",
        body: "يعمل مستشارنا الألماني عن قرب مع فريق التمريض لتعزيز المعرفة المهنية والممارسات السريرية والتواصل ومعايير الجودة. ومن خلال التوجيه المنظم والتعلم العملي، يواصل ممرضونا تطوير المهارات اللازمة لتقديم رعاية آمنة وحانية ومهنية.",
        badge: "خبرة ألمانية في التمريض",
        imageAlt: "مستشار تمريض ألماني في بيئة تدريب سريرية",
        highlights: [
          {
            icon: GraduationCap,
            title: "تدريب مهني",
            text: "إرشاد عملي يستند إلى معايير التمريض المهنية.",
          },
          {
            icon: Globe2,
            title: "خبرة ألمانية",
            text: "معرفة وخبرة دولية تصل مباشرة إلى فريق التمريض لدينا.",
          },
          {
            icon: TrendingUp,
            title: "تطوير مستمر",
            text: "تعلم مستمر يساعد ممرضينا على النمو مهنياً.",
          },
        ],
      }
    : {
        eyebrow: "Professional Nursing Education",
        title: "Learning from German Expertise",
        subtitle: "",
        consultantName: "Frau Alexandra Dinspel",
        intro: "",
        bio: "Is a highly motivated, people-oriented professional with a strong commitment to integrity, collaboration, and excellence. She excels at building meaningful relationships, fostering trust, and creating a positive, supportive environment. Guided by empathy, professionalism, and mutual respect, she strives to deliver lasting value and make a meaningful impact in every interaction.",
        body: "Working closely with our nursing team, Frau Alexandra Dinspel supports the continuous improvement of clinical practices, professional communication, and quality standards through practical guidance and structured learning. Her expertise and collaborative approach help our nurses grow professionally while ensuring that every individual receives care that upholds their dignity, independence, safety, and well-being.",
        badge: "German Nursing Expertise",
        imageAlt:
          "German nursing consultant in a clinical training environment",
        highlights: [
          {
            icon: GraduationCap,
            title: "Professional Training",
            text: "Practical guidance based on professional nursing standards.",
          },
          {
            icon: Globe2,
            title: "German Expertise",
            text: "International knowledge and experience brought directly to our nursing team.",
          },
          {
            icon: TrendingUp,
            title: "Continuous Development",
            text: "Ongoing learning that helps our nurses grow professionally.",
          },
        ],
      };

  const values = [
    { key: "value_1", termKey: "value_1_term", icon: HeartHandshake },
    { key: "value_2", termKey: "value_2_term", icon: Compass },
    { key: "value_3", termKey: "value_3_term", icon: PersonStanding },
    { key: "value_4", termKey: "value_4_term", icon: UserRound },
    { key: "value_5", termKey: "value_5_term", icon: ShieldCheck },
    { key: "value_6", termKey: "value_6_term", icon: ShieldPlus },
    { key: "value_7", termKey: "value_7_term", icon: UsersRound },
    { key: "value_8", termKey: "value_8_term", icon: Activity },
    { key: "value_9", termKey: undefined, icon: Brain },
  ] as const;

  const promiseCards = [
    { key: "promise_1", icon: ShieldCheck },
    { key: "promise_2", icon: HeartHandshake },
    { key: "promise_3", icon: HeartPulse },
  ] as const;

  const standardsPoints = [
    { key: "standards_point_1", icon: HeartPulse },
    { key: "standards_point_2", icon: CheckCircle2 },
    { key: "standards_point_3", icon: ShieldCheck },
    { key: "standards_point_4", icon: Users },
  ] as const;

  function splitDescriptionPoints(description?: string): string[] {
    if (!description?.trim()) return [];

    // Convert common HTML block endings into line breaks.
    const plainText = description
      .replace(/<\s*br\s*\/?\s*>/gi, "\n")
      .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, "\n")
      .replace(/<\s*li\b[^>]*>/gi, "• ")
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;|&apos;/gi, "'")
      .trim();

    return plainText
      .split(/\n+|(?<=[.!?؟。؛])\s+|;/)
      .map((point) => point.trim())
      .map((point) => point.replace(/^[•\-–—]\s*/, ""))
      .map((point) => point.replace(/[.!?؟؛。]+$/, "").trim())
      .filter(Boolean);
  }

  const missionPoints = splitDescriptionPoints(
    isArabic
      ? missionVision?.ar_mission_description
      : missionVision?.description,
  );

  const visionPoints = splitDescriptionPoints(
    isArabic
      ? missionVision?.ar_vission_description
      : missionVision?.vission_description,
  );

  return (
    <main>
      {/* Page Header */}
      <Section
        variant="dark"
        dir={isArabic ? "rtl" : "ltr"}
        className="relative overflow-hidden py-14 lg:py-20"
      >
        <Image
          src="/brand/logo.png"
          alt=""
          width={320}
          height={320}
          className="pointer-events-none absolute -end-16 -top-24 w-72 opacity-[0.08] grayscale brightness-0 invert"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -start-20 size-64 rounded-full border-[28px] border-[var(--blc-gold-300)]/15"
          aria-hidden="true"
        />
        <Container className="relative">
          <Reveal className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blc-gold-300)]">
              {t("story_title")}
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--blc-cream-100)] sm:text-xl">
              {common("tagline")}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Story */}
      <Section variant="cream" dir={isArabic ? "rtl" : "ltr"}>
        <Container>
          <div className="relative grid items-center gap-12 overflow-hidden rounded-card border border-[var(--blc-sand-200)] bg-white p-6 shadow-soft sm:p-10 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:p-14">
            <div
              className="pointer-events-none absolute -end-20 -top-24 size-72 rounded-full border-[30px] border-[var(--blc-gold-300)]/20"
              aria-hidden="true"
            />

            <Reveal className="relative z-10 max-w-2xl">
              <p className="mb-5 inline-flex rounded-full border border-[var(--blc-gold-500)]/40 bg-[var(--blc-cream-100)] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--blc-gold-500)]">
                {common("tagline")}
              </p>
              <SectionHeading
                eyebrow={t("story_title")}
                title={t("title")}
                subtitle={t("story_text")}
                className="max-w-2xl"
              />
            </Reveal>

            <Reveal className="relative z-10 mx-auto w-full max-w-md lg:max-w-none">
              <div
                className="absolute -inset-4 rounded-[1.5rem] border border-[var(--blc-gold-300)]/50"
                aria-hidden="true"
              />
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-card bg-[var(--blc-green-900)] shadow-[0_20px_55px_rgb(2_56_48_/_0.18)] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/brand/logo.png"
                  alt={common("brand_name")}
                  width={420}
                  height={420}
                  className="relative z-10 w-3/5 max-w-xs object-contain brightness-0 invert opacity-90 transition-transform duration-700 hover:scale-105"
                />
                <div
                  className="absolute -bottom-20 -start-16 size-64 rounded-full border-[28px] border-[var(--blc-gold-300)]/20"
                  aria-hidden="true"
                />
                <div
                  className="absolute -end-12 -top-12 size-44 rounded-full bg-[var(--blc-green-700)]/60"
                  aria-hidden="true"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Standards */}
      <Section
        variant="sand"
        dir={isArabic ? "rtl" : "ltr"}
        className="relative overflow-hidden"
      >
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

            <div className="relative z-10 grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
              <div>
                <Reveal delay={0}>
                  <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blc-gold-500)]">
                    <span
                      className="size-2 rounded-full bg-[var(--blc-gold-300)]"
                      aria-hidden="true"
                    />
                    {t("standards_eyebrow")}
                  </p>
                </Reveal>

                <Reveal delay={100}>
                  <h2 className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-5xl lg:text-6xl">
                    {t("standards_title")}
                  </h2>
                </Reveal>

                <Reveal delay={200}>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--blc-green-700)]">
                    {t("standards_text")}
                  </p>
                </Reveal>

                <ul className="mt-9 grid gap-4 sm:grid-cols-2">
                  {standardsPoints.map(({ key, icon: Icon }, index) => (
                    <Reveal key={key} delay={300 + index * 100}>
                      <li className="group flex h-full items-center gap-4 rounded-card border border-[var(--blc-sand-200)] bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--blc-cream-100)] text-[var(--blc-green-900)] transition-colors duration-300 group-hover:bg-[var(--blc-gold-300)] motion-reduce:transition-none">
                          <Icon
                            size={22}
                            strokeWidth={1.6}
                            aria-hidden="true"
                          />
                        </span>
                        <span className="font-bold leading-snug text-[var(--blc-green-900)]">
                          {t(key)}
                        </span>
                      </li>
                    </Reveal>
                  ))}
                </ul>

                <Reveal delay={700}>
                  <Link
                    href={`/${locale}/contact`}
                    className="group mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--blc-green-900)] px-6 font-semibold text-white transition-colors duration-300 hover:bg-[var(--blc-green-700)] focus-ring-dark motion-reduce:transition-none"
                  >
                    {t("standards_cta")}
                    <ArrowUpRight
                      size={19}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1 motion-reduce:transform-none motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </Link>
                </Reveal>
              </div>

              <div className="standards-composition relative mx-auto min-h-[32rem] w-full max-w-xl lg:mx-0 lg:min-h-[38rem]">
                <div
                  className="pointer-events-none absolute -end-4 top-3 size-28 rounded-full border-[18px] border-[var(--blc-gold-300)]/30 sm:-end-8 sm:size-40"
                  aria-hidden="true"
                />

                <Reveal
                  delay={100}
                  className="absolute end-3 top-10 z-10 w-[76%] sm:end-8 lg:end-0"
                >
                  <div className="standards-main-image group relative aspect-[4/5] overflow-hidden rounded-card bg-[var(--blc-cream-100)] shadow-[0_22px_55px_rgb(2_56_48_/_0.16)] sm:aspect-[4/3] lg:aspect-[4/5]">
                    <ImagePlaceholder
                      src={consultant?.photo_url}
                      alt={t("standards_main_image_alt")}
                      label={t("standards_main_image_label")}
                      className="absolute inset-0"
                    />
                  </div>
                </Reveal>

                <Reveal
                  delay={300}
                  className="absolute start-0 top-0 z-20 w-[58%] sm:start-2 sm:w-[52%]"
                >
                  <article className="standards-feature-card overflow-hidden rounded-card border border-[var(--blc-sand-200)] bg-white p-3 shadow-[0_18px_45px_rgb(2_56_48_/_0.14)] sm:p-4">
                    <ImagePlaceholder
                      alt={t("standards_feature_image_alt")}
                      label={t("standards_feature_image_label")}
                      className="standards-feature-image aspect-[4/3] rounded-[0.75rem]"
                    />
                    <p className="mt-3 text-sm font-semibold text-[var(--blc-gold-500)]">
                      {t("standards_feature_title")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--blc-green-700)] sm:text-sm">
                      {t("standards_feature_text")}
                    </p>
                  </article>
                </Reveal>

                <Reveal
                  variant="zoom"
                  delay={500}
                  className="absolute bottom-3 start-2 z-20 w-[35%] sm:bottom-0 sm:start-6 sm:w-[38%]"
                >
                  <div className="standards-decorative-image rounded-card border-[6px] border-white bg-white p-1 shadow-[0_16px_35px_rgb(2_56_48_/_0.18)]">
                    <ImagePlaceholder
                      alt={t("standards_decorative_image_alt")}
                      label={t("standards_decorative_image_label")}
                      className="aspect-square rounded-[0.65rem]"
                    />
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* German Nursing Consultant */}
      <Section variant="cream" dir={isArabic ? "rtl" : "ltr"}>
        <Container>
          <div className="relative overflow-hidden rounded-card border border-[var(--blc-sand-200)] bg-white p-5 shadow-soft sm:p-8 lg:p-10">
            <div
              className="pointer-events-none absolute -end-20 -top-20 size-56 rounded-full border-[24px] border-[var(--blc-gold-300)]/20"
              aria-hidden="true"
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <Reveal>
                <div className="relative mx-auto w-full max-w-xl lg:mx-0">
                  <div
                    className="absolute -bottom-4 -start-4 size-28 rounded-card bg-[var(--blc-green-900)]/10 sm:-bottom-5 sm:-start-5"
                    aria-hidden="true"
                  />
                  <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-[var(--blc-sand-200)] bg-[var(--blc-sand-200)] shadow-soft">
                    <Image
                      src="/images/hero-placeholder.jpg"
                      alt={consultantSection.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-x-4 bottom-4 rounded-card border border-white/40 bg-[var(--blc-green-900)]/90 p-4 text-white backdrop-blur-sm sm:inset-x-6 sm:bottom-6">
                      <p className="text-sm font-semibold tracking-wide text-[var(--blc-gold-300)]">
                        {consultantSection.badge}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--blc-gold-500)]">
                    {consultantSection.eyebrow}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-4xl lg:text-5xl">
                    {consultantSection.title}
                  </h2>
                  {isArabic ? (
                    <>
                      <p className="mt-4 text-lg font-semibold text-[var(--blc-green-700)]">
                        {consultantSection.subtitle}
                      </p>
                      <p className="mt-5 text-lg leading-8 text-[var(--blc-green-700)]">
                        {consultantSection.intro}
                      </p>
                      <p className="mt-4 leading-7 text-[var(--blc-green-700)]">
                        {consultantSection.body}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="mt-5 text-2xl font-bold text-[var(--blc-green-900)] sm:text-3xl">
                        {consultantSection.consultantName}
                      </h3>
                      <p className="mt-3 leading-7 text-[var(--blc-green-700)]">
                        {consultantSection.bio}
                      </p>
                      <p className="mt-4 leading-7 text-[var(--blc-green-700)]">
                        {consultantSection.body}
                      </p>
                    </>
                  )}

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    {consultantSection.highlights.map((highlight) => {
                      const Icon = highlight.icon;

                      return (
                        <article
                          key={highlight.title}
                          className="rounded-card border border-[var(--blc-sand-200)] bg-[var(--blc-cream-100)]/50 p-4 transition-colors hover:border-[var(--blc-gold-300)]"
                        >
                          <Icon
                            size={22}
                            className="text-[var(--blc-gold-500)]"
                            aria-hidden="true"
                          />
                          <h3 className="mt-4 text-base font-bold text-[var(--blc-green-900)]">
                            {highlight.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-[var(--blc-green-700)]">
                            {highlight.text}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* More About BLC */}
      <Section variant="sand" className="relative overflow-hidden text-center">
        <Container>
          <header className="mx-auto max-w-3xl">
            <Reveal>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--blc-gold-500)]">
                {t("more_title")}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <h2 className="text-3xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-4xl">
                {t("more_title")}
              </h2>
            </Reveal>
            <Reveal delay={300}>
              <p className="mt-4 text-lg text-[var(--blc-green-700)]">
                {t("more_text")}
              </p>
            </Reveal>
          </header>
        </Container>
      </Section>

      {/* Dynamic Mission & Vision Presentation */}
      <Section variant="cream" dir={isArabic ? "rtl" : "ltr"}>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={missionVisionPresentation.eyebrow}
              title={missionVisionPresentation.title}
              subtitle={missionVisionPresentation.subtitle}
              className="mx-auto text-center"
            />
          </Reveal>

          <div className="mt-8 divide-y divide-[var(--blc-sand-200)]">
            <article className="mission-vision-row grid items-center gap-12 overflow-hidden py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
              <Reveal className="relative min-w-0 px-3 sm:px-6 lg:order-1 lg:px-0">
                <MissionVisionCollage
                  imageUrl={missionImageUrl}
                  title={missionTitle || t("mission_title")}
                  imageLabel={t("mission_image_label")}
                  secondaryImageLabel={t("secondary_image_label")}
                />
              </Reveal>

              <div className="max-w-xl lg:order-2 lg:ps-4">
                <Reveal>
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blc-gold-500)]">
                    {missionVisionPresentation.missionLabel}
                  </p>
                  <h3 className="text-4xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-5xl">
                    {missionTitle || t("mission_title")}
                  </h3>
                </Reveal>

                {missionPoints.length > 0 && (
                  <ul className="mt-7 space-y-3">
                    {missionPoints.map((point, index) => (
                      <Reveal
                        key={`${point}-${index}`}
                        delay={180 + index * 100}
                      >
                        <li className="mission-vision-point group flex items-center gap-3 text-[var(--blc-green-700)]">
                          <CheckCircle2
                            className="mission-vision-check size-5 shrink-0 text-[var(--blc-green-900)]"
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                          <span className="font-medium">{point}</span>
                        </li>
                      </Reveal>
                    ))}
                  </ul>
                )}
              </div>
            </article>

            <article className="mission-vision-row grid items-center gap-12 overflow-hidden py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
              <div className="max-w-xl lg:order-1 lg:pe-4">
                <Reveal>
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blc-gold-500)]">
                    {missionVisionPresentation.visionLabel}
                  </p>
                  <h3 className="text-4xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-5xl">
                    {visionTitle || t("vision_title")}
                  </h3>
                </Reveal>

                {visionPoints.length > 0 && (
                  <ul className="mt-7 space-y-3">
                    {visionPoints.map((point, index) => (
                      <Reveal
                        key={`${point}-${index}`}
                        delay={180 + index * 100}
                      >
                        <li className="mission-vision-point group flex items-center gap-3 text-[var(--blc-green-700)]">
                          <CheckCircle2
                            className="mission-vision-check size-5 shrink-0 text-[var(--blc-green-900)]"
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                          <span className="font-medium">{point}</span>
                        </li>
                      </Reveal>
                    ))}
                  </ul>
                )}
              </div>

              <Reveal className="relative min-w-0 px-3 sm:px-6 lg:order-2 lg:px-0">
                <MissionVisionCollage
                  imageUrl={visionImageUrl}
                  title={visionTitle || t("vision_title")}
                  imageLabel={t("vision_image_label")}
                  secondaryImageLabel={t("secondary_image_label")}
                  mirrored
                />
              </Reveal>
            </article>
          </div>
        </Container>
      </Section>

      {/* Mission & Vision */}

      <section
        className="relative overflow-hidden bg-[var(--blc-sand-200)] py-16 lg:py-24"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <Container>
          <Reveal className="text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blc-gold-500)]">
              {t("promise_eyebrow")}
            </p>
            <h2 className="text-3xl font-bold text-[var(--blc-green-900)] sm:text-4xl lg:text-5xl">
              {t("promise_title")}
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-3 lg:mt-14 lg:gap-6">
            {promiseCards.map(({ key, icon: Icon }, index) => (
              <Reveal key={key} delay={index * 120} className="h-full">
                <article className="group flex h-full flex-col rounded-[1.75rem] border border-white/80 bg-white/90 p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgb(2_56_48_/_0.12)] motion-reduce:transition-none sm:p-8">
                  <div className="mb-8 flex items-center justify-between">
                    <span
                      className="text-sm font-bold tracking-[0.16em] text-[var(--blc-gold-500)]"
                      aria-hidden="true"
                    >
                      0{index + 1}
                    </span>
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--blc-cream-100)] text-[var(--blc-green-900)] transition-colors duration-300 group-hover:bg-[var(--blc-green-900)] group-hover:text-[var(--blc-cream-100)] motion-reduce:transition-none">
                      <Icon size={23} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-[var(--blc-green-900)] sm:text-2xl">
                    {t(`${key}_text`)}
                  </h3>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Values */}
      <Section
        variant="cream"
        dir={isArabic ? "rtl" : "ltr"}
        className="relative overflow-hidden pb-16 lg:pb-24"
      >
        <div className="relative overflow-hidden bg-[var(--blc-green-900)] py-20 text-white lg:py-28">
          <div
            className="pointer-events-none absolute -end-20 -top-24 size-80 rounded-full border-[32px] border-[var(--blc-gold-300)]/15"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -start-24 bottom-[-10rem] size-96 rotate-12 rounded-[28%] bg-[var(--blc-green-700)]/50"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute end-8 top-8 size-32 opacity-60 sm:end-16 sm:top-12"
            style={{
              backgroundImage:
                "radial-gradient(var(--blc-gold-300) 1.5px, transparent 1.5px)",
              backgroundSize: "12px 12px",
            }}
            aria-hidden="true"
          />

          <Container className="relative">
            <Reveal className="max-w-4xl">
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--blc-gold-300)]">
                {t("values_eyebrow")}
              </p>
              <h2 className="max-w-3xl text-5xl font-bold leading-[0.95] text-white sm:text-7xl lg:text-8xl">
                {t("values_title")}
              </h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--blc-cream-100)] sm:text-xl">
                {t.rich("values_subtitle", {
                  charter: (chunks) => <em>{chunks}</em>,
                })}
              </p>
            </Reveal>
          </Container>
        </div>

        <Container className="relative z-10 -mt-10 lg:-mt-16">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ key, termKey, icon: Icon }, index) => (
              <Reveal key={key} delay={index * 80} className="h-full">
                <article className="group grid h-full min-h-52 grid-cols-[auto_1fr] gap-5 rounded-card border border-[var(--blc-sand-200)] bg-white p-6 shadow-[0_18px_45px_rgb(2_56_48_/_0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgb(2_56_48_/_0.18)] motion-reduce:transition-none sm:p-7">
                  <div className="flex flex-col items-start gap-5">
                    <span
                      className="text-sm font-bold tracking-[0.16em] text-[var(--blc-gold-300)]"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-[var(--blc-cream-100)] text-[var(--blc-green-900)] transition-colors duration-300 group-hover:bg-[var(--blc-gold-300)] motion-reduce:transition-none">
                      <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold leading-snug text-[var(--blc-green-900)] sm:text-xl">
                      {t(`${key}_title`)}
                      {termKey && (
                        <span
                          dir="ltr"
                          className="ms-1 inline-block text-base font-medium italic text-[var(--blc-green-700)]"
                        >
                          ({t(termKey)})
                        </span>
                      )}
                    </h3>
                    <p className="mt-4 leading-7 text-[var(--blc-green-700)]">
                      {t(`${key}_desc`)}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
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
