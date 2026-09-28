import type { MetadataRoute } from "next";
import { getPosts, getServices } from "@/lib/erp/api";
import type { Locale } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const locales: Locale[] = ["ar", "en"];
const staticPaths = [
  "",
  "about",
  "services",
  "blog",
  "contact",
  "privacy-policy",
];

async function allPosts(locale: Locale) {
  const first = await getPosts({ lang: locale, page: 1 });
  const pageCount = Math.max(1, Math.ceil(first.total / 9));
  const pages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      getPosts({ lang: locale, page: index + 2 }),
    ),
  );
  return [...first.posts, ...pages.flatMap((page) => page.posts)];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getServices("en");
  const entries: MetadataRoute.Sitemap = [];
  for (const path of staticPaths) {
    for (const locale of locales) {
      const localizedPath = `/${locale}${path ? `/${path}` : ""}`;
      entries.push({
        url: `${siteUrl}${localizedPath}`,
        alternates: {
          languages: {
            ar: `${siteUrl}/ar${path ? `/${path}` : ""}`,
            en: `${siteUrl}/en${path ? `/${path}` : ""}`,
          },
        },
        changeFrequency: "weekly",
      });
    }
  }
  for (const service of services) {
    for (const locale of locales)
      entries.push({
        url: `${siteUrl}/${locale}/services/${service.slug}`,
        alternates: {
          languages: {
            ar: `${siteUrl}/ar/services/${service.slug}`,
            en: `${siteUrl}/en/services/${service.slug}`,
          },
        },
        changeFrequency: "monthly",
      });
  }
  for (const locale of locales) {
    const posts = await allPosts(locale);
    for (const post of posts)
      entries.push({
        url: `${siteUrl}/${locale}/blog/${post.slug}`,
        alternates: {
          languages: {
            ar: `${siteUrl}/ar/blog/${post.slug}`,
            en: `${siteUrl}/en/blog/${post.slug}`,
          },
        },
        lastModified: post.published_on,
        changeFrequency: "monthly",
      });
  }
  return entries;
}
