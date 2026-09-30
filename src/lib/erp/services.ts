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

export async function getServicesFromERP(): Promise<Service[]> {
  const baseUrl = "http://127.0.0.1:8000";

  const apiKey = "24d0a9267c137ae";
  const apiSecret = "3700ac8a792ecad";

  const headers = {
    Authorization: `token ${apiKey}:${apiSecret}`,
    Accept: "application/json",
  };

  // --------------------------------------------------
  // 1. Get list of Services BLC
  // --------------------------------------------------

  const fields = [
    "name",
    "service_name",
    "service_sub_title",
    "image_en",
    "en_slug",
    "service_description",

    "service_name_ar",
    "service_sub_title_ar",
    "image_ar",
    "ar_slug",
    "ar_service_description",
  ];

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "100",
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
      `Services BLC could not be loaded. ERPNext returned ${response.status}: ${errorText}`,
    );
  }

  const result = (await response.json()) as {
    data?: Service[];
  };

  const services = Array.isArray(result.data) ? result.data : [];

  // --------------------------------------------------
  // 2. Get each complete Service document
  // --------------------------------------------------

  const servicesWithFeatures = await Promise.all(
    services.map(async (service) => {
      const serviceResponse = await fetch(
        `${baseUrl}/api/resource/Services%20BLC/${encodeURIComponent(
          service.name,
        )}`,
        {
          headers,
          cache: "no-store",
        },
      );

      if (!serviceResponse.ok) {
        const errorText = await serviceResponse.text();

        console.error(
          `Could not load service ${service.name}:`,
          serviceResponse.status,
          errorText,
        );

        return {
          ...service,
          service_feature: [],
          ar_service_feature: [],
        };
      }

      const serviceResult = (await serviceResponse.json()) as {
        data?: Service;
      };

      const fullService = serviceResult.data;

      return {
        ...service,
        service_feature: fullService?.service_feature ?? [],
        ar_service_feature: fullService?.ar_service_feature ?? [],
      };
    }),
  );

  return servicesWithFeatures;
}
