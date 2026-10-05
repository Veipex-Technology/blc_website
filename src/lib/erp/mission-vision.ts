export type MissionVisionBLC = {
  name: string;

  // English Mission
  title?: string;
  description?: string;
  mission_image?: string;

  // English Vision
  vission_title?: string;
  vission_description?: string;
  vission_image?: string;

  // Arabic Mission
  ar_mission_title?: string;
  ar_mission_description?: string;
  ar_mission_image?: string;

  // Arabic Vision
  ar_vission_title?: string;
  ar_vission_description?: string;
  ar_vission_image?: string;
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

    // English Mission
    "title",
    "description",
    "mission_image",

    // English Vision
    "vission_title",
    "vission_description",
    "vission_image",

    // Arabic Mission
    "ar_mission_title",
    "ar_mission_description",
    "ar_mission_image",

    // Arabic Vision
    "ar_vission_title",
    "ar_vission_description",
    "ar_vission_image",
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
