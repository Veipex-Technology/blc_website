"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, HeartHandshake } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Container } from "@/components/ui/container";

type TeamMember = {
  id: "one" | "two" | "three" | "four";
  image: string;
  featured?: boolean;
  wide?: boolean;
};

const teamMembers: TeamMember[] = [
  { id: "one", image: "/images/hero-placeholder.jpg", featured: true },
  { id: "two", image: "/images/hero-placeholder.jpg" },
  { id: "three", image: "/images/hero-placeholder.jpg" },
  { id: "four", image: "/images/hero-placeholder.jpg", wide: true },
];

const easing = [0.22, 1, 0.36, 1] as const;

const headerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easing },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      delay: index * 0.12,
      ease: easing,
    },
  }),
};

export function OurTeam() {
  const t = useTranslations("home");
  const locale = useLocale();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="our-team-title"
      className="relative isolate overflow-hidden bg-[var(--blc-cream-100)] py-16 lg:py-24"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -end-32 top-24 size-96 rounded-full bg-[var(--blc-gold-300)]/20 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 18, 0], y: [0, -14, 0], scale: [1, 1.05, 1] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -start-24 size-[28rem] rounded-full border-[36px] border-[var(--blc-green-900)]/[0.06]"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, -12, 0], y: [0, 16, 0], rotate: [0, 4, 0] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <Container className="relative">
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={headerVariants}
          className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl text-start">
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--blc-gold-500)]">
              <span className="h-px w-9 bg-[var(--blc-gold-500)]" />
              {t("team_eyebrow")}
            </p>
            <h2
              id="our-team-title"
              className="mt-5 max-w-2xl text-4xl font-bold leading-tight text-[var(--blc-green-900)] sm:text-5xl"
            >
              {t("team_title_before")}{" "}
              <span className="text-[var(--blc-gold-500)]">
                {t("team_title_highlight")}
              </span>{" "}
              {t("team_title_after")}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--blc-green-700)]">
              {t("team_text")}
            </p>
            <motion.div
              aria-hidden="true"
              className="mt-7 h-1 w-16 rounded-full bg-[var(--blc-gold-500)]"
              initial={shouldReduceMotion ? false : { width: 0, opacity: 0 }}
              whileInView={
                shouldReduceMotion ? undefined : { width: 64, opacity: 1 }
              }
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: easing }}
            />
          </div>

          <Link
            href={`/${locale}/contact`}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--blc-green-900)] px-5 py-3 font-semibold text-[var(--blc-green-900)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--blc-gold-500)] hover:text-[var(--blc-gold-500)] focus-ring-light"
          >
            {t("team_cta")}
            <ArrowUpRight
              size={17}
              aria-hidden="true"
              className="rtl:rotate-180"
            />
          </Link>
        </motion.div>

        <div className="relative mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-12 xl:grid-rows-2">
          {teamMembers.map((member, index) => {
            const layoutClass = member.featured
              ? "xl:col-span-6 xl:row-span-2"
              : member.wide
                ? "xl:col-span-6"
                : "xl:col-span-3";
            const imageAlt = t(`team_member_${member.id}_name`);

            return (
              <motion.article
                key={member.id}
                custom={index}
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.16 }}
                variants={cardVariants}
                whileHover={shouldReduceMotion ? undefined : { y: -8 }}
                tabIndex={0}
                className={`group relative min-h-[25rem] overflow-hidden rounded-3xl border border-[var(--blc-sand-200)] bg-[var(--blc-green-900)] shadow-soft outline-none transition-[border-color,box-shadow] duration-500 hover:border-[var(--blc-gold-500)] hover:shadow-[0_22px_50px_rgb(2_56_48/0.18)] focus-visible:border-[var(--blc-gold-500)] focus-visible:ring-2 focus-visible:ring-[var(--blc-gold-500)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--blc-cream-100)] motion-reduce:transition-none ${layoutClass}`}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={
                    shouldReduceMotion
                      ? false
                      : { clipPath: "inset(0 0 100% 0)" }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? undefined
                      : { clipPath: "inset(0 0 0% 0)" }
                  }
                  viewport={{ once: true, amount: 0.16 }}
                  transition={{
                    duration: 1,
                    delay: index * 0.12,
                    ease: easing,
                  }}
                >
                  <motion.div
                    className="absolute inset-0"
                    whileHover={
                      shouldReduceMotion ? undefined : { scale: 1.08 }
                    }
                    transition={{ duration: 0.9, ease: easing }}
                  >
                    <Image
                      src={member.image}
                      alt={imageAlt}
                      fill
                      sizes={
                        member.featured
                          ? "(max-width: 1280px) 100vw, 50vw"
                          : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      }
                      className="object-cover opacity-90"
                    />
                  </motion.div>
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[var(--blc-green-900)] via-[var(--blc-green-900)]/35 to-[var(--blc-green-900)]/5 transition-opacity duration-500 group-hover:via-[var(--blc-green-900)]/70"
                    aria-hidden="true"
                  />
                  <div
                    className="absolute -end-16 -top-16 size-48 rounded-full border border-[var(--blc-gold-300)]/40 transition-transform duration-700 group-hover:scale-110"
                    aria-hidden="true"
                  />
                </motion.div>

                <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--blc-gold-300)]">
                    {t(`team_member_${member.id}_role`)}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
                    {imageAlt}
                  </h3>
                  <div className="grid transition-[grid-template-rows] duration-500 [grid-template-rows:0fr] group-hover:[grid-template-rows:1fr] group-focus-visible:[grid-template-rows:1fr]">
                    <div className="overflow-hidden">
                      <p className="max-w-xl pt-3 text-sm leading-7 text-[var(--blc-cream-100)] sm:text-base">
                        {t(`team_member_${member.id}_text`)}
                      </p>
                    </div>
                  </div>
                  <span className="mt-5 inline-flex size-10 items-center justify-center rounded-full border border-white/45 text-[var(--blc-gold-300)] transition duration-500 group-hover:border-[var(--blc-gold-300)] group-hover:bg-[var(--blc-gold-300)] group-hover:text-[var(--blc-green-900)] group-focus-visible:border-[var(--blc-gold-300)] group-focus-visible:bg-[var(--blc-gold-300)] group-focus-visible:text-[var(--blc-green-900)]">
                    <HeartHandshake size={17} aria-hidden="true" />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
