"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, Check, CheckCircle2, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type SubmitState = "idle" | "loading" | "success" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const contentItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function NewsletterSection() {
  const t = useTranslations("home");
  const locale = useLocale();
  const shouldReduceMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Ignore bot submissions that fill the hidden honeypot.
    if (company) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      setSubmitState("error");
      return;
    }

    setSubmitState("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriber_email: normalizedEmail,
          locale,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Newsletter subscription failed.");
      }

      setEmail("");
      setSubmitState("success");
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setSubmitState("error");
    }
  }

  const reveal = shouldReduceMotion
    ? undefined
    : { once: true, margin: "-80px" };

  const revealInitial = shouldReduceMotion ? false : "hidden";

  return (
    <motion.section
      aria-labelledby="newsletter-title"
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[var(--blc-green-900)] py-16 lg:py-20"
      initial={revealInitial}
      whileInView="visible"
      viewport={reveal}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -end-24 -top-24 size-72 rounded-full bg-[var(--blc-gold-300)]/10 blur-3xl"
        animate={shouldReduceMotion ? undefined : { y: [0, -12, 0] }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -start-24 size-80 rounded-full bg-[var(--blc-gold-300)]/10 blur-3xl"
        animate={shouldReduceMotion ? undefined : { y: [0, 12, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative mx-auto w-full max-w-3xl px-5 text-center lg:px-8">
        <motion.p
          variants={contentItem}
          className="text-sm uppercase tracking-wide text-[var(--blc-gold-300)]"
        >
          {t("newsletter_label")}
        </motion.p>

        <motion.h2
          id="newsletter-title"
          variants={contentItem}
          className="mt-2 text-3xl font-bold text-white sm:text-4xl"
        >
          {t("newsletter_title")}
        </motion.h2>

        <motion.p variants={contentItem} className="mt-3 text-lg text-white/80">
          {t("newsletter_subtitle")}
        </motion.p>

        <motion.form
          variants={{
            hidden: {
              opacity: 0,
              y: 16,
              scale: 0.98,
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as const,
              },
            },
          }}
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:gap-0"
          noValidate
        >
          <label htmlFor="newsletter-email" className="sr-only">
            {t("newsletter_email_label")}
          </label>

          <input
            id="newsletter-email"
            type="email"
            name="subscriber_email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);

              if (submitState === "error" || submitState === "success") {
                setSubmitState("idle");
              }
            }}
            autoComplete="email"
            required
            placeholder={t("newsletter_email_placeholder")}
            aria-invalid={submitState === "error"}
            aria-describedby="newsletter-message"
            disabled={submitState === "loading"}
            className="h-14 min-w-0 flex-1 rounded-xl bg-white px-5 text-base text-[var(--blc-green-900)] placeholder:text-[var(--blc-green-700)]/55 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--blc-gold-300)]/60 disabled:opacity-70 sm:rounded-s-xl sm:rounded-e-none"
          />

          {/* Hidden honeypot field for basic bot detection */}
          <input
            type="text"
            name="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            className="sr-only"
          />

          <button
            type="submit"
            disabled={submitState === "loading"}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[var(--blc-gold-500)] px-8 font-bold uppercase tracking-wide text-[var(--blc-green-900)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--blc-gold-300)] active:translate-y-0 disabled:cursor-wait disabled:opacity-80 focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--blc-gold-300)]/60 sm:rounded-s-none sm:rounded-e-xl"
          >
            {submitState === "loading" && (
              <LoaderCircle
                className="h-5 w-5 animate-spin"
                aria-hidden="true"
              />
            )}

            {submitState === "success" && (
              <Check className="h-5 w-5" aria-hidden="true" />
            )}

            <span className={submitState === "loading" ? "sr-only" : ""}>
              {t("newsletter_submit")}
            </span>
          </button>
        </motion.form>

        <p className="mt-4 text-sm text-white/60">{t("newsletter_privacy")}</p>

        <AnimatePresence mode="wait">
          {submitState === "success" && (
            <motion.p
              key="success"
              id="newsletter-message"
              role="status"
              aria-live="polite"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 inline-flex items-center gap-2 text-[var(--blc-gold-300)]"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {t("newsletter_success")}
            </motion.p>
          )}

          {submitState === "error" && (
            <motion.p
              key="error"
              id="newsletter-message"
              role="alert"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 inline-flex items-center gap-2 text-red-200"
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {t("newsletter_error")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
