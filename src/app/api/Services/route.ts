import { NextResponse } from "next/server";
import { getServicesFromERP } from "@/lib/erp/services";

export async function GET() {
  try {
    const services = await getServicesFromERP();

    return NextResponse.json({
      services,
    });
  } catch (error) {
    console.error("Services API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Services BLC could not be loaded.",
      },
      { status: 502 },
    );
  }
}
