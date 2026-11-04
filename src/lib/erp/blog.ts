export type BlogPost = {
  slug: string;
  name: string;

  title?: string;
  blog_category?: string;
  blogger?: string;
  route?: string;
  read_time?: number;

  published_on?: string;
  published?: boolean;
  featured?: boolean;
  hide_cta?: boolean;
  enable_email_notification?: boolean;
  disable_comments?: boolean;
  disable_likes?: boolean;

  blog_intro?: string;

  content_type?: "Markdown" | "Rich Text" | "HTML" | string;

  content?: string;
  content_md?: string;
  content_html?: string;

  email_sent?: boolean;

  meta_title?: string;
  meta_description?: string;
  meta_image?: string;

  google_preview?: string;
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
 * Converts ERP routes into the slug used by Next.js.
 *
 * ERP:
 * blog/elderly-care/elderly-care
 *
 * Next.js slug:
 * elderly-care/elderly-care
 */
export function normalizeBlogRoute(route?: string): string {
  if (!route) {
    return "";
  }

  return route.replace(/^\/?blog\/?/, "").replace(/^\/+|\/+$/g, "");
}

/**
 * GET Blog Post records from ERP.
 */

export async function getBlogPostsFromERP(): Promise<BlogPost[]> {
  const { baseUrl, headers } = getErpConfig();

  const fields = [
    "name",
    "title",
    "blog_category",
    "blogger",
    "route",
    "read_time",
    "published_on",
    "published",
    "featured",
    "hide_cta",
    "enable_email_notification",
    "disable_comments",
    "disable_likes",
    "blog_intro",
    "content_type",
    "content",
    "content_md",
    "content_html",
    "email_sent",
    "meta_title",
    "meta_description",
    "meta_image",
    "google_preview",
  ];

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "100",
  });

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/api/resource/Blog%20Post?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Blog Post records could not be loaded: ${errorText}`);
  }

  const result = (await response.json()) as {
    data?: Array<Omit<BlogPost, "slug">>;
    posts?: Array<Omit<BlogPost, "slug">>;
  };

  // Support both standard Frappe and custom API responses.
  const posts = result.data ?? result.posts ?? [];

  if (!Array.isArray(posts)) {
    return [];
  }

  return posts.map((post) => ({
    ...post,

    slug: normalizeBlogRoute(post.route),

    // Convert ERPNext relative image paths to absolute URLs.
    meta_image: post.meta_image
      ? new URL(post.meta_image, baseUrl).toString()
      : undefined,
  }));
}
