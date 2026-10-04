import { NextResponse } from "next/server";
import {
  createContactUsFormInERP,
  getContactUsFormsFromERP,
} from "@/lib/erp/contact";

/**
 * GET
 *
 * Get Contact-us BLC Form records from ERP.
 */
export async function GET() {
  try {
    const forms = await getContactUsFormsFromERP();

    return NextResponse.json({
      forms,
    });
  } catch (error) {
    console.error("Contact-us BLC Form GET error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Contact-us BLC Form could not be loaded.",
      },
      {
        status: 502,
      },
    );
  }
}

/**
 * POST
 *
 * Create a new Contact-us BLC Form in ERP.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    /*
     * Validate required fields.
     */
    if (!body || typeof body.full_name !== "string" || !body.full_name.trim()) {
      return NextResponse.json(
        {
          error: "Full name is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (typeof body.phone_number !== "string" || !body.phone_number.trim()) {
      return NextResponse.json(
        {
          error: "Phone number is required.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Validate needed_services.
     *
     * It should be:
     *
     * [
     *   {
     *     service: "services1"
     *   }
     * ]
     */
    let neededServices: {
      service: string;
    }[] = [];

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
        .map((item) => ({
          service: item.service.trim(),
        }));
    }

    /*
     * Build ERP payload.
     */
    const form = await createContactUsFormInERP({
      full_name: body.full_name.trim(),
      phone_number: body.phone_number.trim(),
      email_id: typeof body.email_id === "string" ? body.email_id.trim() : "",
      how_we_help_you:
        typeof body.how_we_help_you === "string"
          ? body.how_we_help_you.trim()
          : "",
      needed_services: neededServices,
      reciver_mail:
        typeof body.reciver_mail === "string" ? body.reciver_mail.trim() : "",
    });

    return NextResponse.json(
      {
        success: true,
        form,
      },
      {
        status: 201,
      },
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
      {
        status: 502,
      },
    );
  }
}
