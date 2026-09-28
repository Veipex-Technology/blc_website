# Better Life Care — Website Site Details (v1.0, approved brief)

Tagline: **German Standards. Caring Hearts. Better Living.**
Market: Senior & home care, Alexandria, Egypt
Languages: Arabic (default, RTL) + English (LTR)
Competitors to differentiate from: NCC, Maru Medical Care

---

## 1. Positioning and emotional order

| Order | Feeling | How the site delivers it |
|---|---|---|
| 1 | Trust and peace of mind | Calm hero, clear headline, visible call/WhatsApp in the first screen, no clutter |
| 2 | Human warmth | Real, warm photography of families and caregivers; short human copy; testimonials |
| 3 | German standards (credibility layer) | Trust bar, "Standards" section, German healthcare consultant training our staff |
| 4 | Clear service message | 7 services in simple language, one idea per card |

Look and feel: premium and calm, generous white space, warm cream backgrounds, soft green and gold. **Not** a medical catalog: no stock stethoscope imagery, no dense feature lists, no red/blue clinical palette.

### Claims guardrails (must be respected in all copy)
- Do NOT say Better Life Care is a German company or that a German home-care company exists.
- Do NOT claim imported medical devices.
- Say: care is **guided by German standards**, and a **German healthcare consultant trains our staff**.
- Any number, licence, certification, or "24/7" claim is marked `[CONFIRM]` until the client verifies it.

---

## 2. Brand tokens

### 2.1 Colors (from supplied palette)
Note: the palette image shows `e5c690ip` — the `ip` is a typo; the value is `#e5c690`.

| Token | Hex | Role |
|---|---|---|
| `--blc-green-900` | `#023830` | Primary dark: headings, header text, footer background, primary buttons |
| `--blc-green-700` | `#334e3d` | Secondary green: body text on light, hover states, icons |
| `--blc-white` | `#ffffff` | Base background, cards |
| `--blc-cream-100` | `#f2e1d1` | Warm section background (peach cream) |
| `--blc-sand-200` | `#e3dacb` | Alternate section background, borders, dividers |
| `--blc-gold-300` | `#e5c690` | Soft gold: card accents, badges, subtle highlights |
| `--blc-gold-500` | `#b57f1b` | Brand gold (matches logo): accents, icons, large headings, secondary button border |
| `--blc-yellow-400` | `#f9d549` | Highlight only: tiny accents, focus ring on dark. Never as a large fill |

Suggested derived tokens: page background `#ffffff`; alt section `#f2e1d1` at 50% opacity over white; text `#023830` (headings) and `#334e3d` (body).

### 2.2 Accessibility rules
| Combination | Contrast | Rule |
|---|---|---|
| `#023830` on `#ffffff` | very high | OK for all text |
| `#334e3d` on `#ffffff` / `#f2e1d1` | high | OK for body text |
| `#ffffff` on `#023830` / `#334e3d` | high | OK for buttons and footer |
| `#b57f1b` on `#ffffff` | about 3.5:1 | Large text (24px+), icons, borders only. **Not** for small body text |
| `#f9d549` on white | very low | Never as text on light backgrounds |

### 2.3 Typography
| Language | Font | Weights |
|---|---|---|
| Arabic | Noto Sans Arabic | 400, 500, 600, 700 |
| English | Fira Sans | 400, 500, 600, 700 |

Rules: load through `next/font/google`; apply the Arabic font when `locale = ar`, the English font when `locale = en`; each falls back to the other plus `system-ui`. Arabic body text slightly larger (17–18px, line-height 1.9) than English (16–17px, line-height 1.7). Do not use letter-spacing on Arabic.

### 2.4 Shape and motion
Radius 16px cards, 999px pill buttons. Soft shadows only. Gentle fade/slide-up on scroll (respect `prefers-reduced-motion`). Logo mark can be reused as a faint watermark in cream sections.

### 2.5 Logo usage
- Full logo (mark + wordmark) in header on white; header height 72–80px desktop.
- On dark green footer use a white/gold monochrome variant of the logo. **Need from client:** transparent-background PNG/SVG and a light version for dark backgrounds. The supplied file has a white background.
- Favicon: the circle/house/heart mark only.

---

## 3. Sitemap

| # | Page | AR route | EN route | Source |
|---|---|---|---|---|
| 1 | Home | `/ar` | `/en` | CMS + static |
| 2 | About Us (story, standards, mission, vision, promise) | `/ar/about` | `/en/about` | Static (i18n files) |
| 3 | Services (listing) | `/ar/services` | `/en/services` | CMS |
| 3.1 | Elderly Care and Daily Living Support | `/services/elderly-care` | same | CMS |
| 3.2 | Home Nursing and Advanced Procedures | `/services/home-nursing` | same | CMS |
| 3.3 | Post-Hospital and Chronic Care Programme | `/services/post-hospital-chronic-care` | same | CMS |
| 3.4 | Rehabilitation at Home | `/services/rehabilitation` | same | CMS |
| 3.5 | Home Diagnostics and Doctor Visits (via partners) | `/services/home-diagnostics-doctor-visits` | same | CMS |
| 3.6 | Caregiver and Companion Services | `/services/caregiver-companion` | same | CMS |
| 3.7 | Advanced Foot Care | `/services/advanced-foot-care` | same | CMS |
| 4 | Blog (listing + category filter) | `/blog` | `/blog` | CMS |
| 4.1 | Blog post | `/blog/[slug]` | same | CMS |
| 5 | Contact and Inquiry | `/contact` | `/contact` | Form to ERPNext |
| 6 | Privacy Policy | `/privacy-policy` | `/privacy-policy` | Static (i18n) |

