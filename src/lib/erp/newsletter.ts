import "server-only";

const ERP_BASE_URL = process.env.ERP_BASE_URL;
const ERP_API_KEY = process.env.ERP_API_KEY;
const ERP_API_SECRET = process.env.ERP_API_SECRET;

const DEFAULT_NEWSLETTER_GROUP = "Website Subscribers";

export type NewsletterEmailGroup = {
  email_group: string;
};

export type CreateNewsletterInput = {
  subject: string;
  email_group: NewsletterEmailGroup[];
  sender_name?: string;
  sender_email: string;
  send_from?: string;
  content_type?: "Rich Text" | "Markdown" | "HTML";
  message?: string;
  message_md?: string;
  message_html?: string;
  campaign?: string;
  send_unsubscribe_link?: boolean;
  send_webview_link?: boolean;
  published?: boolean;
  route?: string;
};

export type AddNewsletterSubscriberInput = {
  email: string;
  email_group?: string;
};

type EmailGroup = {
  name: string;
  title?: string;
  total_subscribers?: number;
  already_exists?: boolean;
};

type EmailGroupMember = {
  name: string;
  email_group: string;
  email: string;
  unsubscribed?: number | boolean;
  already_exists?: boolean;
};

function getERPConfig() {
  if (!ERP_BASE_URL || !ERP_API_KEY || !ERP_API_SECRET) {
    throw new Error("ERPNext API environment variables are missing.");
  }

  return {
    baseUrl: ERP_BASE_URL.replace(/\/+$/, ""),
    headers: {
      Authorization: `token ${ERP_API_KEY}:${ERP_API_SECRET}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
}

/**
 * Get Newsletter records from ERPNext.
 */
export async function getNewslettersFromERP() {
  const { baseUrl, headers } = getERPConfig();

  const fields = [
    "name",
    "subject",
    "sender_name",
    "sender_email",
    "email_sent",
    "email_sent_at",
    "total_recipients",
    "total_views",
    "published",
    "route",
  ];

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "100",
  });

  const response = await fetch(
    `${baseUrl}/api/resource/Newsletter?${params.toString()}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.exception ||
        result?.message ||
        "Failed to fetch Newsletter records from ERPNext.",
    );
  }

  return result.data;
}

/**
 * Get an Email Group by its document name.
 */
