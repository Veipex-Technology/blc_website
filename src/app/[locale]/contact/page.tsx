import {
  Clock3,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getServices, getSiteSettings } from "@/lib/erp/api";
import { getBLCContactUsInfoFromERP } from "@/lib/erp/contact-info";
import { getSocialPlatformsFromERP } from "@/lib/erp/social-platforms";

import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "contact",
  });

  return createPageMetadata({
    locale,
    path: "contact",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;

  const t = await getTranslations({
    locale,
    namespace: "contact",
  });

  const common = await getTranslations({
    locale,
    namespace: "common",
  });

  const footer = await getTranslations({
    locale,
    namespace: "footer",
  });

  /*
   * Load all dynamic data from ERP.
   *
   * BLC-Contact-us Info:
   * - phone_number
   * - whats_app_number
   * - email
   * - address
   * - timetable
   *
   * Services:
   * - Used by ContactForm
   *
   * Site Settings:
   * - Social links
   * - Map
   */
  const [contactInfoRecords, services, settings, socialPlatforms] =
    await Promise.all([
      getBLCContactUsInfoFromERP(),
      getServices(locale),
      getSiteSettings(locale),
      getSocialPlatformsFromERP(),
    ]);

  /*
   * BLC-Contact-us Info normally contains the contact information.
   *
   * If there are multiple records, the first record is used.
   */
  const contactInfo = contactInfoRecords[0];

  const phone = contactInfo?.phone_number?.trim() || "";
  const whatsappNumber = contactInfo?.whats_app_number?.trim() || "";
  const email = contactInfo?.email?.trim() || "";
  const address = contactInfo?.address?.trim() || "";

  /*
   * Remove spaces, brackets, dashes, etc. from WhatsApp number.
   *
   * Example:
   * +20 100 123 4567
   * becomes:
   * +201001234567
   */
  const whatsappCleanNumber = whatsappNumber.replace(/[^\d]/g, "");

  const phoneHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : "#";

  const whatsappHref = whatsappCleanNumber
    ? `https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(
        common("whatsapp_prefill"),
      )}`
    : "#";

  /*
   * Select service from URL:
   *
   * /contact?service=some-service
   */
  const initialService = services.some(
    (service) => service.slug === query.service,
  )
    ? query.service
    : undefined;

  /*
   * Dynamic services for ContactForm.
   */
  const serviceOptions = services
    .filter((service) => service.published)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((service) => ({
      slug: service.slug,
      title: service.title,
    }));

  /*
   * Social links can continue coming from Website Info /
   * Site Settings.
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
   * Dynamic timetable from BLC-Contact-us Info.
   */
  const timetable = contactInfo?.timetable ?? [];

  return (
    <main>
      <Section>
        <Container>
          <SectionHeading title={t("title")} subtitle={t("intro")} />

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
            {/* CONTACT INFORMATION */}
            <aside className="rounded-card bg-[var(--blc-cream-100)] p-7 shadow-soft">
              <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
                {t("details")}
              </h2>

              <div className="mt-7 grid gap-5 text-[var(--blc-green-700)]">
                {/* PHONE */}
                {phone && (
                  <a
                    href={phoneHref}
                    className="flex items-start gap-3 hover:text-[var(--blc-green-900)] focus-ring-light"
                  >
                    <Phone
                      size={20}
                      className="mt-1 shrink-0 text-[var(--blc-gold-500)]"
                      aria-hidden="true"
                    />

                    <span>
                      <strong className="block text-[var(--blc-green-900)]">
                        {t("phone")}
                      </strong>

                      {phone}
                    </span>
                  </a>
                )}

                {/* WHATSAPP */}
                {whatsappNumber && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 hover:text-[var(--blc-green-900)] focus-ring-light"
                  >
                    <MessageCircle
                      size={20}
                      className="mt-1 shrink-0 text-[var(--blc-gold-500)]"
                      aria-hidden="true"
                    />

                    <span>
                      <strong className="block text-[var(--blc-green-900)]">
                        {t("whatsapp")}
                      </strong>

                      {whatsappNumber}
                    </span>
                  </a>
                )}

                {/* EMAIL */}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-3 hover:text-[var(--blc-green-900)] focus-ring-light"
                  >
                    <Mail
                      size={20}
                      className="mt-1 shrink-0 text-[var(--blc-gold-500)]"
                      aria-hidden="true"
                    />

                    <span>
                      <strong className="block text-[var(--blc-green-900)]">
                        {t("email")}
                      </strong>

                      {email}
                    </span>
                  </a>
                )}

                {/* ADDRESS */}
                {address && (
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={20}
                      className="mt-1 shrink-0 text-[var(--blc-gold-500)]"
                      aria-hidden="true"
                    />

                    <span>
                      <strong className="block text-[var(--blc-green-900)]">
                        {t("address")}
                      </strong>

                      {address}
                    </span>
                  </div>
                )}
              </div>

              {/* DYNAMIC TIMETABLE */}
              {timetable.length > 0 && (
                <div className="mt-8 border-t border-[var(--blc-sand-200)] pt-6">
                  <div className="flex items-start gap-3">
                    <Clock3
                      size={20}
                      className="mt-1 shrink-0 text-[var(--blc-gold-500)]"
                      aria-hidden="true"
                    />

                    <div className="w-full">
                      <h3 className="font-semibold text-[var(--blc-green-900)]">
                        {t("working_hours")}
                      </h3>

                      <div className="mt-3 grid gap-2">
                        {timetable.map((item) => (
                          <div
                            key={item.name}
                            className="flex items-center justify-between gap-4 text-sm text-[var(--blc-green-700)]"
                          >
                            <span>{item.day || item.name}</span>

                            <span className="font-medium text-[var(--blc-green-900)]">
                              {item.start_time && item.end_time
                                ? `${item.start_time} - ${item.end_time}`
                                : item.start_time || item.end_time || ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SOCIAL LINKS */}
              {socialLinks.length > 0 && (
                <div className="mt-8 border-t border-[var(--blc-sand-200)] pt-6">
                  <h3 className="font-semibold text-[var(--blc-green-900)]">
                    {t("social")}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.platformName}
                        title={social.platformName}
                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-[var(--blc-green-700)] text-[var(--blc-green-900)] hover:border-[var(--blc-gold-500)] focus-ring-light"
                      >
                        {social.icon ? (
                          <img
                            src={social.icon}
                            alt={social.platformName}
                            className="h-5 w-5 object-contain"
                          />
                        ) : (
                          <Link2 size={18} aria-hidden="true" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {/* MAP */}
              {settings.map_embed_url && (
                <div className="mt-8">
                  <h3 className="mb-3 font-semibold text-[var(--blc-green-900)]">
                    {t("map")}
                  </h3>

                  <iframe
                    title={t("map")}
                    src={settings.map_embed_url}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-56 w-full rounded-xl border-0"
                  />
                </div>
              )}
            </aside>

            {/* CONTACT FORM */}
            <section className="rounded-card border border-[var(--blc-sand-200)] bg-white p-7 shadow-soft">
              <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
                {t("form_title")}
              </h2>

              <div className="mt-7">
                <ContactForm
                  locale={locale}
                  initialService={initialService}
                  services={serviceOptions}
                />
              </div>
            </section>
          </div>
        </Container>
      </Section>
    </main>
  );
}
