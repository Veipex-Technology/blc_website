"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { Container } from "@/components/ui/container";
import {
  ServiceCard,
  type ServiceCardData,
} from "@/components/sections/ServiceCard";
import type { Service } from "@/lib/erp/services";
import type { Locale } from "@/i18n/routing";

const easing = [0.22, 1, 0.36, 1] as const;

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easing },
  },
};

function toPlainText(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function Services({
  services,
  locale,
}: {
  services: Service[];
  locale: Locale;
}) {
  const t = useTranslations("home");
  const shouldReduceMotion = useReducedMotion();
  const isRtl = locale === "ar";
  const serviceItems: ServiceCardData[] = services.flatMap((service, index) => {
    const title = isRtl
      ? service.service_name_ar || service.service_name
      : service.service_name;
    const description = isRtl
      ? service.ar_service_description || service.service_sub_title
      : service.service_description || service.service_sub_title;
    const slug = isRtl
      ? service.ar_slug || service.en_slug
      : service.en_slug || service.ar_slug;
    const icon = isRtl
      ? service.image_ar || service.image_en
      : service.image_en || service.image_ar;
    const plainDescription = description ? toPlainText(description) : "";

    if (!title || !slug) {
      return [];
    }

    return [
      {
        number: String(index + 1).padStart(2, "0"),
        icon: icon || "/brand/logo.png",
        title,
        description: plainDescription || title,
        href: `/${locale}/services/${encodeURIComponent(slug)}`,
      },
    ];
  });

  return (
    <section
      aria-labelledby="services-showcase-title"
      className="relative isolate overflow-hidden bg-[var(--blc-cream-100)] py-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-32 top-20 size-96 rounded-full bg-[var(--blc-gold-300)]/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -start-24 size-[30rem] rounded-full border-[34px] border-[var(--blc-green-900)]/[0.05]"
      />

      <Container className="relative">
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
          className="max-w-3xl text-start"
        >
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--blc-gold-500)]">
            <span className="h-px w-9 bg-[var(--blc-gold-500)]" />
            {t("services_showcase_eyebrow")}
          </p>
          <h2
            id="services-showcase-title"
            className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-5xl"
          >
            {t("services_showcase_title")}
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--blc-green-700)]">
            {t("services_showcase_subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={gridVariants}
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {serviceItems.map((service) => (
            <ServiceCard
              key={service.number}
              service={service}
              label={t("services_showcase_label")}
              title={service.title}
              description={service.description}
              href={service.href}
              isRtl={isRtl}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
