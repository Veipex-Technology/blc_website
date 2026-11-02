export type ServiceFeature = {
  name: string;
  feature?: string; // English text
  features_ar?: string; // Arabic text (label "Features_Ar" in the Service Feature DocType)
  feature_ar_link?: string;
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

  // ERPNext Check field: 1 = checked, 0 = unchecked.
  is_main_service?: boolean | number | string;

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
  | "is_main_service"
>;

/**
 * The actual ERPNext document name is required by
 * Service-child.service, which links to Services BLC.
 */
export type ContactServiceOption = Pick<
  Service,
  "name" | "service_name" | "service_name_ar"
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
    baseUrl: baseUrl.replace(/\/+$/, ""),
    headers: {
      Authorization: `token ${apiKey}:${apiSecret}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
}

function toAbsoluteFileUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;

  const { baseUrl } = getErpConfig();
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
const serviceListFields = [
  "name",
  "service_name",
  "service_sub_title",
  "en_slug",
  "service_name_ar",
  "service_sub_title_ar",
  "ar_slug",
  "is_main_service",
];

const contactServiceFields = ["name", "service_name", "service_name_ar"];

/**
 * Normalize ERPNext Check field values.
 */
function isChecked(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}

/**
 * Normalize child-table rows from the Service Feature DocType.
 *
 * - Arabic rows: `feature` is filled from `features_ar` (falls back to `feature`).
 * - English rows: `feature` is kept as is.
 *
 * The original `features_ar` value is always preserved on the row.
 */
function normalizeFeatures(
  rows: ServiceFeature[] | undefined | null,
  lang: "en" | "ar",
  arabicLookup?: Map<string, string>,
): ServiceFeature[] {
  if (!Array.isArray(rows)) return [];

  return rows.map((row) => {
    const english = row.feature?.trim() || "";
    const arabicLink = row.feature_ar_link?.trim() || "";
    const arabicField = row.features_ar?.trim() || "";
    const arabicMatched = arabicLookup?.get(english) || "";

    const arabic = arabicLink || arabicField || arabicMatched;

    return {
      ...row,
      feature: lang === "ar" ? arabic || english : english,
      features_ar: arabic,
      feature_ar_link: arabicLink || arabicMatched,
    };
  });
}

function buildArabicLookup(
  rows: ServiceFeature[] | undefined | null,
): Map<string, string> {
  const map = new Map<string, string>();

  if (!Array.isArray(rows)) return map;

  for (const row of rows) {
    const english = row.feature?.trim();
    const arabic = row.feature_ar_link?.trim();

    if (english && arabic) map.set(english, arabic);
  }

  return map;
}
/**
 * Fetch the lightweight service list for navigation.
 */
async function fetchServiceList(): Promise<ServiceNavigationItem[]> {
  const { baseUrl, headers } = getErpConfig();

  const params = new URLSearchParams({
    fields: JSON.stringify(serviceListFields),
    limit_page_length: "100",
    order_by: "service_name asc",
  });

  const response = await fetch(
    `${baseUrl}/api/resource/Services%20BLC?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Services BLC could not be loaded: ${errorText}`);
  }

  const result = (await response.json()) as {
    data?: ServiceNavigationItem[];
  };

  return Array.isArray(result.data)
    ? result.data.map((service) => ({
        ...service,
        is_main_service: isChecked(service.is_main_service),
      }))
    : [];
}

/**
 * Fetch options for the Contact Us dropdown directly from Services BLC.
 * Include all services here, regardless of is_main_service.
 */
export async function getContactServiceOptionsFromERP(): Promise<
  ContactServiceOption[]
> {
  const { baseUrl, headers } = getErpConfig();

  const params = new URLSearchParams({
    fields: JSON.stringify(contactServiceFields),
    limit_page_length: "100",
    order_by: "service_name asc",
  });

  const response = await fetch(
    `${baseUrl}/api/resource/Services%20BLC?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Contact service options could not be loaded: ${errorText}`,
    );
  }

  const result = (await response.json()) as {
    data?: ContactServiceOption[];
  };

  return (Array.isArray(result.data) ? result.data : []).filter((service) =>
    Boolean(service.name),
  );
}

export async function getServicesForNavigationFromERP() {
  return fetchServiceList();
}

/**
 * Fetch complete service documents, including feature child tables.
 */
export async function getServicesFromERP(): Promise<Service[]> {
  const { baseUrl, headers } = getErpConfig();
  const services = await fetchServiceList();

  return Promise.all(
    services.map(async (service): Promise<Service> => {
      try {
        const response = await fetch(
          `${baseUrl}/api/resource/Services%20BLC/${encodeURIComponent(
            service.name,
          )}`,
          {
            headers,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return {
            ...service,
            service_feature: [],
            ar_service_feature: [],
          };
        }

        const result = (await response.json()) as {
          data?: Service;
        };

        const full = result.data;
        const arabicLookup = buildArabicLookup(full?.service_feature);

        return {
          ...service,
          ...full,
          image_en: toAbsoluteFileUrl(full?.image_en),
          image_ar: toAbsoluteFileUrl(full?.image_ar),
          is_main_service: isChecked(full?.is_main_service),
          service_feature: normalizeFeatures(full?.service_feature, "en"),
          ar_service_feature: normalizeFeatures(
            full?.ar_service_feature,
            "ar",
            arabicLookup,
          ),
        };
      } catch {
        return {
          ...service,
          is_main_service: isChecked(service.is_main_service),
          service_feature: [],
          ar_service_feature: [],
        };
      }
    }),
  );
}

/**
 * Return only services marked as main in ERPNext.
 */
export async function getMainServicesFromERP(): Promise<Service[]> {
  const services = await getServicesFromERP();

  return services.filter((service) => service.is_main_service === true);
}
