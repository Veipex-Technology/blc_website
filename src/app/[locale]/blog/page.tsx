import Link from "next/link";
import { ArrowUpRight, ChevronRight, NotebookText } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { MotionCard } from "@/components/motion/motion-card";
import { MotionFilters } from "@/components/motion/motion-filters";
import { MotionHero } from "@/components/motion/motion-hero";
import { MotionImage } from "@/components/motion/motion-image";
import { MotionSection } from "@/components/motion/motion-section";
import { BlogHeroImage } from "@/components/blog/BlogHeroImage";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import { getBlogPostsFromERP, type BlogPost } from "@/lib/erp/blog";
import type { Locale } from "@/i18n/routing";

const pageSize = 9;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "blog",
  });

  return createPageMetadata({
    locale,
    path: "blog",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  const t = await getTranslations({
    locale,
    namespace: "blog",
  });

  const isArabic = locale === "ar";

  /**
   * Display labels. Arabic mode uses the custom Arabic fields,
   * with fallback to the English values when they are empty.
   */
  const getCategoryLabel = (post: BlogPost): string =>
    isArabic
      ? post.blog_category_arabic_title || post.blog_category || ""
      : post.blog_category || "";

  const getBloggerLabel = (post: BlogPost): string =>
    isArabic
      ? post.blogger_arabic_short_name ||
        post.blogger_short_name ||
        post.blogger ||
        ""
      : post.blogger_short_name || post.blogger || "";

  const getTitle = (post: BlogPost): string =>
    isArabic ? post.custom_arabic_title || post.title || "" : post.title || "";

  const getIntro = (post: BlogPost): string =>
    isArabic
      ? post.custom_arabic_blog_intro || post.blog_intro || ""
      : post.blog_intro || "";

  /**
   * Get Blog Posts directly from ERPNext.
   */
  const allPosts = await getBlogPostsFromERP();

  /**
   * Only show published posts.
   */
  const publishedPosts = allPosts.filter((post) => post.published);

  /**
   * Build categories from the ERP blog_category field.
   *
   * slug  -> original blog_category value (used in the URL and filter)
   * title -> localized label (Arabic title in ar mode)
   */
  const categoryMap = new Map<string, { title: string; slug: string }>();

  for (const post of publishedPosts) {
    if (post.blog_category && !categoryMap.has(post.blog_category)) {
      categoryMap.set(post.blog_category, {
        title: getCategoryLabel(post),
        slug: post.blog_category,
      });
    }
  }

  const categories = Array.from(categoryMap.values());

  /**
   * Validate requested category.
   */
  const currentCategory = categories.some(
    (category) => category.slug === query.category,
  )
    ? query.category
    : undefined;

  /**
   * Filter posts by category.
   */
  const filteredPosts = currentCategory
    ? publishedPosts.filter((post) => post.blog_category === currentCategory)
    : publishedPosts;

  /**
   * Pagination.
   */
  const requestedPage = Number.parseInt(query.page ?? "1", 10);

  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * pageSize;

  const visiblePosts = filteredPosts.slice(startIndex, startIndex + pageSize);

  const dateFormatter = new Intl.DateTimeFormat(isArabic ? "ar-EG" : "en-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hrefFor = (page: number) => {
    const params = new URLSearchParams();

    if (currentCategory) {
      params.set("category", currentCategory);
    }

    if (page > 1) {
      params.set("page", String(page));
    }

    const queryString = params.toString();

    return `/${locale}/blog${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <main>
      {/* Editorial Blog Header */}
      <Section
        variant="dark"
        dir={isArabic ? "rtl" : "ltr"}
        className="relative overflow-hidden py-16 md:py-24 lg:py-28"
      >
        <div
          className="pointer-events-none absolute -end-24 -top-32 size-80 rounded-full border-[32px] border-[var(--blc-gold-300)]/15"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 -start-20 size-72 rounded-full border border-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute end-[12%] top-1/2 size-[28rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgb(51_78_61_/_0.42),_transparent_68%)] blur-2xl"
          aria-hidden="true"
        />

        <Container className="relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <MotionHero
            dir={isArabic ? "rtl" : "ltr"}
            className="max-w-2xl text-start"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--blc-gold-300)]">
              {t("header_eyebrow")}
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              {t("header_title")}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--blc-cream-100)] sm:text-xl">
              {t("header_description")}
            </p>

            <nav
              aria-label={t("breadcrumb_label")}
              className="mt-8 flex items-center gap-2 text-sm text-[var(--blc-cream-100)]/75"
            >
              <Link
                href={`/${locale}`}
                className="transition-colors hover:text-white focus-ring-dark"
              >
                {t("breadcrumb_home")}
              </Link>
              <ChevronRight
                size={15}
                aria-hidden="true"
                className="rtl:rotate-180"
              />
              <span className="text-[var(--blc-gold-300)]">
                {t("breadcrumb_blog")}
              </span>
            </nav>
          </MotionHero>
          <BlogHeroImage
            alt={t("header_image_alt")}
            badge={t("header_badge")}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <MotionSection variant="fade">
            <SectionHeading title={t("title")} subtitle={t("intro")} />
          </MotionSection>

          {/* Categories */}
          <MotionFilters
            locale={locale}
            filters={categories}
            currentCategory={currentCategory}
            allLabel={t("all")}
            ariaLabel={t("categories_label")}
          />

          {/* Empty State */}
          {visiblePosts.length === 0 ? (
            <MotionSection
              key={`empty-${currentCategory ?? "all"}`}
              variant="fade"
              className="mt-12"
            >
              <div className="rounded-card border border-[var(--blc-sand-200)] bg-[var(--blc-cream-100)] p-10 text-center shadow-soft">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-[var(--blc-gold-300)] bg-white text-[var(--blc-gold-500)]">
                  <NotebookText size={25} aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-[var(--blc-green-900)]">
                  {t("empty")}
                </h2>
                <p className="mx-auto mt-3 max-w-md text-[var(--blc-green-700)]">
                  {t("empty_description")}
                </p>
                <Link
                  href={`/${locale}`}
                  className="mt-6 inline-flex rounded-full border border-[var(--blc-green-900)] px-5 py-2.5 text-sm font-semibold text-[var(--blc-green-900)] transition-colors hover:bg-[var(--blc-green-900)] hover:text-white focus-ring-light"
                >
                  {t("breadcrumb_home")}
                </Link>
              </div>
            </MotionSection>
          ) : (
            <MotionSection
              key={`${currentCategory ?? "all"}-${safePage}`}
              className="mt-12 grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {visiblePosts.map((post) => {
                const categoryLabel = getCategoryLabel(post);
                const bloggerLabel = getBloggerLabel(post);
                const title = getTitle(post);
                const intro = getIntro(post);

                return (
                  <MotionCard
                    key={post.name}
                    className="group h-full overflow-hidden rounded-card bg-white shadow-soft"
                  >
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="flex h-full flex-col focus-ring-light"
                    >
                      {/* Blog Image */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--blc-sand-200)]">
                        {post.meta_image ? (
                          <MotionImage
                            src={post.meta_image}
                            alt={title || "Blog post"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="blog-card-image object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm font-semibold text-[var(--blc-green-700)]"></div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        {/* Category + Date */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--blc-green-700)]">
                          {categoryLabel && (
                            <span className="font-semibold text-[var(--blc-gold-500)]">
                              {categoryLabel}
                            </span>
                          )}

                          {post.published_on && (
                            <time dateTime={post.published_on}>
                              {dateFormatter.format(
                                new Date(post.published_on),
                              )}
                            </time>
                          )}
                        </div>

                        {/* Blog Title */}
                        <h2 className="blog-card-title mt-4 text-xl font-bold text-[var(--blc-green-900)]">
                          {title}
                        </h2>

                        {/* Blogger */}
                        {bloggerLabel && (
                          <p className="mt-2 text-sm text-[var(--blc-green-700)]">
                            {bloggerLabel}
                          </p>
                        )}

                        {/* Blog Intro */}
                        {intro && (
                          <p className="mt-3 line-clamp-4 text-[var(--blc-green-700)]">
                            {intro}
                          </p>
                        )}

                        {/* Read More */}
                        <span className="blog-card-read-more mt-auto inline-flex items-center gap-2 pt-4 font-semibold text-[var(--blc-gold-500)]">
                          {t("read_more")}

                          <ArrowUpRight
                            size={17}
                            aria-hidden="true"
                            className="blog-card-arrow rtl:rotate-180"
                          />
                        </span>
                      </div>
                    </Link>
                  </MotionCard>
                );
              })}
            </MotionSection>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label={t("pages_label")}
              className="mt-12 flex items-center justify-center gap-4"
            >
              <Link
                href={hrefFor(Math.max(1, safePage - 1))}
                aria-disabled={safePage === 1}
                className={`rounded-full border border-[var(--blc-sand-200)] px-4 py-2 text-sm font-semibold transition-transform active:scale-[0.98] focus-ring-light ${
                  safePage === 1
                    ? "pointer-events-none opacity-40"
                    : "hover:border-[var(--blc-gold-500)]"
                }`}
              >
                {t("previous")}
              </Link>

              <span className="text-sm font-semibold text-[var(--blc-green-700)]">
                {t("page")} {safePage} / {totalPages}
              </span>

              <Link
                href={hrefFor(Math.min(totalPages, safePage + 1))}
                aria-disabled={safePage === totalPages}
                className={`rounded-full border border-[var(--blc-sand-200)] px-4 py-2 text-sm font-semibold transition-transform active:scale-[0.98] focus-ring-light ${
                  safePage === totalPages
                    ? "pointer-events-none opacity-40"
                    : "hover:border-[var(--blc-gold-500)]"
                }`}
              >
                {t("next")}
              </Link>
            </nav>
          )}
        </Container>
      </Section>
    </main>
  );
}
