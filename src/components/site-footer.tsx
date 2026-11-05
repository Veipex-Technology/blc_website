import Image from "next/image";
import Link from "next/link";
import { Link2, Phone } from "lucide-react";

import type { Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/lib/erp/types";
import { getServicesFromERP } from "@/lib/erp/services";
import { getBLCContactUsInfoFromERP } from "@/lib/erp/contact-info";
import { getSocialPlatformsFromERP } from "@/lib/erp/social-platforms";
import { landline } from "@/lib/contact";

export async function SiteFooter({
  locale,
  settings,
  labels,
  navLabels,
}: {
  locale: Locale;
  settings: SiteSettings;
  labels: {
    brandName: string;
    description: string;
    rights: string;
    privacy: string;
    services: string;
    quickLinks: string;
    joinFamily: string;
    contact: string;
    follow: string;
    logoAlt: string;
    phone: string;
    landline: string;
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
}) {
  /*
   * Load dynamic footer data directly from ERP.
   */
  const [erpServices, contactInfoRecords, socialPlatforms] = await Promise.all([
    getServicesFromERP(),
    getBLCContactUsInfoFromERP(),
    getSocialPlatformsFromERP(),
  ]);

  /*
   * BLC-Contact-us Info
   * Uses the first ERP record.
   */
  const contactInfo = contactInfoRecords[0];

  const isArabic = locale === "ar";

  /*
   * Contact information.
   *
   * English:
   *   address
   *
   * Arabic:
   *   ar_address
   *
   * If the Arabic address is empty, fall back to English.
   */
  const phone = contactInfo?.phone_number?.trim() || "";
  const email = contactInfo?.email?.trim() || "";

  const arabicAddress = contactInfo?.ar_address?.trim() || "";
  const englishAddress = contactInfo?.address?.trim() || "";

  const address = isArabic
    ? arabicAddress || englishAddress
    : englishAddress || arabicAddress;

  /*
   * Social links loaded dynamically from ERP.
   */
  const socialLinks = socialPlatforms
    .map((social) => ({
      name: social.name,
      platformName: social.platform_name?.trim() || "",
      href: social.platform_url?.trim() || "",
      icon: social.platform_icon?.trim() || "",
    }))
    .filter((social) => Boolean(social.platformName) && Boolean(social.href));

  /*
   * Quick navigation links.
   */
  const quickLinks = [
    {
      href: `/${locale}`,
      label: navLabels.home,
    },
    {
      href: `/${locale}/about`,
      label: navLabels.about,
    },
    {
      href: `/${locale}/services`,
      label: navLabels.services,
    },
    {
      href: `/${locale}/blog`,
      label: navLabels.blog,
    },
    {
      href: `/${locale}/contact`,
      label: navLabels.contact,
    },
  ];

  return (
    <footer
      className="bg-[var(--blc-green-900)] px-5 py-12 text-white lg:px-8"
      role="contentinfo"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="inline-flex rounded-xl bg-white p-1 md:p-1.5">
            <Image
              src={settings.logo_url}
              alt={labels.logoAlt}
              width={156}
              height={52}
              sizes="(max-width: 767px) 64px, 80px"
              loading="lazy"
              className="h-auto w-[64px] max-w-full object-contain md:w-[80px]"
            />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-white">
            {labels.brandName}
          </h2>

          <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--blc-cream-100)]">
            {labels.description}
          </p>

          {/* Dynamic ERP Social Platforms */}
          {socialLinks.length > 0 && (
            <div
              className="mt-5 flex flex-wrap gap-3"
              aria-label={labels.follow}
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.platformName}
                  title={social.platformName}
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/30 text-white hover:border-[var(--blc-gold-300)] hover:text-[var(--blc-gold-300)] focus-ring-dark"
                >
                  {social.icon ? (
                    <img
                      src={social.icon}
                      alt={social.platformName}
                      className="h-7 w-7 object-contain"
                    />
                  ) : (
                    <Link2 size={18} aria-hidden="true" />
                  )}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic ERP Services */}
        <div>
          <h2 className="font-semibold text-[var(--blc-gold-300)]">
            {labels.services}
          </h2>

          <ul className="mt-4 grid gap-2 text-sm text-[var(--blc-cream-100)]">
            {erpServices.map((service) => {
              const serviceName = isArabic
                ? service.service_name_ar || service.service_name
                : service.service_name;

              const serviceSlug = isArabic
                ? service.ar_slug || service.en_slug
                : service.en_slug || service.ar_slug;

              if (!serviceName) {
                return null;
              }

              const href = serviceSlug
                ? `/${locale}/services/${encodeURIComponent(serviceSlug)}`
                : `/${locale}/services`;

              return (
                <li key={service.name}>
                  <Link
                    href={href}
                    className="hover:text-white focus-ring-dark"
                  >
                    {serviceName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Links */}
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
                className="transition-colors hover:text-[var(--blc-gold-300)] focus-ring-dark"
              >
                {labels.privacy}
              </Link>
            </li>

            <li>
              <Link
                href={`/${locale}/contact`}
                className="transition-colors hover:text-[var(--blc-gold-300)] focus-ring-dark"
              >
                {labels.joinFamily}
              </Link>
            </li>
          </ul>
        </div>

        {/* Dynamic Contact Information */}
        <div>
          <h2 className="font-semibold text-[var(--blc-gold-300)]">
            {labels.contact}
          </h2>

          <address className="mt-4 grid gap-2 text-sm not-italic text-[var(--blc-cream-100)]">
            {/* Phone */}
            {phone && (
              <span>
                {labels.phone}: <bdi dir="auto">{phone}</bdi>
              </span>
            )}

            <a
              href={landline.href}
              aria-label={`${labels.landline}: ${landline.display}`}
              className="inline-flex min-h-11 items-center gap-2 hover:text-white focus-ring-dark"
            >
              <Phone size={16} aria-hidden="true" />
              <span>
                {labels.landline}:{" "}
                <span dir="ltr" className="[unicode-bidi:isolate]">
                  {landline.display}
                </span>
              </span>
            </a>

            {/* Email */}
            {email && (
              <a
                href={`mailto:${email}`}
                className="break-all hover:text-white focus-ring-dark"
              >
                {labels.email}: <bdi dir="ltr">{email}</bdi>
              </a>
            )}

            {/* Localized Address */}
            {address && (
              <p className="break-words leading-relaxed">
                {labels.address}: <bdi dir="auto">{address}</bdi>
              </p>
            )}
          </address>
        </div>
      </div>

      {/* Copyright */}
      <p className="mx-auto mt-10 max-w-7xl border-t border-white/20 pt-5 text-sm text-[var(--blc-cream-100)]">
        {labels.rights}
      </p>
    </footer>
  );
}
