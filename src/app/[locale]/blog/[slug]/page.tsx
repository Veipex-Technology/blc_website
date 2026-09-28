import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Link2, MessageCircle, Phone } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import { getPost, getPosts, getSiteSettings } from "@/lib/erp/api";
import type { Locale } from "@/i18n/routing";

function dateLabel(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export async function generateStaticParams() {
  const locales: Locale[] = ["ar", "en"];
  return (
    await Promise.all(
      locales.map(async (locale) =>
        (await getPosts({ lang: locale, page: 1 })).posts.map((post) => ({
          locale,
          slug: post.slug,
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
  const post = await getPost(slug, locale);
  if (!post || !post.title.trim() || !post.body.trim()) return {};
  const title = post.seo_title.trim() || post.title;
  const description = post.seo_description.trim() || post.excerpt;
  return createPageMetadata({
    locale,
    path: `blog/${slug}`,
    title,
    description,
    image: post.cover_image,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPost(slug, locale);
  if (!post || !post.title.trim() || !post.body.trim()) notFound();
  const t = await getTranslations({ locale, namespace: "blog" });
  const common = await getTranslations({ locale, namespace: "common" });
  const safeBody = sanitizeHtml(post.body, {
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
    ],
    allowedAttributes: { a: ["href", "title", "target", "rel"] },
  });
  const canonical = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/${locale}/blog/${post.slug}`;
  const shareLinks = [
    {
      href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${canonical}`)}`,
      label: t("share_whatsapp"),
    },
    {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}`,
      label: t("share_facebook"),
    },
    {
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(canonical)}&text=${encodeURIComponent(post.title)}`,
      label: t("share_x"),
    },
  ];
  const [relatedResult, settings] = await Promise.all([
    getPosts({ lang: locale, page: 1, category: post.category?.slug }),
    getSiteSettings(locale),
  ]);
  const related = relatedResult.posts
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, 3);
  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const whatsappHref = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(common("whatsapp_prefill"))}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_on,
    author: { "@type": "Organization", name: post.author_name },
    image: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}${post.cover_image}`,
    mainEntityOfPage: canonical,
    publisher: { "@type": "Organization", name: "Better Life Care" },
  };

  return (
    <main>
      <Section>
        <Container>
          <article>
            <Reveal>
              <div className="mx-auto max-w-4xl">
                <div className="relative aspect-[16/8] overflow-hidden rounded-card bg-[var(--blc-sand-200)]">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 900px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--blc-green-700)]">
                  <span className="font-semibold text-[var(--blc-gold-500)]">
                    {post.category?.title ?? ""}
                  </span>
                  <time dateTime={post.published_on}>
                    {dateLabel(post.published_on, locale)}
                  </time>
                </div>
                <h1 className="mt-5 text-4xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-6xl">
                  {post.title}
                </h1>
                <div
                  className="article-body mt-10 text-[var(--blc-green-700)]"
                  dangerouslySetInnerHTML={{ __html: safeBody }}
                />
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
            </Reveal>
          </article>
        </Container>
      </Section>
      <Section variant="cream">
        <Container>
          <Reveal>
            <SectionHeading title={t("related")} />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((relatedPost) => (
              <Reveal key={relatedPost.slug}>
                <Link
                  href={`/${locale}/blog/${relatedPost.slug}`}
                  className="group block h-full rounded-card bg-white p-6 shadow-soft hover:-translate-y-1 focus-ring-light"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[var(--blc-sand-200)]">
                    <Image
                      src={relatedPost.cover_image}
                      alt={relatedPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-[var(--blc-green-900)]">
                    {relatedPost.title}
                  </h2>
                  <p className="mt-3 text-[var(--blc-green-700)]">
                    {relatedPost.excerpt}
                  </p>
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
            ))}
          </div>
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
                href={phoneHref}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-[var(--blc-green-900)] hover:bg-[var(--blc-cream-100)] focus-ring-light"
              >
                <Phone size={18} aria-hidden="true" />
                {common("cta_call")}
              </a>
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
