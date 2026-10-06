import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import { getBlogPostsFromERP } from "@/lib/erp/blog";
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

  /**
   * Get Blog Posts directly from ERPNext.
   *
   * Fields:
   * - blog_category
   * - title
   * - blog_intro
   * - route
   * - published_on
   * - meta_image
   */
  const allPosts = await getBlogPostsFromERP();

  /**
   * Only show published posts.
   */
  const publishedPosts = allPosts.filter((post) => post.published);

  /**
   * Build categories from the ERP blog_category field.
   *
   * Example:
   * blog_category = "Healthcare"
   *
   * The category itself is used as the category label.
   */
  const categoryNames = Array.from(
    new Set(
      publishedPosts
        .map((post) => post.blog_category)
        .filter((category): category is string => Boolean(category)),
    ),
  );

  const categories = categoryNames.map((category) => ({
    title: category,
    slug: category,
  }));

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

  const dateFormatter = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-EG" : "en-EG",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

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
      <Section>
        <Container>
          <Reveal>
            <SectionHeading title={t("title")} subtitle={t("intro")} />
          </Reveal>

          {/* Categories */}
          <nav
            aria-label={t("categories_label")}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href={`/${locale}/blog`}
              aria-current={!currentCategory ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-sm font-semibold focus-ring-light ${
                !currentCategory
                  ? "border-[var(--blc-green-900)] bg-[var(--blc-green-900)] text-white"
                  : "border-[var(--blc-sand-200)] text-[var(--blc-green-900)] hover:border-[var(--blc-gold-500)]"
              }`}
            >
              {t("all")}
            </Link>

            {categories.map((category) => {
              const active = currentCategory === category.slug;

              return (
                <Link
                  key={category.slug}
                  href={`/${locale}/blog?category=${encodeURIComponent(
                    category.slug,
                  )}`}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold focus-ring-light ${
                    active
                      ? "border-[var(--blc-green-900)] bg-[var(--blc-green-900)] text-white"
                      : "border-[var(--blc-sand-200)] text-[var(--blc-green-900)] hover:border-[var(--blc-gold-500)]"
                  }`}
                >
                  {category.title}
                </Link>
              );
            })}
          </nav>

          {/* Empty State */}
          {visiblePosts.length === 0 ? (
            <div className="mt-12 rounded-card bg-[var(--blc-cream-100)] p-10 text-center">
              <p className="text-xl font-semibold text-[var(--blc-green-900)]">
                {t("empty")}
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visiblePosts.map((post) => {
                /**
                 * Blog Post ERP fields:
                 *
                 * title       -> post.title
                 * category    -> post.blog_category
                 * intro       -> post.blog_intro
                 * slug        -> post.route
                 * image       -> post.meta_image
                 */
                return (
                  <Reveal key={post.name}>
                    <article className="group h-full overflow-hidden rounded-card bg-white shadow-soft">
                      <Link
                        href={`/${locale}/blog/${post.route}`}
                        className="block h-full focus-ring-light"
                      >
                        {/* Blog Image */}
                        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--blc-sand-200)]">
                          {post.meta_image ? (
                            <Image
                              src={post.meta_image}
                              alt={post.title ?? "Blog post"}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm font-semibold text-[var(--blc-green-700)]">
                              {post.title}
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          {/* Category + Date */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--blc-green-700)]">
                            {post.blog_category && (
                              <span className="font-semibold text-[var(--blc-gold-500)]">
                                {post.blog_category}
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
                          <h2 className="mt-4 text-xl font-bold text-[var(--blc-green-900)]">
                            {post.title}
                          </h2>

                          {/* Blog Intro */}
                          {post.blog_intro && (
                            <p className="mt-3 text-[var(--blc-green-700)]">
                              {post.blog_intro}
                            </p>
                          )}

                          {/* Read More */}
                          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-[var(--blc-gold-500)]">
                            {t("read_more")}

                            <ArrowUpRight
                              size={17}
                              aria-hidden="true"
                              className="rtl:rotate-180"
                            />
                          </span>
                        </div>
                      </Link>
                    </article>
                  </Reveal>
                );
              })}
            </div>
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
                className={`rounded-full border border-[var(--blc-sand-200)] px-4 py-2 text-sm font-semibold focus-ring-light ${
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
                className={`rounded-full border border-[var(--blc-sand-200)] px-4 py-2 text-sm font-semibold focus-ring-light ${
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
