import { NextRequest, NextResponse } from "next/server";
import { getMediaForWebsiteFromERP } from "@/lib/erp/media-for-website";

export const dynamic = "force-dynamic";

/**
 * GET
 *
 * Fetch Media for Website records from ERPNext.
 * Returns page_name, the attach_wpov file path and its full URL.
 *
 *   /api/media-for-website               -> all records
 *   /api/media-for-website?page_name=Home -> records for that page
 */
export async function GET(request: NextRequest) {
  try {
    const pageName =
      new URL(request.url).searchParams.get("page_name")?.trim() || undefined;

    const media = await getMediaForWebsiteFromERP(pageName);

    return NextResponse.json({
      media: media.map((item) => ({
        name: item.name,
        page_name: item.page_name,
        attach_wpov: item.attach_wpov,
        attach_wpov_url: item.attach_wpov_url,
      })),
    });
  } catch (error) {
    console.error("Media for Website GET error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Media for Website could not be loaded.",
      },
      { status: 502 },
    );
  }
}
