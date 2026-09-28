export type ServiceFeature = { text_en: string; text_ar: string };

export type MockService = {
  slug: string;
  icon: string;
  title_en: string;
  title_ar: string;
  tagline_en: string;
  tagline_ar: string;
  description_en: string;
  description_ar: string;
  features: ServiceFeature[];
  note_en?: string;
  note_ar?: string;
  published: boolean;
  sort_order: number;
};

export const mockServices: MockService[] = [
  {
    slug: "elderly-care",
    icon: "heart",
    title_en: "Elderly Care and Daily Living Support",
    title_ar: "رعاية كبار السن ودعم الحياة اليومية",
    tagline_en: "Dignified everyday support with consistent supervision.",
    tagline_ar: "دعم يومي يحفظ الكرامة، مع إشراف منتظم.",
    description_en:
      "<p>Help with the daily routines that make a home feel safe and familiar, delivered with patience, respect, and steady supervision, so your loved one keeps their independence and dignity.</p>",
    description_ar:
      "<p>مساعدة في الروتين اليومي الذي يجعل المنزل آمناً ومألوفاً، بصبر واحترام وإشراف مستمر، ليحتفظ من تحبون باستقلاليتهم وكرامتهم.</p>",
    features: [
      {
        text_en: "Personal care and hygiene assistance",
        text_ar: "مساعدة في العناية الشخصية والنظافة",
      },
      {
        text_en: "Mobility and safe movement support",
        text_ar: "دعم الحركة والتنقل بأمان",
      },
      {
        text_en: "Meal and medication reminders",
        text_ar: "تذكير بمواعيد الطعام والدواء",
      },
      {
        text_en: "Companionship and regular supervision",
        text_ar: "مرافقة وإشراف منتظم",
      },
      {
        text_en: "Regular updates for the family",
        text_ar: "تحديثات دورية للأسرة",
      },
    ],
    published: true,
    sort_order: 1,
  },
  {
    slug: "home-nursing",
    icon: "stethoscope",
    title_en: "Home Nursing and Advanced Procedures",
    title_ar: "التمريض المنزلي والإجراءات المتقدمة",
    tagline_en: "Safe, nurse-led care at home.",
    tagline_ar: "رعاية آمنة بإشراف تمريضي في المنزل.",
    description_en:
      "<p>Qualified nurses provide professional care and procedures in the comfort of home, following clear safety and hygiene routines and the instructions of the treating physician.</p>",
    description_ar:
      "<p>يقدّم ممرضون مؤهلون الرعاية والإجراءات المهنية في راحة المنزل، وفق روتين واضح للسلامة والنظافة وتعليمات الطبيب المعالج.</p>",
    features: [
      {
        text_en: "Injections and IV therapy as prescribed",
        text_ar: "الحقن والمحاليل الوريدية حسب الوصفة",
      },
      {
        text_en: "Wound care and dressings",
        text_ar: "العناية بالجروح والتضميد",
      },
      { text_en: "Vital signs monitoring", text_ar: "متابعة العلامات الحيوية" },
      { text_en: "Medication administration", text_ar: "إعطاء الأدوية" },
      {
        text_en: "Catheter and tube care [CONFIRM scope]",
        text_ar: "العناية بالقسطرة والأنابيب [تأكيد النطاق]",
      },
    ],
    published: true,
    sort_order: 2,
  },
  {
    slug: "post-hospital-chronic-care",
    icon: "refresh",
    title_en: "Post-Hospital and Chronic Care Programme",
    title_ar: "برنامج الرعاية بعد الخروج من المستشفى والأمراض المزمنة",
    tagline_en: "Smooth recovery and reliable long-term follow-up.",
    tagline_ar: "تعافٍ سلس ومتابعة موثوقة على المدى الطويل.",
    description_en:
      "<p>A structured programme that helps patients settle back at home after hospital stays and supports long-term conditions with consistent, dependable follow-up.</p>",
    description_ar:
      "<p>برنامج منظّم يساعد المرضى على الاستقرار في المنزل بعد الإقامة بالمستشفى، ويدعم الحالات المزمنة بمتابعة منتظمة يُعتمد عليها.</p>",
    features: [
      {
        text_en: "Care plan built around the doctor's discharge instructions",
        text_ar: "خطة رعاية مبنية على تعليمات الطبيب عند الخروج",
      },
      {
        text_en: "Recovery monitoring and progress notes",
        text_ar: "متابعة التعافي وتسجيل التقدم",
      },
      {
        text_en: "Medication and appointment coordination",
        text_ar: "تنسيق الأدوية والمواعيد",
      },
      {
        text_en: "Ongoing follow-up for chronic conditions",
        text_ar: "متابعة مستمرة للحالات المزمنة",
      },
      {
        text_en: "Guidance for family members",
        text_ar: "إرشاد لأفراد الأسرة",
      },
    ],
    published: true,
    sort_order: 3,
  },
  {
    slug: "rehabilitation",
    icon: "accessibility",
    title_en: "Rehabilitation at Home",
    title_ar: "التأهيل في المنزل",
    tagline_en: "Restore mobility and independence, safely at home.",
    tagline_ar: "استعادة الحركة والاستقلالية بأمان في المنزل.",
    description_en:
      "<p>Guided rehabilitation in familiar surroundings, focused on regaining movement, strength, and confidence step by step.</p>",
    description_ar:
      "<p>تأهيل موجَّه في بيئة مألوفة، يركّز على استعادة الحركة والقوة والثقة خطوة بخطوة.</p>",
    features: [
      { text_en: "Individual rehabilitation plan", text_ar: "خطة تأهيل فردية" },
      {
        text_en: "Mobility, balance, and strength exercises",
        text_ar: "تمارين للحركة والتوازن والقوة",
      },
      {
        text_en: "Fall-prevention guidance",
        text_ar: "إرشادات للوقاية من السقوط",
      },
      {
        text_en: "Support after surgery, injury, or stroke [CONFIRM scope]",
        text_ar: "دعم بعد الجراحة أو الإصابة أو الجلطة [تأكيد النطاق]",
      },
      {
        text_en: "Progress tracking shared with the family",
        text_ar: "متابعة التقدم ومشاركتها مع الأسرة",
      },
    ],
    published: true,
    sort_order: 4,
  },
  {
    slug: "home-diagnostics-doctor-visits",
    icon: "flask",
    title_en: "Home Diagnostics and Doctor Visits",
    title_ar: "التشخيص المنزلي وزيارات الأطباء",
    tagline_en:
      "Trusted diagnostics and medical oversight, without leaving home.",
    tagline_ar: "تشخيص موثوق ومتابعة طبية دون مغادرة المنزل.",
    description_en:
      "<p>Through trusted partners, we arrange laboratory tests, diagnostics, and doctor visits at home, so medical oversight is easy and stress-free for the patient and family.</p>",
    description_ar:
      "<p>عبر شركاء موثوقين، ننسّق التحاليل والفحوصات التشخيصية وزيارات الأطباء في المنزل، لتصبح المتابعة الطبية سهلة وخالية من العناء للمريض وأسرته.</p>",
    features: [
      {
        text_en: "Home sample collection through partner laboratories",
        text_ar: "سحب العينات منزلياً عبر معامل شريكة",
      },
      {
        text_en: "Doctor home visits through partner providers",
        text_ar: "زيارات الأطباء عبر جهات شريكة",
      },
      {
        text_en: "Coordination of results with the care team",
        text_ar: "تنسيق النتائج مع فريق الرعاية",
      },
      {
        text_en: "Scheduling that fits the patient's routine",
        text_ar: "مواعيد تناسب روتين المريض",
      },
    ],
    note_en: "Services provided through our partners.",
    note_ar: "تُقدَّم الخدمة عبر شركائنا.",
    published: true,
    sort_order: 5,
  },
  {
    slug: "caregiver-companion",
    icon: "users",
    title_en: "Caregiver and Companion Services",
    title_ar: "خدمات مقدّمي الرعاية والمرافقة",
    tagline_en: "A caring presence, when you need one.",
    tagline_ar: "حضور حانٍ حين تحتاجونه.",
    description_en:
      "<p>Trained caregivers and companions who bring reliability, conversation, and comfort, giving families peace of mind when they cannot be there.</p>",
    description_ar:
      "<p>مقدّمو رعاية ومرافقون مدرَّبون يقدّمون الاعتمادية والحديث الودود والراحة، ليطمئن الأهل حين لا يستطيعون التواجد.</p>",
    features: [
      {
        text_en: "Flexible visits or longer shifts [CONFIRM]",
        text_ar: "زيارات مرنة أو فترات أطول [تأكيد]",
      },
      {
        text_en: "Companionship and conversation",
        text_ar: "مرافقة وحديث ودود",
      },
      {
        text_en: "Help with daily activities and outings",
        text_ar: "مساعدة في الأنشطة اليومية والخروج",
      },
      {
        text_en: "Trained and carefully selected caregivers",
        text_ar: "مقدّمو رعاية مدرَّبون ومختارون بعناية",
      },
      {
        text_en: "Clear communication with the family",
        text_ar: "تواصل واضح مع الأسرة",
      },
    ],
    published: true,
    sort_order: 6,
  },
  {
    slug: "advanced-foot-care",
    icon: "footprints",
    title_en: "Advanced Foot Care",
    title_ar: "العناية المتقدمة بالقدم",
    tagline_en: "Gentle, professional care for healthy, comfortable feet.",
    tagline_ar: "عناية مهنية لطيفة لقدمين سليمتين ومريحتين.",
    description_en:
      "<p>Specialized foot care at home for those who need extra attention, such as older adults and people with long-term conditions, delivered by trained professionals with a strong focus on hygiene and safety.</p>",
    description_ar:
      "<p>عناية متخصصة بالقدم في المنزل لمن يحتاجون اهتماماً إضافياً، مثل كبار السن ومرضى الحالات المزمنة، يقدّمها مختصون مدرَّبون مع تركيز كبير على النظافة والسلامة.</p>",
    features: [
      { text_en: "Professional foot assessment", text_ar: "فحص مهني للقدم" },
      { text_en: "Nail and skin care", text_ar: "العناية بالأظافر والجلد" },
      {
        text_en: "Callus and corn care [CONFIRM scope]",
        text_ar: "العناية بالجلد السميك والمسامير [تأكيد النطاق]",
      },
      {
        text_en: "Guidance on daily foot care and footwear",
        text_ar: "إرشادات للعناية اليومية والأحذية المناسبة",
      },
      {
        text_en: "Referral to a doctor when needed",
        text_ar: "التحويل إلى الطبيب عند الحاجة",
      },
    ],
    published: true,
    sort_order: 7,
  },
];

export function getMockService(slug: string) {
  return mockServices.find(
    (service) => service.published && service.slug === slug,
  );
}
