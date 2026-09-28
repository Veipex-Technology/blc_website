import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function createPageMetadata({
  locale,
  path = "",
  title,
  description,
  image,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const normalizedPath = path ? `/${path.replace(/^\//, "")}` : "";
  const canonical = `${siteUrl}/${locale}${normalizedPath}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ar: `${siteUrl}/ar${normalizedPath}`,
        en: `${siteUrl}/en${normalizedPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Better Life Care",
      locale: locale === "ar" ? "ar_EG" : "en_EG",
      type: "website",
      images: [
        {
          url: image ?? "/og-default.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image ?? "/og-default.png"],
    },
  };
}
