import { ClipboardList, HeartPulse, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/reveal";

const howItWorksSteps = [
  {
    icon: Phone,
    titleKey: "how_step_1_title",
    descriptionKey: "how_step_1_description",
  },
  {
    icon: ClipboardList,
    titleKey: "how_step_2_title",
    descriptionKey: "how_step_2_description",
  },
  {
    icon: HeartPulse,
    titleKey: "how_step_3_title",
    descriptionKey: "how_step_3_description",
  },
] as const;

export async function HowItWorksSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <section className="bg-[var(--blc-cream-100)] py-12 lg:py-16">
      <Container>
        <div className="mb-16 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-4xl">
              {t("how_title")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-[var(--blc-green-700)]">
              {t("how_subtitle")}
            </p>
          </Reveal>
        </div>
        <div className="relative">
          <Reveal className="pointer-events-none absolute start-0 top-1/2 hidden h-1 w-full -translate-y-1/2 md:block">
            <span
              className="block h-full w-full bg-[var(--blc-green-700)]/20"
              aria-hidden="true"
            />
          </Reveal>
          <div className="grid gap-12 md:grid-cols-3">
            {howItWorksSteps.map(
              ({ icon: Icon, titleKey, descriptionKey }, index) => (
                <Reveal key={titleKey} delay={index * 150}>
                  <article className="relative text-center">
                    <div className="relative z-10 mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--blc-green-700)] text-white shadow-lg ring-8 ring-white transition duration-300 hover:scale-105 hover:shadow-xl motion-reduce:transition-none">
                      <Icon
                        className="h-10 w-10"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span className="absolute -end-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--blc-gold-500)] text-xs font-bold text-white">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="mb-2 mt-6 text-xl font-bold text-[var(--blc-green-900)]">
                      {t(titleKey)}
                    </h3>
                    <p className="text-[var(--blc-green-700)] leading-relaxed">
                      {t(descriptionKey)}
                    </p>
                  </article>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