Not included: Terms and Conditions (client decision). Testimonials and Partners are **sections on the Home page**, not separate pages. `/sitemap.xml` and `robots.txt` generated automatically.

### Global elements
- **Header:** logo, nav (Home, About, Services, Blog, Contact), language switcher (AR / EN), "Call now" button, WhatsApp button.
- **Floating actions** (bottom corner, mirrored in RTL): WhatsApp and Call.
- **Footer:** logo, tagline, services links, quick links, contact details, social icons (all platforms), privacy policy link, copyright.

---

## 4. Home page structure (top to bottom)

| # | Section | Purpose | Data |
|---|---|---|---|
| 1 | Hero: warm image, headline, subline, 2 CTAs (Call / WhatsApp) + secondary "Request care" | Instant reassurance | Site Settings |
| 2 | Trust bar (4 short points) | German standards credibility | Static |
| 3 | Intro "Care you can trust" | Warmth in 2 short paragraphs | Static |
| 4 | Services grid (7 cards) | Clear service message | CMS `BLC Service` |
| 5 | Standards section "The heart of care. The strength of German standards." with German healthcare consultant note | Credibility layer | Static |
| 6 | How it works (3 steps: Talk to us, Personal care plan, Care begins at home) | Remove friction | Static |
| 7 | Testimonials (hidden if none published) | Social proof | CMS `BLC Testimonial` |
| 8 | Partners (hidden if none published) | Diagnostics/doctor partners | CMS `BLC Partner` |
| 9 | Latest from the blog (3 posts) | Helpful content, SEO | CMS `BLC Blog Post` |
| 10 | FAQ (accordion) | Reduce hesitation | CMS `BLC FAQ` |
| 11 | Final CTA band: call, WhatsApp, inquiry form | Conversion | Site Settings |

Calls to action available on every page: Call Center, WhatsApp, Inquiry form, social media links.

---

## 5. Architecture

```
Browser --> Next.js (App Router, server-side) --> ERPNext custom app "better_life_care" (whitelisted API)
                                              \-> Inquiry POST creates BLC Inquiry (+ optional Lead)
```

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS |
| i18n | `next-intl`, locales `ar` (default) and `en`, `dir="rtl"` for Arabic |
| CMS / backend | Custom Frappe app `better_life_care` inside the VEIPEX ERPNext instance |
| Data fetching | Server-side only, `fetch` with ISR (`revalidate: 300`) + on-demand revalidation webhook when a document is saved |
| Auth to ERPNext | Read-only API user (API key/secret) stored in Next.js env vars, **never exposed to the browser** |
| Forms | Next.js route handler `/api/inquiry` validates (zod), honeypot + rate limit, then calls ERPNext |
| Hosting | To be decided (Vercel or VPS); env vars listed in section 8 |

### 5.1 Env vars
| Name | Example |
|---|---|
| `ERP_BASE_URL` | `https://erp.example.com` |
| `ERP_API_KEY` | (read/write API user) |
| `ERP_API_SECRET` | |
| `REVALIDATE_SECRET` | random string |
| `NEXT_PUBLIC_SITE_URL` | `https://betterlifecare.example` |

---

## 6. ERPNext CMS data model

Naming: DocTypes prefixed `BLC`. Module: `Better Life Care`. All bilingual fields use suffix `_en` / `_ar`. Every content DocType has `published` (Check) and `sort_order` (Int).

### 6.1 BLC Site Settings (Single)
| Fieldname | Label | Type |
|---|---|---|
| `phone` | Call Center Number | Data |
| `whatsapp_number` | WhatsApp Number (international, digits only) | Data |
| `email` | Email | Data |
| `address_en` / `address_ar` | Address | Small Text |
| `working_hours_en` / `working_hours_ar` | Working Hours | Data |
| `map_embed_url` | Map Embed URL | Data |
| `facebook_url`, `instagram_url`, `linkedin_url`, `youtube_url`, `tiktok_url`, `x_url` | Social links | Data (URL) |
| `hero_image` | Hero Image | Attach Image |
| `hero_title_en` / `hero_title_ar` | Hero Title | Data |
| `hero_subtitle_en` / `hero_subtitle_ar` | Hero Subtitle | Small Text |

