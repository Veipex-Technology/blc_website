import { Clock3, HeartHandshake, ShieldCheck, Stethoscope } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { MotionCard } from "@/components/motion/motion-card";
import { MotionSection } from "@/components/motion/motion-section";

type TrustBadgeKey =
  | "trust_german_standards"
  | "trust_certified_nursing"
  | "trust_24_7_support"
  | "trust_personalized_care";

const trustBadges: {
  id: string;
  icon: LucideIcon;
  labelKey: TrustBadgeKey;
}[] = [
  {
    id: "german-standards",
    icon: ShieldCheck,
    labelKey: "trust_german_standards",
  },
  {
    id: "certified-nursing",
    icon: Stethoscope,
    labelKey: "trust_certified_nursing",
  },
  { id: "24-7-support", icon: Clock3, labelKey: "trust_24_7_support" },
  {
    id: "personalized-care",
    icon: HeartHandshake,
    labelKey: "trust_personalized_care",
  },
];

export async function TrustBadgesSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <section className="border-t border-[var(--blc-green-700)]/10 bg-white py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionSection
          variant="stagger"
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {trustBadges.map(({ id, icon: Icon, labelKey }) => (
            <MotionCard
              key={id}
              withHoverShadow={false}
              className="group flex items-center justify-center gap-3 text-center transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none"
            >
              <div className="relative flex flex-col items-center gap-3">
                <span
                  aria-hidden="true"
                  className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[var(--blc-green-700)] bg-[var(--blc-cream-100)] text-[var(--blc-green-700)] transition-colors duration-300 group-hover:bg-[var(--blc-green-700)] group-hover:text-white motion-reduce:transition-none lg:h-20 lg:w-20"
                >
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full border border-[var(--blc-green-700)] motion-safe:animate-[ping_1s_ease-out_1] motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  <Icon
                    className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>
                <span className="text-sm font-semibold leading-snug text-[var(--blc-green-900)] transition-colors duration-300 group-hover:text-[var(--blc-green-700)]">
                  {t(labelKey)}
                </span>
              </div>
            </MotionCard>
          ))}
        </MotionSection>
      </div>
    </section>
  );
}
