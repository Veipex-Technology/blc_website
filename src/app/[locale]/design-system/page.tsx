import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "designSystem" });
  return createPageMetadata({
    locale,
    path: "design-system",
    title: t("title"),
    description: t("subtitle"),
  });
}

async function Preview({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "designSystem" });
  const items = [
    { question: t("question_1"), answer: t("answer_1") },
    { question: t("question_2"), answer: t("answer_2") },
  ];

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="border-t border-[var(--blc-sand-200)] pt-12"
    >
      <SectionHeading
        eyebrow={locale.toUpperCase()}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="mt-10 grid gap-10">
        <div>
          <h3 className="mb-4 text-xl font-bold text-[var(--blc-green-900)]">
            {t("buttons")}
          </h3>
          <div className="flex flex-wrap gap-3">
            <Button>{t("primary")}</Button>
            <Button variant="secondary">{t("secondary")}</Button>
            <Button variant="ghost">{t("ghost")}</Button>
            <Button variant="whatsapp">{t("whatsapp")}</Button>
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xl font-bold text-[var(--blc-green-900)]">
            {t("sections")}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["white", "cream", "sand", "dark"] as const).map((variant) => (
              <Section
                key={variant}
                variant={variant}
                className="rounded-card p-5"
              >
                <p
                  className={
                    variant === "dark"
                      ? "text-white"
                      : "text-[var(--blc-green-900)]"
                  }
                >
                  {t(variant)}
                </p>
              </Section>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xl font-bold text-[var(--blc-green-900)]">
            {t("components")}
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <h4 className="text-xl font-bold text-[var(--blc-green-900)]">
                {t("card_title")}
              </h4>
              <p className="mt-2 text-[var(--blc-green-700)]">
                {t("card_text")}
              </p>
              <Badge className="mt-5">{t("badge")}</Badge>
            </Card>
            <div>
              <h4 className="mb-3 text-lg font-bold text-[var(--blc-green-900)]">
                {t("accordion")}
              </h4>
              <Accordion items={items} />
            </div>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 font-semibold text-[var(--blc-green-900)]">
            {t("name")}
            <Input placeholder={t("name_placeholder")} />
          </label>
          <label className="grid gap-2 font-semibold text-[var(--blc-green-900)]">
            {t("message")}
            <Textarea placeholder={t("message_placeholder")} />
          </label>
          <label className="grid gap-2 font-semibold text-[var(--blc-green-900)]">
            {t("service")}
            <Select defaultValue="one">
              <option value="one">{t("service_one")}</option>
              <option value="two">{t("service_two")}</option>
            </Select>
          </label>
          <Checkbox
            id={`${locale}-consent`}
            label={t("consent")}
            error={t("error")}
          />
        </div>
        <div>
          <h3 className="mb-4 text-xl font-bold text-[var(--blc-green-900)]">
            {t("loading")}
          </h3>
          <div className="grid gap-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DesignSystemPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  return (
    <main>
      <Section>
        <Container>
          <Preview locale={locale} />
          <Preview locale={otherLocale} />
        </Container>
      </Section>
    </main>
  );
}
