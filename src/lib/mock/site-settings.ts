export type SiteSocialLinks = {
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  x_url?: string;
};

export type SiteSettings = SiteSocialLinks & {
  phone: string;
  whatsapp_number: string;
  email: string;
  address_en: string;
  address_ar: string;
  working_hours_en: string;
  working_hours_ar: string;
  logo_url: string;
  map_embed_url?: string;
};

export const mockSiteSettings: SiteSettings = {
  phone: "+20 100 000 0000",
  whatsapp_number: "201000000000",
  email: "hello@example.com",
  address_en: "Alexandria, Egypt",
  address_ar: "الإسكندرية، مصر",
  working_hours_en: "Working hours [CONFIRM]",
  working_hours_ar: "مواعيد العمل [تأكيد]",
  logo_url: "/brand/logo.png",
  facebook_url: "https://facebook.com/betterlifecare",
  instagram_url: "https://instagram.com/betterlifecare",
  linkedin_url: "https://linkedin.com/company/betterlifecare",
  youtube_url: "https://youtube.com/@betterlifecare",
  tiktok_url: "",
  x_url: "",
};
