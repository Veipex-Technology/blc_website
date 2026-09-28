import type { Locale } from "@/i18n/routing";

export type ResolvedLocale = Locale;

export type SiteSettings = {
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  working_hours: string;
  map_embed_url?: string;
  logo_url: string;
  social: Partial<
    Record<
      "facebook" | "instagram" | "linkedin" | "youtube" | "tiktok" | "x",
      string
    >
  >;
};

export type ServiceFeature = { text: string };

export type Service = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  features: ServiceFeature[];
  note?: string;
  published: boolean;
  sort_order: number;
};

export type BlogCategory = { slug: string; title: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image: string;
  category: BlogCategory | null;
  published_on: string;
  author_name: string;
  seo_title: string;
  seo_description: string;
  published: boolean;
};

export type Testimonial = {
  id: string;
  author_name: string;
  relation: string;
  quote: string;
  photo?: string;
  published: boolean;
};
export type Partner = {
  id: string;
  name: string;
  logo?: string;
  website_url: string;
  published: boolean;
};
export type Faq = {
  id: string;
  question: string;
  answer: string;
  published: boolean;
  sort_order: number;
};

export type InquiryInput = {
  full_name: string;
  phone: string;
  email?: string;
  service?: string;
  preferred_language: "Arabic" | "English";
  message?: string;
  consent: boolean;
  source_page?: string;
};
