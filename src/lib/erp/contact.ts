export type ServiceChild = {
  name: string;
  service?: string;
};

export type ContactUsBLCForm = {
  name: string;

  full_name?: string;
  phone_number?: string;
  email_id?: string;
  how_we_help_you?: string;

  needed_services?: ServiceChild[];

  reciver_mail?: string;
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
    },
  };
}

export async function getContactUsFormsFromERP(): Promise<ContactUsBLCForm[]> {
  const { baseUrl, headers } = getErpConfig();

  // Normal fields only.
  // needed_services is a Table MultiSelect,
  // so we load it from the full document below.
  const fields = [
    "name",
    "full_name",
    "phone_number",
    "email_id",
    "how_we_help_you",
    "reciver_mail",
  ];

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "100",
  });

  const response = await fetch(
    `${baseUrl}/api/resource/Contact-us%20BLC%20Form?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Contact-us BLC Form could not be loaded: ${errorText}`);
  }

  const result = (await response.json()) as {
    data?: ContactUsBLCForm[];
  };

  const forms = Array.isArray(result.data) ? result.data : [];

  return Promise.all(
    forms.map(async (form): Promise<ContactUsBLCForm> => {
      try {
        const res = await fetch(
          `${baseUrl}/api/resource/Contact-us%20BLC%20Form/${encodeURIComponent(
            form.name,
          )}`,
          {
            headers,
            cache: "no-store",
          },
        );

        if (!res.ok) {
          return {
            ...form,
            needed_services: [],
          };
        }

        const full = (
          (await res.json()) as {
            data?: ContactUsBLCForm;
          }
        ).data;

        return {
          ...form,
          ...full,
          needed_services: full?.needed_services ?? [],
        };
      } catch {
        return {
          ...form,
          needed_services: [],
        };
      }
    }),
  );
}
