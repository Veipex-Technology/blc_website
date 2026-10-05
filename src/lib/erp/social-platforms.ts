export type SocialPlatform = {
  name: string;
  platform_name?: string;
  platform_url?: string;
  platform_icon?: string;
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
 * GET Social Platforms records from ERP.
 */
export async function getSocialPlatformsFromERP(): Promise<SocialPlatform[]> {
  const { baseUrl, headers } = getErpConfig();

  const fields = ["name", "platform_name", "platform_url", "platform_icon"];

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "100",
  });

  const response = await fetch(
    `${baseUrl}/api/resource/Social%20Platforms?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Social Platforms could not be loaded: ${errorText}`);
  }

  const result = (await response.json()) as {
    data?: SocialPlatform[];
  };

  // Prepend baseUrl to platform_icon if it's a relative path
  const data = Array.isArray(result.data) ? result.data : [];
  return data.map((social) => ({
    ...social,
    platform_icon: social.platform_icon?.startsWith("http")
      ? social.platform_icon
      : social.platform_icon
        ? `${baseUrl}${social.platform_icon}`
        : undefined,
  }));
}
