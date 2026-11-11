import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Link2,
  MessageCircle,
  UserRound,
} from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";
import { BlogHeroImage } from "@/components/blog-hero-image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import { whatsappLink } from "@/lib/contact";
import { getWhatsAppNumberFromERP } from "@/lib/erp/contact-info";
import { getBlogPostsFromERP } from "@/lib/erp/blog";
import type { BlogPost } from "@/lib/erp/blog";
import type { Locale } from "@/i18n/routing";

/**
 * Localized display values.
 * Arabic mode uses the custom Arabic fields, with fallback to English
 * values when they are empty.
 */
function getCategoryLabel(post: BlogPost, locale: Locale): string {
  return locale === "ar"
    ? post.blog_category_arabic_title || post.blog_category || ""
    : post.blog_category || "";
}

function getBloggerLabel(post: BlogPost, locale: Locale): string {
  return locale === "ar"
    ? post.blogger_arabic_short_name ||
        post.blogger_short_name ||
        post.blogger ||
        ""
    : post.blogger_short_name || post.blogger || "";
}

function getTitle(post: BlogPost, locale: Locale): string {
  return locale === "ar"
    ? post.custom_arabic_title || post.title || ""
    : post.title || "";
}

function getIntro(post: BlogPost, locale: Locale): string {
  return locale === "ar"
    ? post.custom_arabic_blog_intro || post.blog_intro || ""
    : post.blog_intro || "";
}

function getContent(post: BlogPost, locale: Locale): string {
  const english = post.content_html || post.content_md || post.content || "";
  return locale === "ar" ? post.custom_arabic_content || english : english;
}

/**
 * Fetch a single blog post by matching its normalized slug against ERP routes.
 */
async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPostsFromERP();
  const matchedPost = posts.find(
    (post) => post.published && post.slug === slug,
  );
  return matchedPost ?? null;
}

/**
 * Fetch optional site settings (e.g. phone/whatsapp) from ERP if configured,
 * with built-in safe fallbacks.
 */
