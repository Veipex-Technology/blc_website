import { NextResponse } from "next/server";
import { getSocialPlatformsFromERP } from "@/lib/erp/social-platforms";

/**
 * GET
 *
 * Get BLC Social Platforms from ERP.
 */
export async function GET() {
  try {
    const socialPlatforms = await getSocialPlatformsFromERP();

    return NextResponse.json({
      socialPlatforms,
    });
  } catch (error) {
    console.error("BLC Social Platforms GET error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "BLC Social Platforms could not be loaded.",
      },
      {
        status: 502,
      },
    );
  }
}
