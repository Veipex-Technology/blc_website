import { getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/lib/erp/api";
import { getServicesForNavigationFromERP } from "@/lib/erp/services";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import type { Locale } from "@/i18n/routing";

export async function SiteShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const common = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });
  const footer = await getTranslations({ locale, namespace: "footer" });
  const services = await getTranslations({ locale, namespace: "services" });
  const settings = await getSiteSettings(locale);
  const erpServices = await getServicesForNavigationFromERP().catch(() => []);
  const headerLinks = [
    { href: `/${locale}`, label: nav("home") },
    { href: `/${locale}/about`, label: nav("about") },
    { href: `/${locale}/services`, label: nav("services") },
    { href: `/${locale}/blog`, label: nav("blog") },
    { href: `/${locale}/contact`, label: nav("contact") },
  ];
  const phoneHref = `tel:${settings.phone.replace(/[^+\d]/g, "")}`;
  const whatsappHref = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(common("whatsapp_prefill"))}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: common("brand_name"),
    url: siteUrl,
    logo: `${siteUrl}${settings.logo_url}`,
    telephone: settings.phone,
    sameAs: Object.values(settings.social).filter(Boolean),
  };
  const headerServices = erpServices.flatMap((service) => {
    const title =
      locale === "ar"
        ? service.service_name_ar || service.service_name
        : service.service_name;
    const slug =
      locale === "ar"
        ? service.ar_slug || service.en_slug
        : service.en_slug || service.ar_slug;

    return title && slug
      ? [
          {
            title,
            href: `/${locale}/services/${encodeURIComponent(slug)}`,
          },
        ]
      : [];
  });

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-[var(--blc-green-900)] px-4 py-3 text-white focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus-ring-dark"
      >
        {common("skip_to_content")}
      </a>
      <SiteHeader
        locale={locale}
        settings={settings}
        links={headerLinks}
        services={headerServices}
        labels={{
          menu: common("menu_open"),
          close: common("menu_close"),
          call: common("cta_call"),
          whatsapp: common("cta_whatsapp"),
          logoAlt: footer("logo_alt"),
          prefill: common("whatsapp_prefill"),
          navLabel: nav("label"),
          language: common("lang_switch"),
          contact: nav("contact"),
        }}
      />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter
        locale={locale}
        settings={settings}
        labels={{
          tagline: common("tagline"),
          rights: common("footer_rights"),
          privacy: common("privacy"),
          services: footer("services"),
          quickLinks: footer("quick_links"),
          contact: footer("contact"),
          follow: footer("follow"),
          logoAlt: footer("logo_alt"),
          phone: footer("phone"),
          email: footer("email"),
          address: footer("address"),
          facebook: footer("facebook"),
          instagram: footer("instagram"),
          linkedin: footer("linkedin"),
          youtube: footer("youtube"),
          tiktok: footer("tiktok"),
          x: footer("x"),
        }}
        navLabels={{
          home: nav("home"),
          about: nav("about"),
          services: nav("services"),
          blog: nav("blog"),
          contact: nav("contact"),
        }}
        services={{
          elderly_care: services("elderly_care.title"),
          home_nursing: services("home_nursing.title"),
          post_hospital: services("post_hospital.title"),
          rehabilitation: services("rehabilitation.title"),
          diagnostics: services("diagnostics.title"),
          caregiver: services("caregiver.title"),
          foot_care: services("foot_care.title"),
        }}
      />
      <div
        className="fixed bottom-4 end-4 z-30 flex flex-col gap-3"
        aria-label={common("floating_actions")}
      >
        <a
          href={whatsappHref}
          aria-label={common("cta_whatsapp")}
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-[var(--blc-green-700)] px-4 font-semibold text-white shadow-soft hover:bg-[var(--blc-green-900)] focus-ring-dark sm:min-w-0"
        >
          {common("cta_whatsapp")}
        </a>
        <a
          href={phoneHref}
          aria-label={common("cta_call")}
          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-[var(--blc-green-900)] px-4 font-semibold text-white shadow-soft hover:bg-[var(--blc-green-700)] focus-ring-dark sm:min-w-0 md:hidden"
        >
          {common("cta_call")}
        </a>
      </div>
    </div>
  );
}
