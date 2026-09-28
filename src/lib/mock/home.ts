export type LocaleText = { en: string; ar: string };

export type HomeService = {
  slug: string;
  icon:
    | "heart"
    | "stethoscope"
    | "refresh"
    | "accessibility"
    | "flask"
    | "users"
    | "footprints";
  title_en: string;
  title_ar: string;
  tagline_en: string;
  tagline_ar: string;
};

export type HomeTestimonial = {
  id: string;
  author_name_en: string;
  author_name_ar: string;
  relation_en: string;
  relation_ar: string;
  quote_en: string;
  quote_ar: string;
  published: boolean;
};

export type HomePartner = {
  id: string;
  name_en: string;
  name_ar: string;
  website_url: string;
  published: boolean;
};
export type HomeBlogPost = {
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  published: boolean;
};
export type HomeFaq = {
  id: string;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  published: boolean;
};

export const homeServices: HomeService[] = [
  {
    slug: "elderly-care",
    icon: "heart",
    title_en: "Elderly Care and Daily Living Support",
    title_ar: "رعاية كبار السن ودعم الحياة اليومية",
    tagline_en: "Dignified everyday support with consistent supervision.",
    tagline_ar: "دعم يومي يحفظ الكرامة، مع إشراف منتظم.",
  },
  {
    slug: "home-nursing",
    icon: "stethoscope",
    title_en: "Home Nursing and Advanced Procedures",
    title_ar: "التمريض المنزلي والإجراءات المتقدمة",
    tagline_en: "Safe, nurse-led care at home.",
    tagline_ar: "رعاية آمنة بإشراف تمريضي في المنزل.",
  },
  {
    slug: "post-hospital-chronic-care",
    icon: "refresh",
    title_en: "Post-Hospital and Chronic Care Programme",
    title_ar: "برنامج الرعاية بعد الخروج من المستشفى والأمراض المزمنة",
    tagline_en: "Smooth recovery and reliable long-term follow-up.",
    tagline_ar: "تعافٍ سلس ومتابعة موثوقة على المدى الطويل.",
  },
  {
    slug: "rehabilitation",
    icon: "accessibility",
    title_en: "Rehabilitation at Home",
    title_ar: "التأهيل في المنزل",
    tagline_en: "Restore mobility and independence, safely at home.",
    tagline_ar: "استعادة الحركة والاستقلالية بأمان في المنزل.",
  },
  {
    slug: "home-diagnostics-doctor-visits",
    icon: "flask",
    title_en: "Home Diagnostics and Doctor Visits",
    title_ar: "التشخيص المنزلي وزيارات الأطباء",
    tagline_en:
      "Trusted diagnostics and medical oversight, without leaving home.",
    tagline_ar: "تشخيص موثوق ومتابعة طبية دون مغادرة المنزل.",
  },
  {
    slug: "caregiver-companion",
    icon: "users",
    title_en: "Caregiver and Companion Services",
    title_ar: "خدمات مقدّمي الرعاية والمرافقة",
    tagline_en: "A caring presence, when you need one.",
    tagline_ar: "حضور حانٍ حين تحتاجونه.",
  },
  {
    slug: "advanced-foot-care",
    icon: "footprints",
    title_en: "Advanced Foot Care",
    title_ar: "العناية المتقدمة بالقدم",
    tagline_en: "Gentle, professional care for healthy, comfortable feet.",
    tagline_ar: "عناية مهنية لطيفة لقدمين سليمتين ومريحتين.",
  },
];

export const homeTestimonials: HomeTestimonial[] = [];
export const homePartners: HomePartner[] = [];
export const homeBlogPosts: HomeBlogPost[] = [
  {
    slug: "prepare-home",
    title_en: "How to prepare your home for an elderly parent",
    title_ar: "كيف تجهّز منزلك لاستقبال والد أو والدة كبيرة في السن",
    excerpt_en: "Practical steps for a safer, calmer home.",
    excerpt_ar: "خطوات عملية لمنزل أكثر أماناً وراحة.",
    published: true,
  },
  {
    slug: "choose-home-care",
    title_en: "Questions to ask before choosing a home care provider",
    title_ar: "أسئلة تسألها قبل اختيار مقدّم خدمة رعاية منزلية",
    excerpt_en: "A thoughtful starting point for families.",
    excerpt_ar: "بداية عملية ومدروسة للأسر.",
    published: true,
  },
  {
    slug: "after-hospital",
    title_en: "Going home after the hospital: a family checklist",
    title_ar: "العودة إلى المنزل بعد المستشفى: قائمة للأسرة",
    excerpt_en: "A simple checklist for the transition home.",
    excerpt_ar: "قائمة بسيطة للعودة إلى المنزل.",
    published: true,
  },
];
export const homeFaqs: HomeFaq[] = [
  {
    id: "coverage",
    question_en: "Where do you provide care?",
    question_ar: "أين تقدمون خدماتكم؟",
    answer_en:
      "We currently serve Alexandria. [CONFIRM areas] Contact us to check your neighborhood.",
    answer_ar:
      "نخدم حالياً مدينة الإسكندرية. [تأكيد] تواصلوا معنا للتأكد من منطقتكم.",
    published: true,
  },
  {
    id: "start",
    question_en: "How do I start?",
    question_ar: "كيف أبدأ؟",
    answer_en:
      "Call us, message us on WhatsApp, or fill in the inquiry form. We will contact you to understand your needs.",
    answer_ar:
      "اتصلوا بنا أو راسلونا عبر واتساب أو املؤوا نموذج الاستفسار، وسنتواصل معكم لفهم احتياجاتكم.",
    published: true,
  },
  {
    id: "personalized",
    question_en: "Is the care personalized?",
    question_ar: "هل الرعاية مخصصة لكل شخص؟",
    answer_en:
      "Yes. Every care plan starts with understanding the person, their lifestyle, and their preferences.",
    answer_ar: "نعم. تبدأ كل خطة رعاية بفهم الشخص ونمط حياته وتفضيلاته.",
    published: true,
  },
  {
    id: "partners",
    question_en: "Do you arrange doctor visits and tests at home?",
    question_ar: "هل تنظمون زيارات الأطباء والتحاليل في المنزل؟",
    answer_en: "Yes, through trusted medical and diagnostic partners.",
    answer_ar: "نعم، عبر شركاء طبيين وتشخيصيين موثوقين.",
    published: true,
  },
  {
    id: "privacy",
    question_en: "How is my family's privacy protected?",
    question_ar: "كيف تُحمى خصوصية أسرتي؟",
    answer_en:
      "Medical and personal information is confidential and shared only with authorized professionals and family members.",
    answer_ar:
      "المعلومات الطبية والشخصية سرية، ولا تُشارَك إلا مع المختصين والأقارب المصرّح لهم.",
    published: true,
  },
  {
    id: "availability",
    question_en: "Are you available 24/7?",
    question_ar: "هل أنتم متاحون على مدار الساعة؟",
    answer_en: "[CONFIRM]",
    answer_ar: "[تأكيد]",
    published: true,
  },
];
