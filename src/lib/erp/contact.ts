export type ServiceChild = {
  name?: string;
  service?: string;
};

export type ContactUsBLCForm = {
  name: string;

  full_name?: string;
  phone_number?: string;
  email_id?: string;
  how_we_help_you?: string;

  needed_services?: ServiceChild[];
};

export type CreateContactUsBLCFormInput = {
  full_name: string;
  phone_number: string;
  email_id?: string;
  how_we_help_you?: string;

  needed_services?: {
    service: string;
  }[];
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

/**
 * GET Contact-us BLC Form records from ERP.
 */
export async function getContactUsFormsFromERP(): Promise<ContactUsBLCForm[]> {
  const { baseUrl, headers } = getErpConfig();

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

  /*
   * Fetch each complete document to retrieve child-table rows.
   */
  return Promise.all(
    forms.map(async (form): Promise<ContactUsBLCForm> => {
      try {
        const documentResponse = await fetch(
          `${baseUrl}/api/resource/Contact-us%20BLC%20Form/${encodeURIComponent(
            form.name,
          )}`,
          {
            headers,
            cache: "no-store",
          },
        );

        if (!documentResponse.ok) {
          return {
            ...form,
            needed_services: [],
          };
        }

        const documentResult = (await documentResponse.json()) as {
          data?: ContactUsBLCForm;
        };

        const full = documentResult.data;

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

/**
 * POST a new Contact-us BLC Form to ERP.
 */
export async function createContactUsFormInERP(
  input: CreateContactUsBLCFormInput,
): Promise<ContactUsBLCForm> {
  const { baseUrl, headers } = getErpConfig();

  /*
   * Normalize receiver mail using the same logic as the API route:
   * - Accept a string.
   * - Trim surrounding whitespace.
   * - Use an empty string when omitted.
   */

  /*
   * ERPNext expects child-table rows in this format:
   *
   * needed_services: [
   *   { service: "services1" }
   * ]
   */
  const payload = {
    full_name: input.full_name.trim(),
    phone_number: input.phone_number.trim(),
    email_id: typeof input.email_id === "string" ? input.email_id.trim() : "",
    how_we_help_you:
      typeof input.how_we_help_you === "string"
        ? input.how_we_help_you.trim()
        : "",
    needed_services: (input.needed_services ?? [])
      .filter(
        (item) =>
          typeof item.service === "string" && Boolean(item.service.trim()),
      )
      .map((item) => ({
        service: item.service.trim(),
      })),
  };

  const response = await fetch(
    `${baseUrl}/api/resource/Contact-us%20BLC%20Form`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Contact-us BLC Form could not be created: ${errorText}`);
  }

  const result = (await response.json()) as {
    data?: ContactUsBLCForm;
  };

  if (!result.data) {
    throw new Error(
      "ERP created the Contact-us BLC Form but returned no document.",
    );
  }

  return result.data;
}
