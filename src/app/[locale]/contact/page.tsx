import {
  ArrowUpRight,
  Clock3,
  HeartHandshake,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getSiteSettings } from "@/lib/erp/api";
import { getServicesFromERP } from "@/lib/erp/services";
import { getBLCContactUsInfoFromERP } from "@/lib/erp/contact-info";
import { getSocialPlatformsFromERP } from "@/lib/erp/social-platforms";

import { ContactForm } from "@/components/contact-form";
import { ContactMapLoader } from "@/components/contact-map-loader";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import { whatsappDisplayNumber, whatsappLink } from "@/lib/contact";
import { contactLocation } from "@/lib/contact-location";
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

  const joinFamily = await getTranslations({
    locale,
    namespace: "joinFamily",
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
      getServicesFromERP(),
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
  const secondPhone = contactInfo?.second_phone_number?.trim() || "";
  const whatsappNumber = whatsappDisplayNumber;
  const email = contactInfo?.email?.trim() || "";
  const address = contactInfo?.address?.trim() || "";
  const configuredRecruitmentEmail = process.env.RECRUITMENT_EMAIL?.trim();
  const recruitmentEmail =
    configuredRecruitmentEmail || email || "careers@better-life-care.com";
  const isRecruitmentEmailPlaceholder = !configuredRecruitmentEmail && !email;

  /*
   * Remove spaces, brackets, dashes, etc. from WhatsApp number.
   *
   * Example:
   * +20 100 123 4567
   * becomes:
   * +201001234567
   */
  const phoneHref = phone ? `tel:${phone.replace(/[^+\d]/g, "")}` : "#";

  const whatsappHref = whatsappLink(common("whatsapp_prefill"));

  /*
   * Select service from URL:
   *
   * /contact?service=some-service
   */
  // Select the service requested in the URL.
  // Supports ERP document names and both localized slugs.
  const initialService = services.find(
    (service) =>
      service.name === query.service ||
      service.en_slug === query.service ||
      service.ar_slug === query.service,
  )?.name;

  // Prepare the actual Services BLC records for ContactForm.
  const serviceOptions = services.map((service) => ({
    name: service.name,
    service_name: service.service_name,
    service_name_ar: service.service_name_ar,
    en_slug: service.en_slug,
    ar_slug: service.ar_slug,
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
      <Section variant="cream" dir={locale === "ar" ? "rtl" : "ltr"}>
        <Container>
          <div className="relative grid items-center gap-10 overflow-hidden rounded-card border border-[var(--blc-sand-200)] bg-white p-6 shadow-soft sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:p-12">
            <div
              className="pointer-events-none absolute -end-20 -top-24 size-64 rounded-full border-[28px] border-[var(--blc-gold-300)]/20"
              aria-hidden="true"
            />

            <Reveal className="relative z-10 max-w-xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--blc-gold-500)]/40 bg-[var(--blc-cream-100)] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--blc-gold-500)]">
                <MapPin size={17} aria-hidden="true" />
                {common("brand_name")}
              </p>
              <SectionHeading
                title={t("title")}
                subtitle={t("intro")}
                className="max-w-xl"
              />
            </Reveal>

            <Reveal className="relative z-10 mx-auto w-full max-w-xl lg:max-w-none">
              <div
                className="absolute -inset-4 rounded-[1.5rem] border border-[var(--blc-gold-300)]/50"
                aria-hidden="true"
              />
              <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-[var(--blc-sand-200)] bg-[var(--blc-green-900)] shadow-[0_18px_50px_rgb(2_56_48_/_0.16)]">
                <ContactMapLoader
                  address={contactLocation.address}
                  latitude={contactLocation.latitude}
                  longitude={contactLocation.longitude}
                  coordinatesConfirmed={contactLocation.coordinatesConfirmed}
                  mapLabel={t("map")}
                  coordinatesPendingLabel={t("map_coordinates_pending")}
                />
                <div className="absolute bottom-5 start-5 flex items-center gap-3 rounded-card border border-white/30 bg-[var(--blc-green-900)]/85 px-4 py-3 text-white shadow-soft backdrop-blur-sm sm:bottom-6 sm:start-6">
                  <MapPin
                    size={20}
                    className="text-[var(--blc-gold-300)]"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">
                    {address || t("details")}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch">
            <div className="grid gap-6 lg:order-2 lg:flex lg:h-full lg:flex-col lg:gap-6">
              {/* CONTACT INFORMATION */}
              <aside className="rounded-card bg-[var(--blc-white)] p-7 shadow-soft">
                <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
                  {t("details")}
                </h2>

                <div className="mt-7 grid gap-5 text-[var(--blc-green-700)]">
                  {/* PHONE */}
                  {(phone || secondPhone) && (
                    <div className="flex items-start gap-3">
                      <Phone
                        size={20}
                        className="mt-1 shrink-0 text-[var(--blc-gold-500)]"
                        aria-hidden="true"
                      />

                      <span>
                        <strong className="block text-[var(--blc-green-900)]">
                          {t("phone")}
                        </strong>

                        {phone && (
                          <a
                            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                            className="block hover:text-[var(--blc-green-900)] focus-ring-light"
                          >
                            {phone}
                          </a>
                        )}

                        {secondPhone && (
                          <a
                            href={`tel:${secondPhone.replace(/[^\d+]/g, "")}`}
                            className="mt-1 block hover:text-[var(--blc-green-900)] focus-ring-light"
                          >
                            {secondPhone}
                          </a>
                        )}
                      </span>
                    </div>
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
                              className="h-7 w-7 object-contain"
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

              {/* JOIN OUR FAMILY */}
              <section className="rounded-card bg-[var(--blc-white)] p-7 shadow-soft lg:h-full lg:flex-1">
                <Reveal>
                  <div className="relative overflow-hidden">
                    <div
                      className="pointer-events-none absolute -end-8 -top-8 text-[var(--blc-gold-500)]/10"
                      aria-hidden="true"
                    >
                      <HeartHandshake size={140} strokeWidth={1} />
                    </div>

                    <div className="relative">
                      <HeartHandshake
                        size={30}
                        className="text-[var(--blc-gold-500)]"
                        aria-hidden="true"
                      />
                      <SectionHeading
                        title={joinFamily("title")}
                        subtitle={joinFamily("subtitle")}
                        className="mt-4"
                      />

                      <div className="mt-6 text-[var(--blc-green-700)]">
                        <p className="leading-8">{joinFamily("description")}</p>
                        <p className="mt-5 font-semibold text-[var(--blc-green-900)]">
                          {joinFamily("cta")}
                        </p>
                        <div className="mt-6 border-s-4 border-[var(--blc-gold-500)] ps-4">
                          <span className="block text-sm font-semibold text-[var(--blc-green-900)]">
                            {joinFamily("emailLabel")}
                          </span>
                          <a
                            href={`mailto:${recruitmentEmail}`}
                            className="mt-1 inline-block break-all text-lg font-semibold text-[var(--blc-green-900)] underline decoration-[var(--blc-gold-500)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--blc-gold-500)] focus-ring-light"
                          >
                            {recruitmentEmail}
                          </a>
                          {isRecruitmentEmailPlaceholder && (
                            <p className="mt-2 text-sm text-[var(--blc-green-700)]">
                              {joinFamily("emailPlaceholderNote")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </section>
            </div>

            {/* CONTACT FORM */}
            <section className="rounded-card border border-[var(--blc-sand-200)] bg-white p-7 shadow-soft lg:order-1 lg:h-full">
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

      {settings.map_embed_url && (
        <Section variant="sand" dir={locale === "ar" ? "rtl" : "ltr"}>
          <Container>
            <Reveal>
              <SectionHeading
                eyebrow={common("brand_name")}
                title={t("map")}
                subtitle={address || t("intro")}
                className="mx-auto text-center"
              />
            </Reveal>

            <div className="mt-10 grid gap-7 lg:grid-cols-[1.35fr_0.65fr] lg:items-stretch">
              <Reveal className="h-full">
                <div className="h-full overflow-hidden rounded-card border border-[var(--blc-sand-200)] bg-white p-2 shadow-soft sm:p-3">
                  <iframe
                    title={t("map")}
                    src={settings.map_embed_url}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-[360px] w-full rounded-card border-0 sm:h-[460px]"
                  />
                </div>
              </Reveal>

              <Reveal className="h-full">
                <aside className="flex h-full flex-col rounded-card border border-[var(--blc-sand-200)] bg-white p-7 shadow-soft sm:p-9">
                  <MapPin
                    size={28}
                    className="text-[var(--blc-gold-500)]"
                    aria-hidden="true"
                  />
                  <h2 className="mt-5 text-2xl font-bold text-[var(--blc-green-900)]">
                    {t("details")}
                  </h2>

                  <div className="mt-6 grid gap-5 text-[var(--blc-green-700)]">
                    {address && (
                      <p>
                        <strong className="block text-[var(--blc-green-900)]">
                          {t("address")}
                        </strong>
                        {address}
                      </p>
                    )}
                    {phone && (
                      <a
                        href={phoneHref}
                        className="block hover:text-[var(--blc-green-900)] focus-ring-light"
                      >
                        <strong className="block text-[var(--blc-green-900)]">
                          {t("phone")}
                        </strong>
                        {phone}
                      </a>
                    )}
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="block break-words hover:text-[var(--blc-green-900)] focus-ring-light"
                      >
                        <strong className="block text-[var(--blc-green-900)]">
                          {t("email")}
                        </strong>
                        {email}
                      </a>
                    )}
                  </div>

                  <a
                    href={settings.map_embed_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--blc-green-900)] px-5 font-semibold text-white hover:bg-[var(--blc-green-700)] focus-ring-dark"
                  >
                    {t("map")}
                    <ArrowUpRight
                      size={17}
                      aria-hidden="true"
                      className="rtl:rotate-180"
                    />
                  </a>
                </aside>
              </Reveal>
            </div>
          </Container>
        </Section>
      )}
    </main>
  );
}
