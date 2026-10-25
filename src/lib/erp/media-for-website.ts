import "server-only";

const ERP_BASE_URL = process.env.ERP_BASE_URL;
const ERP_API_KEY = process.env.ERP_API_KEY;
const ERP_API_SECRET = process.env.ERP_API_SECRET;

const DOCTYPE_PATH = "Media%20for%20Website";

export type MediaForWebsiteERP = {
  name: string;
  page_name: string | null;
  attach_wpov: string | null; // relative path saved by ERPNext, e.g. /files/hero.jpg
};

export type MediaForWebsite = MediaForWebsiteERP & {
  attach_wpov_url: string | null; // full URL of the attached media
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
 * Convert an ERPNext file path to a full URL.
 * /files/x.jpg -> {ERP_BASE_URL}/files/x.jpg
 */
export function getERPFileUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;

  const { baseUrl } = getERPConfig();

  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Get Media for Website records from ERPNext.
 * Pass pageName to return only the records for that page.
 */
export async function getMediaForWebsiteFromERP(
  pageName?: string,
): Promise<MediaForWebsite[]> {
  const { baseUrl, headers } = getERPConfig();

  const params = new URLSearchParams({
    fields: JSON.stringify(["name", "page_name", "attach_wpov"]),
    limit_page_length: "100",
  });

  if (pageName) {
    params.set("filters", JSON.stringify([["page_name", "=", pageName]]));
  }

  const response = await fetch(
    `${baseUrl}/api/resource/${DOCTYPE_PATH}?${params.toString()}`,
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
        "Failed to fetch Media for Website records from ERPNext.",
    );
  }

  return (result.data as MediaForWebsiteERP[]).map((row) => ({
    ...row,
    attach_wpov_url: getERPFileUrl(row.attach_wpov),
  }));
}
