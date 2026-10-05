import { NextResponse } from "next/server";
import { getMissionVisionFromERP } from "@/lib/erp/mission-vision";

/**
 * GET
 *
 * Get BLC Mission and Vision information from ERP.
 */
export async function GET() {
  try {
    const missionVision = await getMissionVisionFromERP();

    return NextResponse.json({
      missionVision,
    });
  } catch (error) {
    console.error("BLC Mission-Vision GET error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "BLC Mission-Vision could not be loaded.",
      },
      {
        status: 502,
      },
    );
  }
}
