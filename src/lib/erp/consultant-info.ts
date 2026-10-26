export type BLCConsultantInfo = {
  name: string;
  person_name?: string;
  photo?: string;
  information?: string;
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
    baseUrl: baseUrl.replace(/\/$/, ""),
    headers: {
      Authorization: `token ${apiKey}:${apiSecret}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
}

/**
 * GET BLC consultant Info records from ERP.
 */
export async function getBLCConsultantInfoFromERP(): Promise<
  BLCConsultantInfo[]
> {
  const { baseUrl, headers } = getErpConfig();

  const fields = ["name", "person_name", "photo", "information"];

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "100",
  });

  const response = await fetch(
    `${baseUrl}/api/resource/BLC%20consultant%20Info?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`BLC consultant Info could not be loaded: ${errorText}`);
  }

  const result = (await response.json()) as {
    data?: BLCConsultantInfo[];
  };

  return Array.isArray(result.data) ? result.data : [];
}
