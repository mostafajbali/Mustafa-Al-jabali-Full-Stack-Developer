import React, { createContext, useContext, useState, useEffect } from 'react';
import { DeveloperSettings } from './types';

export type Language = 'en' | 'ar';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'ar',
  setLang: () => {},
  toggleLang: () => {},
  isRtl: true,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('aether_lang');
    return saved === 'ar' || saved === 'en' ? saved : 'ar';
  });

  const setLang = (next: Language) => {
    setLangState(next);
    localStorage.setItem('aether_lang', next);
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const isRtl = lang === 'ar';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [lang, isRtl]);

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, isRtl }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);

/**
 * Reusable AR / EN Segmented Switcher Button
 */
export const LanguageSwitcher: React.FC<{ onSwitch?: () => void }> = ({ onSwitch }) => {
  const { lang, setLang } = useI18n();

  return (
    <div
      dir="ltr"
      className="inline-flex items-center p-0.5 rounded-lg bg-[#061022] border border-cyan-500/30 shadow-[inset_0_1px_0_rgba(0,240,255,0.12)] shrink-0"
      role="group"
      aria-label="Language Switcher"
    >
      <button
        type="button"
        onClick={() => {
          setLang('ar');
          onSwitch?.();
        }}
        className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
          lang === 'ar'
            ? 'tech-btn-primary text-slate-950'
            : 'text-sky-200/70 hover:text-cyan-300'
        }`}
      >
        AR
      </button>
      <button
        type="button"
        onClick={() => {
          setLang('en');
          onSwitch?.();
        }}
        className={`px-2.5 py-1 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
          lang === 'en'
            ? 'tech-btn-primary text-slate-950'
            : 'text-sky-200/70 hover:text-cyan-300'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export const ARABIC_DEFAULTS = {
  fullName: 'مصطفى الجبالي',
  headline: 'أنا مصطفى الجبالي — مبرمج ومطور ويب متكامل (Full-Stack Developer)',
  subheadline:
    'مرحباً بك، أنا مصطفى الجبالي، مبرمج ومطور ويب متكامل (Full-Stack Web Developer). أقوم بتصميم وبرمجة مواقع وتطبيقات ويب حديثة، سريعة، ومتجاوبة بالكامل مع جميع الشاشات والجوالات — من واجهات المستخدم (Frontend UI/UX) إلى الأنظمة الخلفية وقواعد البيانات (Backend & Databases).',
  bio: 'أنا مصطفى الجبالي، مبرمج ومطور ويب متكامل (Full-Stack Web Developer) متخصص في بناء وتطوير المواقع التعريفية، المتاجر الإلكترونية، المنصات التفاعلية، ولوحات التحكم الإدارية (CMS & Dashboards) بأحدث تقنيات الويب وتجاوب تام 100% مع جميع الشاشات.',
  location: 'فلسطين · عمل حر عن بُعد (Remote)',
  availabilityText: 'متاح لاستلام وتطوير مشاريع الويب',
  yearsExperience: '+5 سنوات',
  projectsDelivered: '+35 مشروع',
  uptimeMetric: '100% Responsive',
  whatsappMessage:
    'مرحباً م. مصطفى، تصفحت موقعك الشخصي وأود التواصل معك بخصوص تطوير مشروع ويب.',
  skills: [
    {
      category: 'تطوير الواجهات الأمامية (Frontend Development)',
      items: [
        'React.js & Next.js',
        'TypeScript & JavaScript (ES6+)',
        'HTML5 & CSS3',
        'Tailwind CSS & Bootstrap',
        'تجاوب كامل (Mobile, Tablet & Desktop)',
        'تنفيذ واجهات UI/UX حديثة',
      ],
    },
    {
      category: 'البرمجة الخلفية وقواعد البيانات (Backend & Databases)',
      items: [
        'Node.js & Express.js',
        'بناء وربط RESTful APIs',
        'PostgreSQL & MySQL',
        'MongoDB & Firebase',
        'أنظمة الحماية والتوثيق (JWT / OAuth)',
        'لوحات التحكم الإدارية (Admin CMS)',
      ],
    },
    {
      category: 'الأدوات والنشر والأداء (DevOps & Web Tools)',
      items: [
        'Git & GitHub',
        'رفع واستضافة المواقع (Cloud & VPS Hosting)',
        'تحسين سرعة وأداء الويب (Performance)',
        'تهيئة محركات البحث (Technical SEO)',
        'ربط بوابات الدفع والـ APIs الخارجية',
        'كود برمجي نظيف وقابل للتوسع (Clean Code)',
      ],
    },
  ],
};

export const ENGLISH_DEFAULTS = {
  fullName: 'Mustafa Al-Jabali',
  headline: "I'm Mustafa Al-Jabali — Full-Stack Web Developer",
  subheadline:
    "Hello, I'm Mustafa Al-Jabali, a Full-Stack Web Developer specializing in designing and building modern, fast, and 100% responsive websites and web applications — from interactive Frontend UI/UX to scalable Backend APIs and Databases.",
  bio: "I'm Mustafa Al-Jabali, a Full-Stack Web Developer specializing in building complete websites, e-commerce platforms, and custom admin dashboards engineered to be 100% responsive across mobile, tablet, laptop, and desktop screens.",
  location: 'Palestine · Available Worldwide (Remote)',
  availabilityText: 'Available for Full-Stack Web Projects',
  yearsExperience: '5+ Years',
  projectsDelivered: '35+ Projects',
  uptimeMetric: '100% Responsive',
  whatsappMessage:
    'Hello Eng. Mustafa, I visited your portfolio website and would like to discuss a web development project.',
  skills: [
    {
      category: 'Frontend Web Development',
      items: [
        'React.js & Next.js',
        'TypeScript & JavaScript (ES6+)',
        'HTML5 & CSS3',
        'Tailwind CSS & Bootstrap',
        'Responsive Design (Mobile, Tablet & Desktop)',
        'Modern UI/UX Implementation',
      ],
    },
    {
      category: 'Backend & Databases',
      items: [
        'Node.js & Express.js',
        'RESTful APIs & Backend Architecture',
        'PostgreSQL & MySQL',
        'MongoDB & Firebase',
        'Authentication & Security (JWT / OAuth)',
        'Custom Admin Dashboards & CMS',
      ],
    },
    {
      category: 'Web Deployment & Tools',
      items: [
        'Git & GitHub Version Control',
        'Cloud Hosting & Server Deployment',
        'Web Performance & Speed Optimization',
        'Technical SEO Best Practices',
        'Payment Gateways & Third-Party APIs',
        'Clean, Scalable & Maintainable Code',
      ],
    },
  ],
};

const ARABIC_CHAR_REGEX = /[\u0600-\u06FF]/;

export function hasArabic(text?: string): boolean {
  if (!text) return false;
  return ARABIC_CHAR_REGEX.test(text);
}

/**
 * Returns strictly localized settings:
 * - When lang === 'en': 100% English without any Arabic characters.
 * - When lang === 'ar': Arabic with technical English terms preserved.
 */
export function getLocalizedProfile(settings: DeveloperSettings, lang: Language) {
  if (lang === 'en') {
    const cleanEnglishSkills =
      settings.skills && settings.skills.length > 0
        ? settings.skills.map((group, idx) => {
            const cleanedCategory = group.category
              .replace(/\([\u0600-\u06FF\s/&-]+\)/g, '')
              .replace(/[\u0600-\u06FF]+/g, '')
              .trim();
            return {
              category:
                cleanedCategory ||
                ENGLISH_DEFAULTS.skills[idx]?.category ||
                'Web Development',
              items: group.items.map((item, itemIdx) =>
                hasArabic(item)
                  ? ENGLISH_DEFAULTS.skills[idx]?.items[itemIdx] ||
                    item.replace(/[\u0600-\u06FF]+/g, '').trim()
                  : item
              ),
            };
          })
        : ENGLISH_DEFAULTS.skills;

    return {
      fullName: hasArabic(settings.fullName)
        ? ENGLISH_DEFAULTS.fullName
        : settings.fullName || ENGLISH_DEFAULTS.fullName,
      headline: hasArabic(settings.headline)
        ? ENGLISH_DEFAULTS.headline
        : settings.headline || ENGLISH_DEFAULTS.headline,
      subheadline: hasArabic(settings.subheadline)
        ? ENGLISH_DEFAULTS.subheadline
        : settings.subheadline || ENGLISH_DEFAULTS.subheadline,
      bio: hasArabic(settings.bio)
        ? ENGLISH_DEFAULTS.bio
        : settings.bio || ENGLISH_DEFAULTS.bio,
      location: hasArabic(settings.location)
        ? ENGLISH_DEFAULTS.location
        : settings.location || ENGLISH_DEFAULTS.location,
      availabilityText: hasArabic(settings.availabilityText)
        ? ENGLISH_DEFAULTS.availabilityText
        : settings.availabilityText || ENGLISH_DEFAULTS.availabilityText,
      yearsExperience: hasArabic(settings.yearsExperience)
        ? ENGLISH_DEFAULTS.yearsExperience
        : settings.yearsExperience || ENGLISH_DEFAULTS.yearsExperience,
      projectsDelivered: hasArabic(settings.projectsDelivered)
        ? ENGLISH_DEFAULTS.projectsDelivered
        : settings.projectsDelivered || ENGLISH_DEFAULTS.projectsDelivered,
      uptimeMetric: hasArabic(settings.uptimeMetric)
        ? ENGLISH_DEFAULTS.uptimeMetric
        : settings.uptimeMetric || ENGLISH_DEFAULTS.uptimeMetric,
      whatsappMessage: hasArabic(settings.whatsappMessage)
        ? ENGLISH_DEFAULTS.whatsappMessage
        : settings.whatsappMessage || ENGLISH_DEFAULTS.whatsappMessage,
      skills: cleanEnglishSkills,
    };
  }

  // Arabic mode (lang === 'ar'): Arabic text with English technical terms preserved
  return {
    fullName: settings.arabicName || ARABIC_DEFAULTS.fullName,
    headline: hasArabic(settings.headline)
      ? settings.headline
      : ARABIC_DEFAULTS.headline,
    subheadline: hasArabic(settings.subheadline)
      ? settings.subheadline
      : ARABIC_DEFAULTS.subheadline,
    bio: hasArabic(settings.bio) ? settings.bio : ARABIC_DEFAULTS.bio,
    location: hasArabic(settings.location)
      ? settings.location
      : ARABIC_DEFAULTS.location,
    availabilityText: hasArabic(settings.availabilityText)
      ? settings.availabilityText
      : ARABIC_DEFAULTS.availabilityText,
    yearsExperience: settings.yearsExperience || ARABIC_DEFAULTS.yearsExperience,
    projectsDelivered: settings.projectsDelivered || ARABIC_DEFAULTS.projectsDelivered,
    uptimeMetric: settings.uptimeMetric || ARABIC_DEFAULTS.uptimeMetric,
    whatsappMessage: hasArabic(settings.whatsappMessage)
      ? settings.whatsappMessage
      : ARABIC_DEFAULTS.whatsappMessage,
    skills: ARABIC_DEFAULTS.skills,
  };
}

export interface ArabicProjectTranslation {
  title: string;
  subtitle: string;
  category: string;
  summary: string;
  role: string;
  client: string;
  timeline: string;
  description: string;
  metrics?: { label: string; value: string; delta?: string }[];
  galleryCaptions?: Record<string, string>;
}

export const ARABIC_PROJECT_TRANSLATIONS: Record<string, ArabicProjectTranslation> = {
  'novamart-ecommerce-shopping-platform': {
    title: 'منصة متجر إلكتروني وتسوّق متكامل (NovaMart E-Commerce)',
    subtitle: 'نظام تجارة إلكترونية شامل مع سلة تسوق ذكية، بوابات دفع إلكتروني، ولوحة إدارة المخزون والطلبات',
    category: 'التجارة الإلكترونية والمتاجر (E-Commerce)',
    summary:
      'منصة تجارة إلكترونية وتسوق أونلاين متكاملة مبنية باستخدام Next.js وTypeScript وNode.js، تتضمن كتالوج منتجات سريع، فلترة ذكية، سلة تسوق تفاعلية، دفع إلكتروني عبر Stripe، ولوحة تحكم شاملة لإدارة المنتجات والمخزون والطلبات.',
    role: 'مبرمج ومطور ويب متكامل (Full-Stack Web Developer)',
    client: 'NovaMart Retail Group',
    timeline: '2026',
    description: `### نظرة عامة على المشروع
تم تطوير منصة **NovaMart E-Commerce** لتكون حلاً متكاملاً للتجارة الإلكترونية والتسوق عبر الإنترنت، مع تجربة مستخدم فائقة السرعة ومتجاوبة 100% مع شاشات الجوال والتابلت والديسكتوب.

### أبرز المميزات والخصائص البرمجية
- **واجهة تسوق عصرية وسريعة (Storefront UI/UX)**: عرض المنتجات بتصنيفات متعددة، بحث فوري، فلترة حسب السعر والتقييم، وسلة تسوق جانبية تفاعلية (Live Cart Drawer).
- **نظام دفع إلكتروني آمن (Secure Checkout)**: ربط مباشر مع بوابات الدفع **Stripe API** و**Apple Pay** بالإضافة إلى خيار الدفع عند الاستلام مع تتبع حالة الطلب لحظياً.
- **لوحة تحكم شاملة للتاجر (Admin & Inventory CMS)**: إدارة المنتجات، تحديث الأسعار والخصومات، مراقبة المخزون، ومتابعة طلبات العملاء وتقارير المبيعات اليومية والشهرية.`,
    metrics: [
      { label: 'سرعة تحميل المتجر', value: '0.7s', delta: 'أداء فائق السرعة' },
      { label: 'معدل إتمام الشراء', value: '+38%', delta: 'سلة تسوق ذكية' },
      { label: 'تجاوب الشاشات', value: '100%', delta: 'Mobile & Desktop' },
      { label: 'بوابات الدفع والأمان', value: 'SSL / Stripe', delta: 'حماية كاملة' },
    ],
    galleryCaptions: {
      'gal-ecom-1': 'واجهة المتجر الرئيسية وكتالوج المنتجات وسلة التسوق التفاعلية (Storefront & Cart).',
      'gal-ecom-2': 'لوحة تحكم التاجر لإدارة الطلبات والمبيعات والمخزون (Admin Orders & Analytics).',
    },
  },
  'gusto-restaurant-menu-management-system': {
    title: 'نظام إدارة منيو مطعم وطلبات ذكي (Gusto QR Menu & POS)',
    subtitle: 'منيو رقمي تفاعلي عبر QR Code مع نظام طلبات الطاولات وشاشة مطبخ حية ولوحة إدارة الأصناف',
    category: 'أنظمة المطاعم والمنيو الرقمي (Restaurant & POS)',
    summary:
      'نظام ويب متكامل لإدارة منيو المطاعم والكافيهات والطلبات الذكية، يتيح للزبائن استعراض المنيو عبر مسح رمز QR من الجوال وإرسال الطلب مباشرة إلى شاشة المطبخ (KDS)، مع لوحة تحكم لإدارة الأصناف والأسعار والعروض لحظياً.',
    role: 'مبرمج ومطور ويب متكامل (Full-Stack Web Developer)',
    client: 'Gusto Hospitality & Restaurants',
    timeline: '2026',
    description: `### نظرة عامة على المشروع
يقدم نظام **Gusto QR Menu & POS** تجربة رقمية متكاملة للمطاعم والكافيهات الحديثة، حيث يربط بين منيو الطاولة التفاعلي على جوال الزبون، شاشة المطبخ الحية، ولوحة إدارة المطعم في منصة ويب واحدة سريعة ومتجاوبة.

### أبرز المميزات والخصائص البرمجية
- **منيو رقمي تفاعلي عبر QR Code**: تصفح سريع للأقسام والوجبات مع الصور، السعرات الحرارية، الإضافات الخاصة، وإمكانية الطلب المباشر من الطاولة أو طلبات التوصيل.
- **لوحة تحكم لإدارة المنيو والأسعار (Menu Manager CMS)**: إضافة وتعديل الوجبات والأقسام والأسعار والعروض اليومية، وتفعيل أو إيقاف توفر أي صنف بضغطة زر واحدة.
- **شاشة عرض المطبخ اللحظية (Live Kitchen Display - KDS)**: استقبال طلبات الطاولات والتوصيل في الوقت الفعلي عبر **WebSockets** مع مؤقت زمني لتحضير كل طلب.`,
    metrics: [
      { label: 'سرعة فتح المنيو (QR)', value: '0.5s', delta: 'بدون تحميل تطبيق' },
      { label: 'توفير وقت الطلب', value: '60%', delta: 'ربط مباشر بالمطبخ' },
      { label: 'تجاوب مع الجوال والتابلت', value: '100%', delta: 'Mobile First UI' },
      { label: 'تحديث المنيو والأسعار', value: 'Realtime', delta: 'تزامن فوري' },
    ],
    galleryCaptions: {
      'gal-rest-1': 'واجهة المنيو الرقمي التفاعلي للزبائن وطلبات الطاولة عبر QR Code.',
      'gal-rest-2': 'لوحة إدارة أصناف المطعم وشاشة المطبخ اللحظية (Live Kitchen Display KDS).',
    },
  },
  'rawdati-kindergarten-platform': {
    title: 'منصة وموقع روضتي لرياض الأطفال والتعليم المبكر (Rawdati)',
    subtitle: 'بوابة تعليمية وتربوية متكاملة لرياض الأطفال، تسجيل وقبول أونلاين، وبوابة تواصل مع أولياء الأمور',
    category: 'المنصات التعليمية والمواقع المدرسية (Educational Platforms)',
    summary:
      'موقع ومنصة تعليمية وتربوية متكاملة لرياض الأطفال ومراكز الطفولة المبكرة، مبنية بأحدث تقنيات الويب (React, Next.js, Tailwind CSS) ومستضافة حياً على Vercel. تتيح لأولياء الأمور استكشاف البرامج التعليمية، التسجيل والقبول الإلكتروني، ومتابعة الأنشطة اليومية لأطفالهم بواجهة مبهجة ومتجاوبة 100% مع كافة الشاشات.',
    role: 'مبرمج ومطور ويب متكامل (Full-Stack Web Developer)',
    client: 'مؤسسة روضتي النموذجية للتعليم المبكر',
    timeline: '2026',
    description: `### نظرة عامة على المشروع
تم تطوير وتدشين **منصة وموقع روضتي (Rawdati)** لتكون الواجهة الرقمية الرسمية لمؤسسة ورياض أطفال تعليمية وتربوية رائدة. المشروع متاح ومستضاف حياً على منصة Vercel عبر الرابط: [rawdati-website.vercel.app](https://rawdati-website.vercel.app/).

### أبرز المميزات والخصائص البرمجية
- **تصميم مبهج وعصري (Joyful & Touch-Friendly UI)**: واجهات بصرية غنية بألوان الأطفال الدافئة والرسومات التفاعلية، مصممة خصيصاً لتناسب أولياء الأمور والأطفال مع تجاوب تام 100% على الهواتف الذكية والأجهزة اللوحية.
- **نظام القبول والتسجيل الإلكتروني (Online Admission System)**: نموذج تسجيل رقمي سلس يتيح لولي الأمر اختيار الفئة العمرية للطفل، تعبئة البيانات الصحية والمستندات، وتحديد موعد الجولة التعريفية بالروضة دون الحاجة لزيارة ورقية.
- **بوابة البرامج والمناهج والأنشطة (Curriculum & Activities Portal)**: استعراض تفاعلي لبرامج الروضة الأساسية (الفنون والإبداع، تأسيس اللغات والقراءة، أنشطة الذكاء والـ STEM، واللياقة الحركية) مع معرض صور ويوميات الصفوف.
- **أداء فائق واستضافة سحابية (Vercel Edge & SEO)**: سرعة تحميل فائقة، تحسين ظهور في محركات البحث (SEO)، وشهادة أمان مشفرة بالكامل.`,
    metrics: [
      { label: 'نظام التسجيل والقبول', value: 'إلكتروني 100%', delta: 'تقديم سلس وبدون أوراق' },
      { label: 'تجاوب الشاشات', value: '100% متجاوب', delta: 'Mobile & Tablet First' },
      { label: 'سرعة التصفح والتحميل', value: '0.6s', delta: 'أداء فائق على Vercel' },
      { label: 'الرابط الفعلي الحي', value: 'أونلاين', delta: 'rawdati-website.vercel.app' },
    ],
    galleryCaptions: {
      'gal-rawdati-1': 'الصفحة الرئيسية لمنصة روضتي وعرض البرامج التعليمية وبوابة التسجيل الإلكتروني.',
      'gal-rawdati-2': 'بوابة متابعة أولياء الأمور وجدول الأنشطة اليومية وصور الفعاليات المدرسية.',
    },
  },
};

