"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { createInquirySchema, type InquiryPayload } from "@/lib/inquiry-schema";
import type { Locale } from "@/i18n/routing";

type ServiceOption = {
  slug: string;
  title: string;
};

type ServiceChild = {
  name?: string;
  service?: string;
};

type ContactUsBLCForm = {
  name: string;
  full_name?: string;
  phone_number?: string;
  email_id?: string;
  how_we_help_you?: string;
  needed_services?: ServiceChild[];
};

type FormValues = Omit<InquiryPayload, "consent"> & {
  consent: boolean;
};

type ContactFormProps = {
  locale: Locale;
  initialService?: string;
};

export function ContactForm({ locale, initialService }: ContactFormProps) {
  const t = useTranslations("contact");

  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [values, setValues] = useState<FormValues>({
    full_name: "",
    phone: "",
    email: "",
    service: initialService ?? "",
    preferred_language: locale === "ar" ? "Arabic" : "English",
    message: "",
    consent: false,
    website: "",
    locale,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const [submitting, setSubmitting] = useState(false);

  const statusRef = useRef<HTMLParagraphElement>(null);

  const schema = createInquirySchema({
    required: t("v_required"),
    phone: t("v_phone"),
    email: t("v_email"),
    message: t("v_message"),
    consent: t("v_consent"),
  });

  /*
   * ---------------------------------------------------------
   * GET needed_services FROM ERP
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      try {
        setLoadingServices(true);

        const response = await fetch(`/api/contact-us-form?locale=${locale}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Services could not be loaded.");
        }

        const result = (await response.json()) as {
          services?: ServiceOption[];
          error?: string;
        };

        if (cancelled) return;

        setServices(result.services ?? []);
      } catch (error) {
        console.error("Failed to load services:", error);

        if (!cancelled) {
          setServices([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingServices(false);
        }
      }
    }

    loadServices();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  /*
   * ---------------------------------------------------------
   * STATUS FOCUS
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (status !== "idle") {
      statusRef.current?.focus();
    }
  }, [status]);

  /*
   * ---------------------------------------------------------
   * UPDATE FORM
   * ---------------------------------------------------------
   */
  const update = (field: keyof FormValues, value: string | boolean) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };

      delete next[field];

      return next;
    });
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT
   * ---------------------------------------------------------
   */
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatus("idle");

    const result = schema.safeParse(values);

    if (!result.success) {
      const nextErrors: Record<string, string> = {};

      result.error.issues.forEach((issue) => {
        const field = String(issue.path[0] ?? "form");

        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });

      setErrors(nextErrors);

      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      /*
       * -------------------------------------------------------
       * SEND FORM TO ERP
       *
       * Browser -> Next.js API
       * Next.js API -> ERPNext
       *
       * ERP field mapping:
       *
       * full_name      <- full_name
       * phone_number   <- phone
       * email_id       <- email
       * how_we_help_you<- message
       * needed_services<- service
       * reciver_mail   <- empty
       * -------------------------------------------------------
       */

      const response = await fetch("/api/contact-us-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: result.data.full_name.trim(),

          phone_number: result.data.phone.trim(),

          email_id: result.data.email.trim(),

          how_we_help_you: result.data.message.trim(),

          needed_services: result.data.service
            ? [
                {
                  service: result.data.service,
                },
              ]
            : [],

          reciver_mail: "",
        }),
      });

      const responseData = (await response.json()) as {
        success?: boolean;
        form?: ContactUsBLCForm;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          responseData.error || "Contact form submission failed.",
        );
      }

      console.log("Contact-us BLC Form created in ERP:", responseData.form);

      /*
       * Reset form after successful ERP creation.
       */
      setValues({
        full_name: "",
        phone: "",
        email: "",
        service: "",
        preferred_language: locale === "ar" ? "Arabic" : "English",
        message: "",
        consent: false,
        website: "",
        locale,
      });

      setStatus("success");
    } catch (error) {
      console.error("Contact form submission error:", error);

      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * FRONTEND
   * ---------------------------------------------------------
   */
  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid gap-5"
      aria-describedby="inquiry-hint"
    >
      {/* Full Name */}
      <div className="grid gap-2">
        <label
          htmlFor="full_name"
          className="font-semibold text-[var(--blc-green-900)]"
        >
          {t("full_name")}
        </label>

        <input
          id="full_name"
          name="full_name"
          value={values.full_name}
          onChange={(event) => update("full_name", event.target.value)}
          aria-invalid={Boolean(errors.full_name)}
          aria-describedby={errors.full_name ? "full_name-error" : undefined}
          required
          className="min-h-12 rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 focus:border-[var(--blc-gold-500)] focus-ring-light"
        />

        {errors.full_name && (
          <p
            id="full_name-error"
            role="alert"
            className="text-sm text-[var(--blc-green-900)]"
          >
            {errors.full_name}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="grid gap-2">
        <label
          htmlFor="phone"
          className="font-semibold text-[var(--blc-green-900)]"
        >
          {t("phone")}
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          required
          className="min-h-12 rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 focus:border-[var(--blc-gold-500)] focus-ring-light"
        />

        {errors.phone && (
          <p
            id="phone-error"
            role="alert"
            className="text-sm text-[var(--blc-green-900)]"
          >
            {errors.phone}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="grid gap-2">
        <label
          htmlFor="email"
          className="font-semibold text-[var(--blc-green-900)]"
        >
          {t("email")}
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="min-h-12 rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 focus:border-[var(--blc-gold-500)] focus-ring-light"
        />

        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="text-sm text-[var(--blc-green-900)]"
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Service */}
      <div className="grid gap-2">
        <label
          htmlFor="service"
          className="font-semibold text-[var(--blc-green-900)]"
        >
          {t("service")}
        </label>

        <select
          id="service"
          name="service"
          value={values.service}
          onChange={(event) => update("service", event.target.value)}
          disabled={loadingServices}
          className="min-h-12 rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 focus:border-[var(--blc-gold-500)] focus-ring-light disabled:cursor-wait disabled:opacity-60"
        >
          <option value="">
            {loadingServices ? "Loading services..." : t("service_choose")}
          </option>

          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.title}
            </option>
          ))}
        </select>
      </div>

      {/* Preferred Language */}
      <div className="grid gap-2">
        <label
          htmlFor="preferred_language"
          className="font-semibold text-[var(--blc-green-900)]"
        >
          {t("language")}
        </label>

        <select
          id="preferred_language"
          name="preferred_language"
          value={values.preferred_language}
          onChange={(event) => update("preferred_language", event.target.value)}
          className="min-h-12 rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 focus:border-[var(--blc-gold-500)] focus-ring-light"
        >
          <option value="Arabic">
            {locale === "ar" ? "العربية" : "Arabic"}
          </option>

          <option value="English">
            {locale === "ar" ? "الإنجليزية" : "English"}
          </option>
        </select>
      </div>

      {/* Message */}
      <div className="grid gap-2">
        <label
          htmlFor="message"
          className="font-semibold text-[var(--blc-green-900)]"
        >
          {t("message")}
        </label>

        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={1000}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby="inquiry-hint message-count"
          className="rounded-xl border border-[var(--blc-sand-200)] bg-white p-4 focus:border-[var(--blc-gold-500)] focus-ring-light"
        />

        <p
          id="message-count"
          className="text-end text-xs text-[var(--blc-green-700)]"
        >
          {values.message.length}/1000
        </p>

        {errors.message && (
          <p role="alert" className="text-sm text-[var(--blc-green-900)]">
            {errors.message}
          </p>
        )}
      </div>

      {/* Hint */}
      <p id="inquiry-hint" className="text-sm text-[var(--blc-green-700)]">
        {t("hint")}
      </p>

      {/* Consent */}
      <div className="grid gap-1">
        <label
          htmlFor="consent"
          className="flex items-start gap-3 text-sm text-[var(--blc-green-900)]"
        >
          <input
            id="consent"
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(event) => update("consent", event.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            required
            className="mt-1 size-4 accent-[var(--blc-green-900)] focus-ring-light"
          />

          <span>
            {t("consent")}{" "}
            <Link
              href={`/${locale}/privacy-policy`}
              className="font-semibold underline underline-offset-2 focus-ring-light"
            >
              {t("privacy_link")}
            </Link>
          </span>
        </label>

        {errors.consent && (
          <p role="alert" className="text-sm text-[var(--blc-green-900)]">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Honeypot */}
      <input
        name="website"
        value={values.website}
        onChange={(event) => update("website", event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      {/* Locale */}
      <input type="hidden" name="locale" value={locale} />

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="min-h-12 w-fit rounded-full bg-[var(--blc-green-900)] px-6 font-semibold text-white hover:bg-[var(--blc-green-700)] disabled:cursor-wait disabled:opacity-60 focus-ring-dark"
      >
        {submitting ? t("submit_loading") : t("submit")}
      </button>

      {/* Status */}
      <p
        ref={statusRef}
        tabIndex={-1}
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
        className={`min-h-6 text-sm font-semibold ${
          status === "success"
            ? "text-[var(--blc-green-700)]"
            : "text-[var(--blc-green-900)]"
        }`}
      >
        {status === "success"
          ? t("success")
          : status === "error"
            ? t("error")
            : ""}
      </p>
    </form>
  );
}
