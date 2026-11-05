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

  // Custom Arabic fields on Blog Post
  custom_arabic_title?: string | null;
  custom_arabic_blog_intro?: string | null;
  custom_arabic_content?: string | null;

  // Added from the linked Blogger / Blog Category doctypes
  blogger_short_name?: string;
  blogger_arabic_short_name?: string;
  blog_category_arabic_title?: string;
};

type RawBlogPost = Omit<
  BlogPost,
  | "slug"
  | "blogger_short_name"
  | "blogger_arabic_short_name"
  | "blog_category_arabic_title"
>;

type BloggerRecord = {
  name: string;
  short_name?: string;
  custom_arabic_short_name?: string;
};

type BlogCategoryRecord = {
  name: string;
  custom_arabic_title?: string;
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
 * Generic GET for any ERP doctype list.
 */
async function fetchDoctypeRecords<T>(
  doctype: string,
  fields: string[],
): Promise<T[]> {
  const { baseUrl, headers } = getErpConfig();

  const params = new URLSearchParams({
    fields: JSON.stringify(fields),
    limit_page_length: "1000",
  });

  const response = await fetch(
    `${baseUrl.replace(/\/$/, "")}/api/resource/${encodeURIComponent(doctype)}?${params.toString()}`,
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${doctype} records could not be loaded: ${errorText}`);
  }

  const result = (await response.json()) as { data?: T[] };

  return Array.isArray(result.data) ? result.data : [];
}

/**
 * GET Blog Post records from ERP, enriched with Blogger and
 * Blog Category custom fields.
 */
export async function getBlogPostsFromERP(): Promise<BlogPost[]> {
  const { baseUrl } = getErpConfig();

  const [rawPosts, bloggers, categories] = await Promise.all([
    fetchDoctypeRecords<RawBlogPost>("Blog Post", [
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
      "custom_arabic_title",
      "custom_arabic_blog_intro",
      "custom_arabic_content",
    ]),
    fetchDoctypeRecords<BloggerRecord>("Blogger", [
      "name",
      "short_name",
      "custom_arabic_short_name",
    ]),
    fetchDoctypeRecords<BlogCategoryRecord>("Blog Category", [
      "name",
      "custom_arabic_title",
    ]),
  ]);

  const bloggerMap = new Map<string, BloggerRecord>(
    bloggers.map((b): [string, BloggerRecord] => [b.name, b]),
  );

  const categoryMap = new Map<string, BlogCategoryRecord>(
    categories.map((c): [string, BlogCategoryRecord] => [c.name, c]),
  );

  return rawPosts.map((post): BlogPost => {
    const blogger = post.blogger ? bloggerMap.get(post.blogger) : undefined;
    const category = post.blog_category
      ? categoryMap.get(post.blog_category)
      : undefined;

    return {
      ...post,

      slug: normalizeBlogRoute(post.route),

      blogger_short_name: blogger?.short_name,
      blogger_arabic_short_name: blogger?.custom_arabic_short_name,
      blog_category_arabic_title: category?.custom_arabic_title,

      // Convert ERPNext relative image paths to absolute URLs.
      meta_image: post.meta_image
        ? new URL(post.meta_image, baseUrl).toString()
        : undefined,
    };
  });
}
