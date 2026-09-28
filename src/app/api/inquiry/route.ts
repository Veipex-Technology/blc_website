import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { createInquirySchema } from "@/lib/inquiry-schema";
import { isInquiryRateLimited } from "@/lib/inquiry-rate-limit";
import { createInquiry } from "@/lib/erp/api";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  const locale = body?.locale === "ar" ? "ar" : "en";
  const t = await getTranslations({ locale, namespace: "contact" });
  const schema = createInquirySchema({
    required: t("v_required"),
    phone: t("v_phone"),
    email: t("v_email"),
    message: t("v_message"),
    consent: t("v_consent"),
  });
  const parsed = schema.safeParse(body ?? {});
  if (!parsed.success)
    return NextResponse.json({ error: t("f_error") }, { status: 400 });
  if (parsed.data.website)
    return NextResponse.json({ error: t("f_error") }, { status: 400 });

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "unknown";
  if (isInquiryRateLimited(ip))
    return NextResponse.json({ error: t("f_error") }, { status: 429 });

  try {
    await createInquiry({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      service: parsed.data.service,
      preferred_language: parsed.data.preferred_language,
      message: parsed.data.message,
      consent: parsed.data.consent,
      source_page: `/${locale}/contact`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: t("f_error") }, { status: 502 });
  }
}
