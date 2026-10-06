import { NextResponse } from "next/server";
import { getBlogPostsFromERP } from "@/lib/erp/blog";

/**
 * GET
 *
 * Get Blog Post records from ERP.
 */
export async function GET() {
  try {
    const posts = await getBlogPostsFromERP();

    return NextResponse.json({
      posts,
    });
  } catch (error) {
    console.error("Blog Posts GET error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Blog Posts could not be loaded.",
      },
      {
        status: 502,
      },
    );
  }
}
