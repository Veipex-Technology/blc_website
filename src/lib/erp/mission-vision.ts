export type MissionVisionBLC = {
  name: string;

  // Mission
  title?: string;
  description?: string;
  mission_image?: string;

  // Vision
  vission_title?: string;
  vission_description?: string;
  vission_image?: string;
};

function getErpConfig() {
  const baseUrl = process.env.ERP_BASE_URL;
  const apiKey = process.env.ERP_API_KEY;
  const apiSecret = process.env.ERP_API_SECRET;

  if (!baseUrl || !apiKey || !apiSecret) {
    throw new Error(
      "Missing ERP_BASE_URL, ERP_API_KEY or ERP_API_SECRET in environment.",
    );
  }

  return {
    baseUrl,
    headers: {
      Authorization: `token ${apiKey}:${apiSecret}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
}

/**
 * GET Mission-Vision-BLC records from ERP.
 */
export async function getMissionVisionFromERP(): Promise<MissionVisionBLC[]> {
  const { baseUrl, headers } = getErpConfig();

  const fields = [
    "name",
    "title",
    "description",
    "mission_image",
    "vission_title",
    "vission_description",
    "vission_image",
  ];

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "100",
  });

  const response = await fetch(
    `${baseUrl}/api/resource/Mission-Vision-BLC?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Mission-Vision-BLC could not be loaded: ${errorText}`);
  }

  const result = (await response.json()) as {
    data?: MissionVisionBLC[];
  };

  return Array.isArray(result.data) ? result.data : [];
}