### 6.2 BLC Service
| Fieldname | Label | Type | Notes |
|---|---|---|---|
| `slug` | Slug | Data | Unique, lowercase, hyphenated |
| `title_en` / `title_ar` | Title | Data | Reqd |
| `tagline_en` / `tagline_ar` | Tagline | Small Text | One line |
| `description_en` / `description_ar` | Description | Text Editor | |
| `icon` | Icon Name | Data | e.g. Lucide icon key |
| `image` | Image | Attach Image | |
| `features` | Features | Table (`BLC Service Feature`) | |
| `seo_title_en/ar`, `seo_description_en/ar` | SEO | Data / Small Text | |
| `published`, `sort_order` | | Check, Int | |

Child `BLC Service Feature`: `text_en` (Data), `text_ar` (Data).

### 6.3 BLC Blog Category
`slug` (Data, unique), `title_en`, `title_ar`.

### 6.4 BLC Blog Post
| Fieldname | Type |
|---|---|
| `slug` | Data, unique |
| `title_en` / `title_ar` | Data |
| `excerpt_en` / `excerpt_ar` | Small Text |
| `body_en` / `body_ar` | Text Editor |
| `cover_image` | Attach Image |
| `category` | Link (`BLC Blog Category`) |
| `published_on` | Date |
| `author_name` | Data |
| `seo_title_en/ar`, `seo_description_en/ar` | Data / Small Text |
| `published` | Check |

Rule: a post appears in a language only if that language's title and body are filled.

### 6.5 BLC Testimonial
`author_name_en/ar` (Data), `relation_en/ar` (Data, e.g. "Daughter of a client"), `quote_en/ar` (Small Text), `photo` (Attach Image, optional), `consent_given` (Check, required before publishing), `published`, `sort_order`.

### 6.6 BLC Partner
`name_en/ar`, `logo` (Attach Image), `website_url`, `published`, `sort_order`.

### 6.7 BLC FAQ
`question_en/ar` (Data), `answer_en/ar` (Small Text), `published`, `sort_order`.

### 6.8 BLC Inquiry (created from website form)
| Fieldname | Type | Notes |
|---|---|---|
| `full_name` | Data | Reqd |
| `phone` | Data | Reqd |
| `email` | Data | Optional |
| `service` | Link (`BLC Service`) | Optional |
| `preferred_language` | Select (`Arabic`/`English`) | |
| `message` | Small Text | |
| `consent` | Check | Privacy policy agreement, reqd |
| `source_page` | Data | |
| `status` | Select (`New`/`Contacted`/`Closed`) | Default `New` |
| `lead` | Link (`Lead`) | Set by server script if Lead creation is enabled |

Permissions: website API user can **Read** published content and **Create** only `BLC Inquiry`. System Manager and Better Life Care staff role manage everything.

### 6.9 API endpoints (whitelisted, `allow_guest` not used; called with API key from Next.js server)
| Method path | Purpose |
|---|---|
| `better_life_care.api.get_site_settings` | Site Settings |
| `better_life_care.api.get_services` | List published services |
| `better_life_care.api.get_service?slug=` | One service |
| `better_life_care.api.get_posts?page=&category=` | Paginated blog list |
| `better_life_care.api.get_post?slug=` | One post |
| `better_life_care.api.get_testimonials` / `get_partners` / `get_faqs` | Home sections |
| `better_life_care.api.create_inquiry` (POST) | Create `BLC Inquiry` |

Frappe hook: `on_update` of content DocTypes calls the Next.js `/api/revalidate?secret=...` endpoint.

---

## 7. SEO, performance and compliance
- Per-page meta title/description in both languages; `hreflang` alternates for `ar`/`en`; canonical URLs; Open Graph image.
- JSON-LD: `Organization` (site-wide), `Service` (service pages), `Article` (blog), `FAQPage` (home FAQ).
- Images via `next/image`, WebP/AVIF, lazy load, LCP hero preloaded. Target Lighthouse 90+ on mobile.
- Mobile first: most Egyptian traffic is mobile; click-to-call and WhatsApp deep links (`https://wa.me/<number>`).
- Accessibility: WCAG AA contrast, visible focus, keyboard navigation, alt text in both languages.
- Privacy: Privacy Policy page, consent checkbox on inquiry form; medical details must not be requested in the inquiry form (only name, phone, service, short message).
- Analytics: placeholder for GA4 / Meta Pixel loaded only after consent (optional).

---

## 8. Items still needed from the client
| # | Item | Status |
|---|---|---|
| 1 | Logo as SVG/transparent PNG + light version for dark backgrounds | Needed |
| 2 | Real phone, WhatsApp, email, address, working hours (Privacy Policy still has placeholders) | Needed |
| 3 | Social media URLs | Needed |
| 4 | Real photography (warm, families and caregivers, Egyptian context) | Needed; placeholders until then |
| 5 | Name and short bio of the German healthcare consultant, and permission to name them | Needed |
| 6 | Confirmation of coverage area, hours (24/7?), licence/registration numbers | Needed (`[CONFIRM]`) |
| 7 | Partner names (labs, doctors, diagnostics) for the Partners section | Needed |
| 8 | Real testimonials with written consent | Needed |
| 9 | Domain name and hosting decision | Needed |
