export type BlogCategory = { slug: string; title_en: string; title_ar: string };

export type BlogPost = {
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  body_en: string;
  body_ar: string;
  cover_image: string;
  category: string;
  published_on: string;
  author_name: string;
  seo_title_en: string;
  seo_title_ar: string;
  seo_description_en: string;
  seo_description_ar: string;
  published: boolean;
};

export const mockBlogCategories: BlogCategory[] = [
  {
    slug: "elderly-care",
    title_en: "Elderly Care",
    title_ar: "رعاية كبار السن",
  },
  {
    slug: "recovery-at-home",
    title_en: "Recovery at Home",
    title_ar: "التعافي في المنزل",
  },
  {
    slug: "family-guidance",
    title_en: "Family Guidance",
    title_ar: "إرشاد للأسرة",
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    slug: "prepare-home",
    title_en: "How to prepare your home for an elderly parent",
    title_ar: "كيف تجهّز منزلك لاستقبال والد أو والدة كبيرة في السن",
    excerpt_en: "Practical steps for a safer, calmer home.",
    excerpt_ar: "خطوات عملية لمنزل أكثر أماناً وراحة.",
    body_en:
      "<p>A familiar home can make everyday care feel calmer and more dignified. Start with clear walking paths, comfortable lighting, and the items your loved one reaches for most.</p><h2>Begin with the daily routine</h2><p>Notice when support is needed most, then make small changes that preserve independence while reducing avoidable risks.</p><ul><li>Keep frequently used items within easy reach.</li><li>Use non-slip surfaces in the bathroom.</li><li>Leave room for safe, steady movement.</li></ul>",
    body_ar:
      "<p>يمكن للمنزل المألوف أن يجعل الرعاية اليومية أكثر هدوءاً وكرامة. ابدأوا بممرات واضحة وإضاءة مريحة ووضع الأشياء التي يحتاجها من تحبون في متناول اليد.</p><h2>ابدؤوا بالروتين اليومي</h2><p>لاحظوا الأوقات التي يحتاج فيها الشخص إلى الدعم، ثم أجروا تغييرات بسيطة تحافظ على استقلاليته وتقلل المخاطر التي يمكن تجنبها.</p><ul><li>ضعوا الأشياء المستخدمة كثيراً في متناول اليد.</li><li>استخدموا أسطحاً غير قابلة للانزلاق في الحمام.</li><li>اتركوا مساحة للحركة الآمنة والثابتة.</li></ul>",
    cover_image: "/images/hero-placeholder.jpg",
    category: "elderly-care",
    published_on: "2026-09-10",
    author_name: "Better Life Care",
    seo_title_en: "Preparing Your Home for an Elderly Parent",
    seo_title_ar: "تجهيز المنزل لاستقبال أحد الوالدين كبار السن",
    seo_description_en: "Practical ways to make home care safer and calmer.",
    seo_description_ar: "طرق عملية لجعل الرعاية المنزلية أكثر أماناً وراحة.",
    published: true,
  },
  {
    slug: "choose-home-care",
    title_en: "Questions to ask before choosing a home care provider",
    title_ar: "أسئلة تسألها قبل اختيار مقدّم خدمة رعاية منزلية",
    excerpt_en: "A thoughtful starting point for families.",
    excerpt_ar: "بداية عملية ومدروسة للأسر.",
    body_en:
      "<p>Choosing care is a personal decision. The right conversation should make the family's expectations, communication needs, and safety priorities clear.</p><h2>Ask about the care relationship</h2><p>Ask how plans are personalized, how families receive updates, and how the team responds when needs change.</p>",
    body_ar:
      "<p>اختيار الرعاية قرار شخصي. ينبغي أن توضح المحادثة الأولى توقعات الأسرة واحتياجات التواصل وأولويات السلامة.</p><h2>اسألوا عن علاقة الرعاية</h2><p>اسألوا كيف تُخصَّص الخطط، وكيف تحصل الأسرة على التحديثات، وكيف يتعامل الفريق مع تغير الاحتياجات.</p>",
    cover_image: "/images/hero-placeholder.jpg",
    category: "family-guidance",
    published_on: "2026-09-05",
    author_name: "Better Life Care",
    seo_title_en: "Choosing a Home Care Provider: Questions to Ask",
    seo_title_ar: "اختيار مقدم الرعاية المنزلية: أسئلة مهمة",
    seo_description_en:
      "A thoughtful checklist for families comparing home care providers.",
    seo_description_ar: "قائمة عملية للأسر عند مقارنة مقدمي الرعاية المنزلية.",
    published: true,
  },
  {
    slug: "after-hospital",
    title_en: "Going home after the hospital: a family checklist",
    title_ar: "العودة إلى المنزل بعد المستشفى: قائمة للأسرة",
    excerpt_en: "A simple checklist for the transition home.",
    excerpt_ar: "قائمة بسيطة للعودة إلى المنزل.",
    body_en:
      "<p>The first days after a hospital stay can feel full. A clear plan helps the person recover in familiar surroundings while keeping communication with the family and care team steady.</p><h2>Create a simple handover</h2><p>Keep discharge instructions, appointments, medicines, and questions in one place so everyone knows what comes next.</p>",
    body_ar:
      "<p>قد تبدو الأيام الأولى بعد الخروج من المستشفى مليئة بالتفاصيل. تساعد الخطة الواضحة الشخص على التعافي في بيئة مألوفة مع الحفاظ على التواصل المنتظم بين الأسرة وفريق الرعاية.</p><h2>ضعوا خطة واضحة للانتقال</h2><p>احتفظوا بتعليمات الخروج والمواعيد والأدوية والأسئلة في مكان واحد حتى يعرف الجميع الخطوة التالية.</p>",
    cover_image: "/images/hero-placeholder.jpg",
    category: "recovery-at-home",
    published_on: "2026-08-28",
    author_name: "Better Life Care",
    seo_title_en: "Going Home After Hospital: A Family Checklist",
    seo_title_ar: "العودة إلى المنزل بعد المستشفى: قائمة للأسرة",
    seo_description_en:
      "A simple family checklist for a calmer transition home.",
    seo_description_ar: "قائمة أسرية بسيطة لعودة أكثر هدوءاً إلى المنزل.",
    published: true,
  },
];

export function getMockBlogPost(slug: string) {
  return mockBlogPosts.find((post) => post.published && post.slug === slug);
}