async function findEmailGroupInERP(
  groupName: string,
): Promise<EmailGroup | null> {
  const { baseUrl, headers } = getERPConfig();

  const params = new URLSearchParams({
    fields: JSON.stringify(["name", "title", "total_subscribers"]),
    limit_page_length: "1",
  });

  // The Email Group document name is the Link field value.
  // Filter by name, not only by title.
  params.set("filters", JSON.stringify([["name", "=", groupName]]));

  const response = await fetch(
    `${baseUrl}/api/resource/Email%20Group?${params.toString()}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.exception ||
        result?.message ||
        "Could not check Email Groups in ERPNext.",
    );
  }

  return result.data?.[0] ?? null;
}

/**
 * Ensure an Email Group exists.
 * Creates it when no matching document name exists.
 */
export async function ensureNewsletterEmailGroupInERP(
  groupName = DEFAULT_NEWSLETTER_GROUP,
): Promise<EmailGroup> {
  const { baseUrl, headers } = getERPConfig();

  const normalizedName = groupName.trim();

  if (!normalizedName) {
    throw new Error("Email Group name is required.");
  }

  const existing = await findEmailGroupInERP(normalizedName);

  if (existing) {
    return {
      ...existing,
      already_exists: true,
    };
  }

  const response = await fetch(`${baseUrl}/api/resource/Email%20Group`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      doctype: "Email Group",
      title: normalizedName,
    }),
    cache: "no-store",
  });

  const result = await response.json();

  if (response.ok) {
    return {
      ...result.data,
      already_exists: false,
    };
  }

  // If another request created the group at the same time,
  // check again before treating this as a failure.
  const groupAfterFailure = await findEmailGroupInERP(normalizedName);

  if (groupAfterFailure) {
    return {
      ...groupAfterFailure,
      already_exists: true,
    };
  }

  throw new Error(
    result?.exception ||
      result?.message ||
      "Could not create the Email Group in ERPNext.",
  );
}

/**
 * Add a subscriber to an Email Group.
 *
 * Ensures the group exists first, then checks for an existing
 * membership before creating a new Email Group Member.
 */
export async function addNewsletterSubscriberToERP(
  input: AddNewsletterSubscriberInput,
): Promise<EmailGroupMember> {
  const { baseUrl, headers } = getERPConfig();

  const email = input.email.trim().toLowerCase();
  const requestedGroup = (input.email_group || DEFAULT_NEWSLETTER_GROUP).trim();

  if (!email) {
    throw new Error("Subscriber email is required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid subscriber email is required.");
  }

  if (!requestedGroup) {
    throw new Error("Email Group is required.");
  }

  // Step 1: Create the group if it does not exist.
  const group = await ensureNewsletterEmailGroupInERP(requestedGroup);
  const emailGroup = group.name;

  // Step 2: Find an existing membership for this email and group.
  const filters = [
    ["email_group", "=", emailGroup],
    ["email", "=", email],
  ];

  const params = new URLSearchParams({
    filters: JSON.stringify(filters),
    fields: JSON.stringify(["name", "email_group", "email", "unsubscribed"]),
    limit_page_length: "1",
  });

  const existingResponse = await fetch(
    `${baseUrl}/api/resource/Email%20Group%20Member?${params.toString()}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  const existingResult = await existingResponse.json();

  if (!existingResponse.ok) {
    throw new Error(
      existingResult?.exception ||
        existingResult?.message ||
        "Could not check existing newsletter subscribers.",
    );
  }

  const existing = existingResult.data?.[0] as EmailGroupMember | undefined;

  if (existing) {
    return {
      ...existing,
      already_exists: true,
    };
  }

  // Step 3: Create the Email Group Member.
  const response = await fetch(
    `${baseUrl}/api/resource/Email%20Group%20Member`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        doctype: "Email Group Member",
        email_group: emailGroup,
        email,
        unsubscribed: 0,
      }),
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    // Handle a possible duplicate created by another request.
    const retryParams = new URLSearchParams({
      filters: JSON.stringify([
        ["email_group", "=", emailGroup],
        ["email", "=", email],
      ]),
      fields: JSON.stringify(["name", "email_group", "email", "unsubscribed"]),
      limit_page_length: "1",
    });

    const retryResponse = await fetch(
      `${baseUrl}/api/resource/Email%20Group%20Member?${retryParams.toString()}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      },
    );

    const retryResult = await retryResponse.json();

    if (retryResponse.ok && retryResult.data?.[0]) {
      return {
        ...retryResult.data[0],
        already_exists: true,
      };
    }

    throw new Error(
      result?.exception ||
        result?.message ||
        "Could not add the newsletter subscriber.",
    );
  }

  return {
    ...result.data,
    already_exists: false,
  };
}

/**
 * Create a Newsletter record in ERPNext.
 */
export async function createNewsletterInERP(input: CreateNewsletterInput) {
  const { baseUrl, headers } = getERPConfig();

  if (!input.subject?.trim()) {
    throw new Error("Newsletter subject is required.");
  }

  if (!input.sender_email?.trim()) {
    throw new Error("Newsletter sender email is required.");
  }

  if (input.send_webview_link && !input.published) {
    throw new Error(
      "The Newsletter must be published when send_webview_link is enabled.",
    );
  }

  if (!input.email_group?.length) {
    throw new Error("At least one Newsletter Email Group is required.");
  }

  // Ensure all Newsletter audience groups exist before linking them.
  const emailGroups: NewsletterEmailGroup[] = [];

  for (const item of input.email_group) {
    if (!item.email_group?.trim()) {
      throw new Error("Each Newsletter Email Group must have a valid name.");
    }

    const group = await ensureNewsletterEmailGroupInERP(
      item.email_group.trim(),
    );

    if (!emailGroups.some((entry) => entry.email_group === group.name)) {
      emailGroups.push({ email_group: group.name });
    }
  }

  const payload = {
    doctype: "Newsletter",
    subject: input.subject.trim(),
    sender_name: input.sender_name?.trim() ?? "",
    sender_email: input.sender_email.trim(),
    send_from: input.send_from?.trim() ?? "",
    content_type: input.content_type ?? "Rich Text",
    email_group: emailGroups,
    message: input.message ?? "",
    message_md: input.message_md ?? "",
    message_html: input.message_html ?? "",
    campaign: input.campaign ?? "",
    send_unsubscribe_link: input.send_unsubscribe_link ? 1 : 0,
    send_webview_link: input.send_webview_link ? 1 : 0,
    published: input.published ? 1 : 0,
    route: input.route ?? "",
  };

  const response = await fetch(`${baseUrl}/api/resource/Newsletter`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.exception ||
        result?.message ||
        "Failed to create Newsletter in ERPNext.",
    );
  }

  return result.data;
}
