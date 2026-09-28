"use client";

import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import {createInquirySchema, type InquiryPayload} from "@/lib/inquiry-schema";
import type {Locale} from "@/i18n/routing";

type ServiceOption = {slug: string; title: string};
type FormValues = Omit<InquiryPayload, "consent"> & {consent: boolean};

export function ContactForm({locale, initialService, services}: {locale: Locale; initialService?: string; services: ServiceOption[]}) {
  const t = useTranslations("contact");
  const [values, setValues] = useState<FormValues>({full_name: "", phone: "", email: "", service: initialService ?? "", preferred_language: locale === "ar" ? "Arabic" : "English", message: "", consent: false, website: "", locale});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitting, setSubmitting] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const schema = createInquirySchema({required: t("v_required"), phone: t("v_phone"), email: t("v_email"), message: t("v_message"), consent: t("v_consent")});
  useEffect(() => {
    if (status !== "idle") statusRef.current?.focus();
  }, [status]);

  const update = (field: keyof FormValues, value: string | boolean) => setValues((current) => ({...current, [field]: value}));
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    const result = schema.safeParse(values);
    if (!result.success) {
      const nextErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {const field = String(issue.path[0] ?? "form"); if (!nextErrors[field]) nextErrors[field] = issue.message;});
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const response = await fetch("/api/inquiry", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(result.data)});
      if (!response.ok) throw new Error("Request failed");
      setValues({full_name: "", phone: "", email: "", service: "", preferred_language: locale === "ar" ? "Arabic" : "English", message: "", consent: false, website: "", locale});
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  return <form onSubmit={submit} noValidate className="grid gap-5" aria-describedby="inquiry-hint"><div className="grid gap-2"><label htmlFor="full_name" className="font-semibold text-[var(--blc-green-900)]">{t("full_name")}</label><input id="full_name" name="full_name" value={values.full_name} onChange={(event) => update("full_name", event.target.value)} aria-invalid={Boolean(errors.full_name)} aria-describedby={errors.full_name ? "full_name-error" : undefined} required className="min-h-12 rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 focus:border-[var(--blc-gold-500)] focus-ring-light" />{errors.full_name && <p id="full_name-error" role="alert" className="text-sm text-[var(--blc-green-900)]">{errors.full_name}</p>}</div><div className="grid gap-2"><label htmlFor="phone" className="font-semibold text-[var(--blc-green-900)]">{t("phone")}</label><input id="phone" name="phone" type="tel" inputMode="tel" value={values.phone} onChange={(event) => update("phone", event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} required className="min-h-12 rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 focus:border-[var(--blc-gold-500)] focus-ring-light" />{errors.phone && <p id="phone-error" role="alert" className="text-sm text-[var(--blc-green-900)]">{errors.phone}</p>}</div><div className="grid gap-2"><label htmlFor="email" className="font-semibold text-[var(--blc-green-900)]">{t("email")}</label><input id="email" name="email" type="email" value={values.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} className="min-h-12 rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 focus:border-[var(--blc-gold-500)] focus-ring-light" />{errors.email && <p id="email-error" role="alert" className="text-sm text-[var(--blc-green-900)]">{errors.email}</p>}</div><div className="grid gap-2"><label htmlFor="service" className="font-semibold text-[var(--blc-green-900)]">{t("service")}</label><select id="service" name="service" value={values.service} onChange={(event) => update("service", event.target.value)} className="min-h-12 rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 focus:border-[var(--blc-gold-500)] focus-ring-light"><option value="">{t("service_choose")}</option>{services.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>)}</select></div><div className="grid gap-2"><label htmlFor="preferred_language" className="font-semibold text-[var(--blc-green-900)]">{t("language")}</label><select id="preferred_language" name="preferred_language" value={values.preferred_language} onChange={(event) => update("preferred_language", event.target.value)} className="min-h-12 rounded-xl border border-[var(--blc-sand-200)] bg-white px-4 focus:border-[var(--blc-gold-500)] focus-ring-light"><option value="Arabic">{locale === "ar" ? "العربية" : "Arabic"}</option><option value="English">{locale === "ar" ? "الإنجليزية" : "English"}</option></select></div><div className="grid gap-2"><label htmlFor="message" className="font-semibold text-[var(--blc-green-900)]">{t("message")}</label><textarea id="message" name="message" rows={5} maxLength={1000} value={values.message} onChange={(event) => update("message", event.target.value)} aria-invalid={Boolean(errors.message)} aria-describedby="inquiry-hint message-count" className="rounded-xl border border-[var(--blc-sand-200)] bg-white p-4 focus:border-[var(--blc-gold-500)] focus-ring-light" /><p id="message-count" className="text-end text-xs text-[var(--blc-green-700)]">{values.message.length}/1000</p>{errors.message && <p role="alert" className="text-sm text-[var(--blc-green-900)]">{errors.message}</p>}</div><p id="inquiry-hint" className="text-sm text-[var(--blc-green-700)]">{t("hint")}</p><div className="grid gap-1"><label htmlFor="consent" className="flex items-start gap-3 text-sm text-[var(--blc-green-900)]"><input id="consent" name="consent" type="checkbox" checked={values.consent} onChange={(event) => update("consent", event.target.checked)} aria-invalid={Boolean(errors.consent)} required className="mt-1 size-4 accent-[var(--blc-green-900)] focus-ring-light" /><span>{t("consent")} <Link href={`/${locale}/privacy-policy`} className="font-semibold underline underline-offset-2 focus-ring-light">{t("privacy_link")}</Link></span></label>{errors.consent && <p role="alert" className="text-sm text-[var(--blc-green-900)]">{errors.consent}</p>}</div><input name="website" value={values.website} onChange={(event) => update("website", event.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" /><input type="hidden" name="locale" value={locale} /><button type="submit" disabled={submitting} className="min-h-12 w-fit rounded-full bg-[var(--blc-green-900)] px-6 font-semibold text-white hover:bg-[var(--blc-green-700)] disabled:cursor-wait disabled:opacity-60 focus-ring-dark">{submitting ? t("submit_loading") : t("submit")}</button><p ref={statusRef} tabIndex={-1} role={status === "error" ? "alert" : "status"} aria-live="polite" className={`min-h-6 text-sm font-semibold ${status === "success" ? "text-[var(--blc-green-700)]" : "text-[var(--blc-green-900)]"}`}>{status === "success" ? t("success") : status === "error" ? t("error") : ""}</p></form>;
}
