import { NextResponse } from "next/server";
import { getBLCConsultantInfoFromERP } from "@/lib/erp/consultant-info";

/**
 * GET
 *
 * Get BLC consultant Info from ERP.
 */
export async function GET() {
  try {
    const consultantInfo = await getBLCConsultantInfoFromERP();

    return NextResponse.json({
      consultantInfo,
    });
  } catch (error) {
    console.error("BLC consultant Info GET error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "BLC consultant Info could not be loaded.",
      },
      {
        status: 502,
      },
    );
  }
}
