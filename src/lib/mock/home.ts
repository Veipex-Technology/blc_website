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
    id: "qualified-team",
    question_en: "Are your nurses and caregivers qualified?",
    question_ar: "هل الممرضون ومقدمو الرعاية لديكم مؤهلون؟",
    answer_en:
      "Our nursing and caregiving team consists of trained professionals who are carefully selected based on their qualifications, experience, and ability to provide compassionate care.",
    answer_ar:
      "يتكون فريق التمريض والرعاية لدينا من متخصصين مدربين يتم اختيارهم بعناية بناءً على مؤهلاتهم وخبراتهم وقدرتهم على تقديم رعاية رحيمة.",
    published: true,
  },
  {
    id: "services",
    question_en: "What services does your company provide?",
    question_ar: "ما الخدمات التي تقدمها شركتكم؟",
    answer_en:
      "We provide professional home care and nursing services to help individuals receive quality care in the comfort of their own homes.\n\nOur services may include:\n\n- Home nursing services\n- Elderly care and assistance\n- Bedridden patient care\n- Medication assistance and administration\n- Vital signs monitoring\n- Post-surgery care\n- Mobility and personal care assistance\n- Disability support\n- Hourly, daily, and live-in care\n\nOur goal is to ensure comfort, safety, and peace of mind for patients and their families.",
    answer_ar:
      "نقدم خدمات الرعاية المنزلية والتمريضية المتخصصة لمساعدة الأفراد على الحصول على رعاية عالية الجودة في راحة منازلهم.\n\nقد تشمل خدماتنا:\n\n- خدمات التمريض المنزلي\n- رعاية كبار السن ومساعدتهم\n- رعاية المرضى طريحي الفراش\n- المساعدة في الأدوية وإعطائها\n- متابعة العلامات الحيوية\n- الرعاية بعد العمليات الجراحية\n- المساعدة في الحركة والعناية الشخصية\n- دعم ذوي الإعاقة\n- رعاية بالساعة أو يومية أو إقامة كاملة\n\nهدفنا هو ضمان الراحة والأمان وراحة البال للمرضى وعائلاتهم.",
    published: true,
  },
  {
    id: "round-the-clock-care",
    question_en: "Do you provide 24-hour home care?",
    question_ar: "هل تقدمون رعاية منزلية على مدار 24 ساعة؟",
    answer_en:
      "Yes! We offer flexible care arrangements based on your needs, including hourly, daily, overnight, and 24-hour care, subject to availability.\n\nOur team will help you choose the most suitable care plan for your loved ones.",
    answer_ar:
      "نعم! نقدم ترتيبات رعاية مرنة تناسب احتياجاتكم، بما في ذلك الرعاية بالساعة أو يومياً أو طوال الليل أو على مدار 24 ساعة، وذلك حسب التوافر.\n\nسيساعدكم فريقنا في اختيار خطة الرعاية الأنسب لأحبائكم.",
    published: true,
  },
  {
    id: "booking",
    question_en: "How can I book a nurse or caregiver?",
    question_ar: "كيف يمكنني حجز ممرض أو مقدم رعاية؟",
    answer_en:
      "Booking our services is simple!\n\n1. Contact us by phone, WhatsApp, or direct message.\n2. Share the patient’s condition and care requirements.\n3. Our team will recommend a suitable care plan.\n4. Confirm the schedule and service details.\n5. Your assigned nurse or caregiver will begin providing care.\n\nWe’re here to make the process as easy and comfortable as possible.",
    answer_ar:
      "حجز خدماتنا سهل!\n\n1. تواصلوا معنا عبر الهاتف أو واتساب أو الرسائل المباشرة.\n2. شاركونا حالة المريض واحتياجات الرعاية.\n3. سيوصي فريقنا بخطة رعاية مناسبة.\n4. أكدوا الموعد وتفاصيل الخدمة.\n5. سيبدأ الممرض أو مقدم الرعاية المخصص لكم في تقديم الرعاية.\n\nنحن هنا لنجعل العملية سهلة ومريحة قدر الإمكان.",
    published: true,
  },
];
