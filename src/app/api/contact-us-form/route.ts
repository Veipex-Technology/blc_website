import { NextRequest, NextResponse } from "next/server";
import { createContactUsFormInERP } from "@/lib/erp/contact";
import { getContactServiceOptionsFromERP } from "@/lib/erp/services";

/**
 * GET
 *
 * Fetch service options directly from Services BLC.
 * The dropdown displays localized service names but uses the
 * actual ERPNext document name as its value.
 */
export async function GET(request: NextRequest) {
  try {
    const locale =
      new URL(request.url).searchParams.get("locale") === "ar" ? "ar" : "en";

    const services = await getContactServiceOptionsFromERP();

    return NextResponse.json({
      services: services.map((service) => ({
        slug: service.name,
        title:
          locale === "ar"
            ? service.service_name_ar || service.service_name || service.name
            : service.service_name || service.name,
      })),
    });
  } catch (error) {
    console.error("Contact-us form services GET error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Services could not be loaded.",
      },
      { status: 502 },
    );
  }
}

/**
 * POST
 *
 * Create a new Contact-us BLC Form in ERPNext.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body.full_name !== "string" || !body.full_name.trim()) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 },
      );
    }

    if (typeof body.phone_number !== "string" || !body.phone_number.trim()) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 },
      );
    }

    // Keep only valid child rows with a non-empty service document name.
    let neededServices: { service: string }[] = [];

    if (Array.isArray(body.needed_services)) {
      neededServices = body.needed_services
        .filter(
          (item: unknown): item is { service: string } =>
            typeof item === "object" &&
            item !== null &&
            "service" in item &&
            typeof (item as { service?: unknown }).service === "string" &&
            Boolean((item as { service: string }).service.trim()),
        )
        .map((item: { service: string }) => ({
          service: item.service.trim(),
        }));
    }

    const form = await createContactUsFormInERP({
      full_name: body.full_name.trim(),
      phone_number: body.phone_number.trim(),
      email_id: typeof body.email_id === "string" ? body.email_id.trim() : "",
      how_we_help_you:
        typeof body.how_we_help_you === "string"
          ? body.how_we_help_you.trim()
          : "",
      needed_services: neededServices,
    });

    return NextResponse.json(
      {
        success: true,
        form,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact-us BLC Form POST error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Contact-us BLC Form could not be created.",
      },
      { status: 502 },
    );
  }
}