function dateLabel(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export async function generateStaticParams() {
  const locales: Locale[] = ["ar", "en"];
  const posts = await getBlogPostsFromERP();
  const publishedPosts = posts.filter((post) => post.published && post.slug);

  return locales.flatMap((locale) =>
    publishedPosts.map((post) => ({
      locale,
      slug: post.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.title?.trim()) return {};

  const arabicTitle =
    locale === "ar" ? post.custom_arabic_title?.trim() : undefined;

  const title = arabicTitle || post.meta_title?.trim() || post.title;
  const description =
    (locale === "ar" ? post.custom_arabic_blog_intro?.trim() : undefined) ||
    post.meta_description?.trim() ||
    post.blog_intro ||
    title;

  return createPageMetadata({
    locale,
    path: `blog/${slug}`,
    title,
    description,
    image: post.meta_image,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getBlogPostsFromERP(),
  ]);

  if (!post || !post.title?.trim() || !post.published) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "blog" });
  const common = await getTranslations({ locale, namespace: "common" });
  const whatsappNumber = await getWhatsAppNumberFromERP().catch(() => null);

  const isArabic = locale === "ar";
  const title = getTitle(post, locale);
  const intro = getIntro(post, locale);
  const categoryLabel = getCategoryLabel(post, locale);
  const bloggerLabel = getBloggerLabel(post, locale);

  // Arabic content in ar mode, English content otherwise (with fallback)
  const rawContent = getContent(post, locale);

  const safeBody = sanitizeHtml(rawContent, {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title"],
    },
  });

  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/${locale}/blog/${post.slug}`;

  const shareLinks = [
    {
      href: whatsappLink(whatsappNumber, `${title} ${canonical}`),
      label: t("share_whatsapp"),
    },
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`,
      label: t("share_facebook"),
    },
    {
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(title)}`,
      label: t("share_x"),
    },
  ];

  // Find related posts within the same category (compared by original value)
  const related = allPosts
    .filter(
      (candidate) =>
        candidate.published &&
        candidate.slug !== post.slug &&
        candidate.blog_category === post.blog_category,
    )
    .slice(0, 3);

  const whatsappHref = whatsappLink(whatsappNumber, common("whatsapp_prefill"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: locale,
    headline: title,
    description: intro,
    datePublished: post.published_on,
    author: {
      "@type": "Organization",
      name: bloggerLabel || "Better Life Care",
    },
    // meta_image is already an absolute URL (see getBlogPostsFromERP)
    image: post.meta_image || undefined,
    mainEntityOfPage: canonical,
    publisher: { "@type": "Organization", name: "Better Life Care" },
  };

  return (
    <main>
      <Section variant="cream" dir={isArabic ? "rtl" : "ltr"}>
        <Container>
          <article>
            <Reveal variant="zoom">
              <div className="mx-auto max-w-5xl">
                <nav
                  aria-label={t("breadcrumb_label")}
                  className="mb-7 flex items-center gap-2 overflow-hidden text-sm text-[var(--blc-green-700)]"
                >
                  <Link
                    href={`/${locale}`}
                    className="shrink-0 font-semibold hover:text-[var(--blc-green-900)] focus-ring-light"
                  >
                    {t("breadcrumb_home")}
                  </Link>
                  <ChevronRight
                    size={15}
                    aria-hidden="true"
                    className="shrink-0 text-[var(--blc-gold-500)] rtl:rotate-180"
                  />
                  <Link
                    href={`/${locale}/blog`}
                    className="shrink-0 font-semibold hover:text-[var(--blc-green-900)] focus-ring-light"
                  >
                    {t("breadcrumb_blog")}
                  </Link>
                  <ChevronRight
                    size={15}
                    aria-hidden="true"
                    className="shrink-0 text-[var(--blc-gold-500)] rtl:rotate-180"
                  />
                  <span className="truncate" aria-current="page">
                    {title}
                  </span>
                </nav>

                <BlogHeroImage
                  src={post.meta_image}
                  alt={title || t("image_alt")}
                />
              </div>
            </Reveal>

            <Reveal delay={100}>
              <header className="mx-auto mt-10 max-w-4xl text-center">
                {categoryLabel && (
                  <span className="inline-flex rounded-full border border-[var(--blc-gold-500)]/40 bg-[var(--blc-white)] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--blc-gold-500)] shadow-sm">
                    {categoryLabel}
                  </span>
                )}

                <h1 className="mt-6 text-4xl font-bold leading-[1.1] text-[var(--blc-green-900)] sm:text-6xl">
                  {title}
                </h1>

                {intro && (
                  <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[var(--blc-green-700)] sm:text-xl">
                    {intro}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-[var(--blc-green-700)]">
                  {post.published_on && (
                    <time
                      dateTime={post.published_on}
                      className="inline-flex items-center gap-2"
                    >
                      <CalendarDays
                        size={17}
                        className="text-[var(--blc-gold-500)]"
                        aria-hidden="true"
                      />
                      {dateLabel(post.published_on, locale)}
                    </time>
                  )}
                  {post.read_time !== undefined && (
                    <span className="inline-flex items-center gap-2">
                      <Clock3
                        size={17}
                        className="text-[var(--blc-gold-500)]"
                        aria-hidden="true"
                      />
                      {post.read_time} {t("read_time")}
                    </span>
                  )}
                  {bloggerLabel && (
                    <span className="inline-flex items-center gap-2">
                      <UserRound
                        size={17}
                        className="text-[var(--blc-gold-500)]"
                        aria-hidden="true"
                      />
                      {bloggerLabel}
                    </span>
                  )}
                </div>
              </header>
            </Reveal>

            <div className="mx-auto mt-14 max-w-4xl">
              {safeBody ? (
                <div
                  className="article-body mt-10 text-[var(--blc-green-700)] [&>h2]:mt-8 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[var(--blc-green-900)] [&>h3]:mt-6 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[var(--blc-green-900)] [&>p]:mt-4 [&>ul]:mt-4 [&>ul]:list-disc [&>ul]:ps-6 [&>ol]:mt-4 [&>ol]:list-decimal [&>ol]:ps-6"
                  dangerouslySetInnerHTML={{ __html: safeBody }}
                />
              ) : (
                intro && (
                  <p className="mt-6 text-lg text-[var(--blc-green-700)]">
                    {intro}
                  </p>
                )
              )}

              <div className="mt-10 rounded-xl border-s-4 border-[var(--blc-gold-500)] bg-[var(--blc-cream-100)] p-5 text-sm text-[var(--blc-green-700)]">
                {t("disclaimer")}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--blc-sand-200)] pt-6">
                <span className="font-semibold text-[var(--blc-green-900)]">
                  {t("share")}
                </span>
                {shareLinks.map((share) => (
                  <a
                    key={share.label}
                    href={share.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={share.label}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--blc-sand-200)] px-4 text-sm font-semibold text-[var(--blc-green-900)] hover:border-[var(--blc-gold-500)] focus-ring-light"
                  >
                    <Link2 size={16} aria-hidden="true" />
                    {share.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section variant="cream" dir={isArabic ? "rtl" : "ltr"}>
          <Container>
            <Reveal>
              <SectionHeading title={t("related")} />
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {related.map((relatedPost) => {
                const relatedTitle = getTitle(relatedPost, locale);
                const relatedIntro = getIntro(relatedPost, locale);
                const relatedCategory = getCategoryLabel(relatedPost, locale);

                return (
                  <Reveal key={relatedPost.name}>
                    <Link
                      href={`/${locale}/blog/${relatedPost.slug}`}
                      className="group block h-full rounded-card bg-white p-6 shadow-soft hover:-translate-y-1 focus-ring-light"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[var(--blc-sand-200)]">
                        {relatedPost.meta_image ? (
                          <Image
                            src={relatedPost.meta_image}
                            alt={relatedTitle || "Related post"}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-semibold text-[var(--blc-green-700)]">
                            {relatedTitle}
                          </div>
                        )}
                      </div>

                      {relatedCategory && (
                        <span className="mt-5 inline-block text-sm font-semibold text-[var(--blc-gold-500)]">
                          {relatedCategory}
                        </span>
                      )}

                      <h2 className="mt-2 text-xl font-bold text-[var(--blc-green-900)]">
                        {relatedTitle}
                      </h2>
                      {relatedIntro && (
                        <p className="mt-3 text-[var(--blc-green-700)] line-clamp-2">
                          {relatedIntro}
                        </p>
                      )}
                      <span className="mt-5 inline-flex items-center gap-2 font-semibold text-[var(--blc-gold-500)]">
                        {t("read_more")}
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

      <Section
        variant="dark"
        dir={isArabic ? "rtl" : "ltr"}
        className="text-center"
      >
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
                href={whatsappHref}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[var(--blc-gold-300)] px-6 font-semibold text-white hover:bg-[var(--blc-green-700)] focus-ring-dark"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {common("cta_whatsapp")}
              </a>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex min-h-12 items-center rounded-full border border-white/70 px-6 font-semibold text-white hover:bg-white/10 focus-ring-dark"
              >
                {common("cta_request")}
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
