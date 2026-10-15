export type ServiceFeature = {
  name: string;
  feature?: string;
};

export type Service = {
  name: string;

  service_name?: string;
  service_sub_title?: string;
  image_en?: string;
  en_slug?: string;
  service_description?: string;

  service_name_ar?: string;
  service_sub_title_ar?: string;
  image_ar?: string;
  ar_slug?: string;
  ar_service_description?: string;

  service_feature?: ServiceFeature[];
  ar_service_feature?: ServiceFeature[];
};

export type ServiceNavigationItem = Pick<
  Service,
  | "name"
  | "service_name"
  | "service_sub_title"
  | "en_slug"
  | "service_name_ar"
  | "service_sub_title_ar"
  | "ar_slug"
>;

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
    },
  };
}

const serviceListFields = [
  "name",
  "service_name",
  "service_sub_title",
  "en_slug",
  "service_name_ar",
  "service_sub_title_ar",
  "ar_slug",
];

async function fetchServiceList(): Promise<ServiceNavigationItem[]> {
  const { baseUrl, headers } = getErpConfig();
  const params = new URLSearchParams({
    fields: JSON.stringify(serviceListFields),
    limit_page_length: "100",
  });

  const response = await fetch(
    `${baseUrl}/api/resource/Services%20BLC?${params.toString()}`,
    { headers, cache: "no-store" },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Services BLC could not be loaded: ${errorText}`);
  }

  const result = (await response.json()) as {
    data?: ServiceNavigationItem[];
  };

  return Array.isArray(result.data) ? result.data : [];
}

export async function getServicesForNavigationFromERP() {
  return fetchServiceList();
}

export async function getServicesFromERP(): Promise<Service[]> {
  const { baseUrl, headers } = getErpConfig();
  const services = await fetchServiceList();

  return Promise.all(
    services.map(async (service): Promise<Service> => {
      try {
        const res = await fetch(
          `${baseUrl}/api/resource/Services%20BLC/${encodeURIComponent(service.name)}`,
          { headers, cache: "no-store" },
        );

        if (!res.ok) {
          return { ...service, service_feature: [], ar_service_feature: [] };
        }

        const full = ((await res.json()) as { data?: Service }).data;

        return {
          ...service,
          ...full,
          service_feature: full?.service_feature ?? [],
          ar_service_feature: full?.ar_service_feature ?? [],
        };
      } catch {
        return { ...service, service_feature: [], ar_service_feature: [] };
      }
    }),
  );
}
