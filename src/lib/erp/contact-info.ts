export type BLCContactUsInfo = {
  name: string;
  company_name?: string;
  phone_number?: string;
  second_phone_number?: string;
  whats_app_number?: string;
  email?: string;
  address?: string;
  ar_address?: string | null;
  timetable?: string;
  ar_timetable?: string | null;
};

type ERPContactInfoListResponse = {
  data?: BLCContactUsInfo[];
};

type ERPContactInfoDetailResponse = {
  data?: Partial<BLCContactUsInfo>;
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
    baseUrl: baseUrl.replace(/\/+$/, ""),
    headers: {
      Authorization: `token ${apiKey}:${apiSecret}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
}

export async function getBLCContactUsInfoFromERP(): Promise<
  BLCContactUsInfo[]
> {
  const { baseUrl, headers } = getErpConfig();

  // These fieldnames must match the BLC-Contact-us Info DocType.
  const fields = [
    "name",
    "company_name",
    "phone_number",
    "second_phone_number",
    "whats_app_number",
    "email",
    "address",
    "ar_address",
    "timetable",
    "ar_timetable",
  ];

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "100",
  });

  const listUrl = `${baseUrl}/api/resource/BLC-Contact-us%20Info?${params.toString()}`;

  const response = await fetch(listUrl, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`BLC-Contact-us Info could not be loaded: ${errorText}`);
  }

  const result = (await response.json()) as ERPContactInfoListResponse;

  const records = result.data ?? [];

  // Fetch each complete document to retrieve all permitted DocType fields.
  const detailedRecords = await Promise.all(
    records.map(async (info): Promise<BLCContactUsInfo> => {
      try {
        const detailUrl = `${baseUrl}/api/resource/BLC-Contact-us%20Info/${encodeURIComponent(info.name)}`;

        const detailResponse = await fetch(detailUrl, {
          method: "GET",
          headers,
          cache: "no-store",
        });

        if (!detailResponse.ok) {
          return {
            ...info,
            address: info.address ?? "",
            ar_address: info.ar_address ?? null,
            timetable: info.timetable ?? "",
            ar_timetable: info.ar_timetable ?? null,
          };
        }

        const detailResult =
          (await detailResponse.json()) as ERPContactInfoDetailResponse;

        const full = detailResult.data ?? {};

        return {
          ...info,
          ...full,
          name: full.name ?? info.name,
          company_name: full.company_name ?? info.company_name,
          phone_number: full.phone_number ?? info.phone_number,
          second_phone_number:
            full.second_phone_number ?? info.second_phone_number,
          whats_app_number: full.whats_app_number ?? info.whats_app_number,
          email: full.email ?? info.email,
          address: full.address ?? info.address ?? "",
          ar_address: full.ar_address ?? info.ar_address ?? null,
          timetable: full.timetable ?? info.timetable ?? "",
          ar_timetable: full.ar_timetable ?? info.ar_timetable ?? null,
        };
      } catch {
        // Keep the list response as a fallback if a detail request fails.
        return {
          ...info,
          address: info.address ?? "",
          ar_address: info.ar_address ?? null,
          timetable: info.timetable ?? "",
          ar_timetable: info.ar_timetable ?? null,
        };
      }
    }),
  );

  return detailedRecords;
}
