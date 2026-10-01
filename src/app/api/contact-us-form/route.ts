import { NextResponse } from "next/server";
import { getContactUsFormsFromERP } from "@/lib/erp/contact";

export async function GET() {
  try {
    const forms = await getContactUsFormsFromERP();

    return NextResponse.json({
      forms,
    });
  } catch (error) {
    console.error("Contact-us BLC Form API error:", error);

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
