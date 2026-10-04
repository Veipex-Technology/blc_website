import { NextResponse } from "next/server";
import { getBLCContactUsInfoFromERP } from "@/lib/erp/contact-info";

/**
 * GET
 *
 * Get BLC Contact-us Info from ERP.
 */
export async function GET() {
  try {
    const contactInfo = await getBLCContactUsInfoFromERP();

    return NextResponse.json({
      contactInfo,
    });
  } catch (error) {
    console.error("BLC Contact-us Info GET error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "BLC Contact-us Info could not be loaded.",
      },
      {
        status: 502,
      },
    );
  }
}
