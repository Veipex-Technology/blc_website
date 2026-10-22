import type { Metadata } from "next";
import { headers } from "next/headers";
import { Fira_Sans, Noto_Sans_Arabic } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "../styles/globals.css";

const arabicFont = Noto_Sans_Arabic({
  variable: "--font-arabic-sans",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const englishFont = Fira_Sans({
  variable: "--font-fira-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["Arial"],
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: "Better Life Care",
  description:
    "Trusted home and senior care in Alexandria, guided by German standards.",
  openGraph: {
    title: "Better Life Care",
    description:
      "Trusted home and senior care in Alexandria, guided by German standards.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Better Life Care",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Better Life Care",
    description:
      "Trusted home and senior care in Alexandria, guided by German standards.",
    images: ["/og-default.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = (await headers()).get("x-blc-locale") === "en" ? "en" : "ar";

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${arabicFont.variable} ${englishFont.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
