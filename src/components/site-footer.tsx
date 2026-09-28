import Image from "next/image";
import Link from "next/link";
import { Link2 } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/erp/types";

const serviceKeys = [
  "elderly_care",
  "home_nursing",
  "post_hospital",
  "rehabilitation",
  "diagnostics",
  "caregiver",
  "foot_care",
] as const;
const socialConfig = [
  { key: "facebook", labelKey: "facebook" },
  { key: "instagram", labelKey: "instagram" },
  { key: "linkedin", labelKey: "linkedin" },
  { key: "youtube", labelKey: "youtube" },
  { key: "tiktok", labelKey: "tiktok" },
  { key: "x", labelKey: "x" },
] as const;

export function SiteFooter({
  locale,
  settings,
  labels,
  navLabels,
  services,
}: {
  locale: Locale;
  settings: SiteSettings;
  labels: {
    tagline: string;
    rights: string;
    privacy: string;
    services: string;
    quickLinks: string;
    contact: string;
    follow: string;
    logoAlt: string;
    phone: string;
    email: string;
    address: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
    x: string;
  };
  navLabels: {
    home: string;
    about: string;
    services: string;
    blog: string;
    contact: string;
  };
  services: Record<(typeof serviceKeys)[number], string>;
}) {
  const socialLinks = socialConfig
    .map((social) => ({ ...social, href: settings.social[social.key] }))
    .filter((social): social is typeof social & { href: string } =>
      Boolean(social.href),
    );
  const quickLinks = [
    { href: `/${locale}`, label: navLabels.home },
    { href: `/${locale}/about`, label: navLabels.about },
    { href: `/${locale}/services`, label: navLabels.services },
    { href: `/${locale}/blog`, label: navLabels.blog },
    { href: `/${locale}/contact`, label: navLabels.contact },
  ];
  return (
    <footer
      className="bg-[var(--blc-green-900)] px-5 py-12 text-white lg:px-8"
      role="contentinfo"
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex rounded-xl bg-white p-2">
            <Image
              src={settings.logo_url}
              alt={labels.logoAlt}
              width={156}
              height={52}
              className="h-12 w-auto object-contain"
            />
          </div>
          <p className="mt-4 max-w-xs text-sm text-[var(--blc-cream-100)]">
            {labels.tagline}
          </p>
          <div className="mt-5 flex flex-wrap gap-3" aria-label={labels.follow}>
            {socialLinks.map(({ key, labelKey, href }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={labels[labelKey as keyof typeof labels] as string}
                className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/30 text-white hover:border-[var(--blc-gold-300)] hover:text-[var(--blc-gold-300)] focus-ring-dark"
              >
                <Link2 size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-[var(--blc-gold-300)]">
            {labels.services}
          </h2>
          <ul className="mt-4 grid gap-2 text-sm text-[var(--blc-cream-100)]">
            {serviceKeys.map((key) => (
              <li key={key}>
                <Link
                  href={`/${locale}/services`}
                  className="hover:text-white focus-ring-dark"
                >
                  {services[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-[var(--blc-gold-300)]">
            {labels.quickLinks}
          </h2>
          <ul className="mt-4 grid gap-2 text-sm text-[var(--blc-cream-100)]">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-white focus-ring-dark"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/${locale}/privacy-policy`}
                className="hover:text-white focus-ring-dark"
              >
                {labels.privacy}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-[var(--blc-gold-300)]">
            {labels.contact}
          </h2>
          <address className="mt-4 grid gap-2 text-sm not-italic text-[var(--blc-cream-100)]">
            <a
              href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
              className="hover:text-white focus-ring-dark"
            >
              {labels.phone}: {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="break-all hover:text-white focus-ring-dark"
            >
              {labels.email}: {settings.email}
            </a>
            <span>
              {labels.address}: {settings.address}
            </span>
          </address>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl border-t border-white/20 pt-5 text-sm text-[var(--blc-cream-100)]">
        {labels.rights}
      </p>
    </footer>
  );
}
