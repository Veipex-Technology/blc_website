export type BLCTimetable = {
  name?: string;
  day?: string;
  start_time?: string;
  end_time?: string;
};

export type BLCContactUsInfo = {
  name: string;

  company_name?: string;
  phone_number?: string;
  second_phone_number?: string;
  whats_app_number?: string;
  email?: string;
  address?: string;

  timetable?: BLCTimetable[];
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
 * GET BLC Contact-us Info records from ERP.
 */
export async function getBLCContactUsInfoFromERP(): Promise<
  BLCContactUsInfo[]
> {
  const { baseUrl, headers } = getErpConfig();

  const fields = [
    "name",
    "company_name",
    "phone_number",
    "second_phone_number",
    "whats_app_number",
    "email",
    "address",
  ];

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "100",
  });

  const response = await fetch(
    `${baseUrl}/api/resource/BLC-Contact-us%20Info?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`BLC-Contact-us Info could not be loaded: ${errorText}`);
  }

  const result = (await response.json()) as {
    data?: BLCContactUsInfo[];
  };

  const contactInfo = Array.isArray(result.data) ? result.data : [];

  return Promise.all(
    contactInfo.map(async (info): Promise<BLCContactUsInfo> => {
      try {
        const response = await fetch(
          `${baseUrl}/api/resource/BLC-Contact-us%20Info/${encodeURIComponent(
            info.name,
          )}`,
          {
            headers,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return {
            ...info,
            timetable: [],
          };
        }

        const result = (await response.json()) as {
          data?: BLCContactUsInfo;
        };

        const full = result.data;

        return {
          ...info,
          ...full,
          timetable: full?.timetable ?? [],
        };
      } catch {
        return {
          ...info,
          timetable: [],
        };
      }
    }),
  );
}
