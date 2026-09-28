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
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

const socialConfig = [
  { key: "facebook", label: "facebook" },
  { key: "instagram", label: "instagram" },
  { key: "linkedin", label: "linkedin" },
  { key: "youtube", label: "youtube" },
  { key: "tiktok", label: "tiktok" },
  { key: "x", label: "x" },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
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
  const t = await getTranslations({ locale, namespace: "contact" });
  const common = await getTranslations({ locale, namespace: "common" });
  const footer = await getTranslations({ locale, namespace: "footer" });
  const [settings, services] = await Promise.all([
    getSiteSettings(locale),
    getServices(locale),
  ]);
  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const whatsappHref = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(common("whatsapp_prefill"))}`;
  const initialService = services.some(
    (service) => service.slug === query.service,
  )
    ? query.service
    : undefined;
  const serviceOptions = services
    .filter((service) => service.published)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((service) => ({
      slug: service.slug,
      title: service.title,
    }));
  const socialLinks = socialConfig
    .map((social) => ({ ...social, href: settings.social[social.key] }))
    .filter((social): social is typeof social & { href: string } =>
      Boolean(social.href),
    );
  return (
    <main>
      <Section>
        <Container>
          <SectionHeading title={t("title")} subtitle={t("intro")} />
          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-start">
            <aside className="rounded-card bg-[var(--blc-cream-100)] p-7 shadow-soft">
              <h2 className="text-2xl font-bold text-[var(--blc-green-900)]">
                {t("details")}
              </h2>
              <div className="mt-7 grid gap-5 text-[var(--blc-green-700)]">
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
                    {settings.phone}
                  </span>
                </a>
                <a
                  href={whatsappHref}
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
                    {settings.whatsapp_number}
                  </span>
                </a>
                <a
                  href={`mailto:${settings.email}`}
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
                    {settings.email}
                  </span>
                </a>
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
                    {settings.address}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock3
                    size={20}
                    className="mt-1 shrink-0 text-[var(--blc-gold-500)]"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="block text-[var(--blc-green-900)]">
                      {t("working_hours")}
                    </strong>
                    {settings.working_hours}
                  </span>
                </div>
              </div>
              {socialLinks.length > 0 && (
                <div className="mt-8 border-t border-[var(--blc-sand-200)] pt-6">
                  <h3 className="font-semibold text-[var(--blc-green-900)]">
                    {t("social")}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.key}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={footer(social.label)}
                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-[var(--blc-green-700)] text-[var(--blc-green-900)] hover:border-[var(--blc-gold-500)] focus-ring-light"
                      >
                        <Link2 size={18} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
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
