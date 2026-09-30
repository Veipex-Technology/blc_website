import { NextResponse } from "next/server";

type Service = {
  name: string;

  service_name?: string;
  service_sub_title?: string;
  image_en?: string;
  en_slug?: string;
  service_description?: string;
  service_feature?: string;

  service_name_ar?: string;
  service_sub_title_ar?: string;
  image_ar?: string;
  ar_slug?: string;
  ar_service_description?: string;
  ar_service_feature?: string;
};

async function fetchERPCollection<T>(
  resourceName: string,
  fields: string[],
): Promise<T[]> {
  const baseUrl = "http://127.0.0.1:8000";
  const apiKey = "24d0a9267c137ae";
  const apiSecret = "3700ac8a792ecad";

  if (!baseUrl || !apiKey || !apiSecret) {
    throw new Error("ERPNext environment variables are missing.");
  }

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "100",
  });

  const response = await fetch(
    `${baseUrl}/api/resource/${encodeURIComponent(
      resourceName,
    )}?${params.toString()}`,
    {
      headers: {
        Authorization: `token ${apiKey}:${apiSecret}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `${resourceName} could not be loaded. ERPNext returned ${response.status}: ${errorText}`,
    );
  }

  const result = (await response.json()) as {
    data?: T[];
  };

  return Array.isArray(result.data) ? result.data : [];
}

export async function GET() {
  try {
    const services = await fetchERPCollection<Service>("Services BLC", [
      "name",

      "service_name",
      "service_sub_title",
      "image_en",
      "en_slug",
      "service_description",
      "service_feature",

      "service_name_ar",
      "service_sub_title_ar",
      "image_ar",
      "ar_slug",
      "ar_service_description",
      "ar_service_feature",
    ]);

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
