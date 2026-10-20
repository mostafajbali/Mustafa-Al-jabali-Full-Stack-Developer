import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  UtensilsCrossed,
  QrCode,
  ChefHat,
  Sparkles,
  CreditCard,
  Package,
  ExternalLink,
  Flame,
  Clock,
  Heart,
  Search,
  BookOpen,
  Award,
  Users,
  GraduationCap,
  Calendar,
  Send,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useI18n } from '../i18n';

interface InteractiveProjectDemoProps {
  slug: string;
}

export const InteractiveProjectDemo: React.FC<InteractiveProjectDemoProps> = ({ slug }) => {
  const { lang } = useI18n();
  const isAr = lang === 'ar';

  if (slug.includes('rawdati')) {
    return <RawdatiInteractiveDemo isAr={isAr} />;
  }

  if (slug.includes('ecommerce') || slug.includes('novamart') || slug.includes('shop')) {
    return <EcommerceInteractiveDemo isAr={isAr} />;
  }

  if (slug.includes('restaurant') || slug.includes('menu') || slug.includes('gusto')) {
    return <RestaurantMenuInteractiveDemo isAr={isAr} />;
  }

  return null;
};

/* ============================================================================
   1. RAWDATI KINDERGARTEN & EARLY LEARNING PLATFORM INTERACTIVE MODEL
   ============================================================================ */
const RawdatiInteractiveDemo: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [tab, setTab] = useState<'programs' | 'admission' | 'portal'>('programs');
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('4');
  const [selectedProgram, setSelectedProgram] = useState('montessori');

  const programs = [
    {
      id: 'montessori',
      titleAr: 'برنامج منتسوري والاستكشاف الحسي',
      titleEn: 'Montessori & Sensory Exploration',
      ageAr: '3 - 5 سنوات',
      ageEn: 'Ages 3 - 5',
      ageKey: '3-5',
      descAr: 'تطوير حواس الطفل والاعتماد على النفس من خلال أدوات منتسوري الملموسة والأنشطة العملية اليومية.',
      descEn: 'Hands-on sensory development, self-reliance, and practical life skills using certified Montessori materials.',
      icon: '🧩',
      tagAr: 'الأكثر إقبالاً',
      tagEn: 'POPULAR',
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
    },
    {
      id: 'languages',
      titleAr: 'تأسيس القراءة واللغات (الفونكس)',
      titleEn: 'Early Literacy & Phonics Fun',
      ageAr: '4 - 6 سنوات',
      ageEn: 'Ages 4 - 6',
      ageKey: '4-6',
      descAr: 'منهج الفونكس التفاعلي للحروف والأصوات باللغتين العربية والإنجليزية مع الحكواتي ومسرح العرائس.',
      descEn: 'Dual-language Arabic and English phonics immersion with storytelling and puppet theater.',
      icon: '📚',
      tagAr: 'ثنائي اللغة',
      tagEn: 'BILINGUAL',
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    },
    {
      id: 'arts',
      titleAr: 'الفنون التعبيرية والرسم والإبداع',
      titleEn: 'Creative Arts & Expression Studio',
      ageAr: '2 - 6 سنوات',
      ageEn: 'Ages 2 - 6',
      ageKey: '2-6',
      descAr: 'الرسم بالألوان المائية، تشكيل الصلصال، الموسيقى الإيقاعية، وتنمية المهارات الحركية الدقيقة.',
      descEn: 'Watercolors, clay sculpting, rhythmic music, and fine-motor coordination workshops.',
      icon: '🎨',
      tagAr: 'أنشطة يومية',
      tagEn: 'DAILY LAB',
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
    },
    {
      id: 'stem',
      titleAr: 'مستكشفو العلوم الصغار (STEM Kids)',
      titleEn: 'Little STEM Explorers & Logic',
      ageAr: '4 - 6 سنوات',
      ageEn: 'Ages 4 - 6',
      ageKey: '4-6',
      descAr: 'تجارب علمية مبسطة، بناء المكعبات الذكية، وحل الألغاز لتغذية الفضول العلمي والتفكير المنطقي.',
      descEn: 'Simple scientific discovery, architectural block building, and logic puzzles for young minds.',
      icon: '🚀',
      tagAr: 'تفكير إبداعي',
      tagEn: 'LOGIC & STEM',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    },
  ];

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) return;
    setFormSubmitted(true);
  };

  return (
    <div className="rounded-2xl tech-panel overflow-hidden shadow-2xl border border-cyan-400/40">
      {/* Top Banner with direct live external link to rawdati-website.vercel.app */}
      <div className="bg-[#050D1E] border-b border-cyan-500/25 px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
            ☀️
          </div>
          <div>
            <div className="text-xs font-mono text-[#00F0FF] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF9D] animate-ping" />
              <span>
                {isAr
                  ? 'مشروع متاح حياً أونلاين · LIVE DEPLOYED PROJECT'
                  : 'LIVE DEPLOYED PORTAL · VERCEL EDGE'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'منصة وموقع روضتي للتعليم المبكر' : 'Rawdati Kindergarten Platform'}</span>
            </h3>
          </div>
        </div>

        {/* Live Project External Link Button */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://rawdati-website.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl tech-btn-primary font-bold text-xs"
          >
            <span>{isAr ? 'فتح الموقع الفعلي الحي ↗' : 'Visit Live Website ↗'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="border-b border-cyan-500/20 bg-[#040A17] px-4 sm:px-6 flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setTab('programs')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            tab === 'programs'
              ? 'border-[#00F0FF] text-[#00F0FF]'
              : 'border-transparent text-sky-200/65 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isAr ? 'استكشاف المناهج والأنشطة' : 'Curriculums & Activities'}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('admission')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            tab === 'admission'
              ? 'border-[#00F0FF] text-[#00F0FF]'
              : 'border-transparent text-sky-200/65 hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>{isAr ? 'محاكاة التسجيل أونلاين' : 'Online Admission Simulator'}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('portal')}
          className={`py-3 px-3.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
            tab === 'portal'
              ? 'border-[#00F0FF] text-[#00F0FF]'
              : 'border-transparent text-sky-200/65 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{isAr ? 'بوابة متابعة ولي الأمر' : 'Parent Portal Dashboard'}</span>
        </button>
      </div>

      {/* Tab 1: Programs */}
      {tab === 'programs' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-white">
                {isAr ? 'برامج ومناهج روضتي التعليمية' : 'Rawdati Early Learning Programs'}
              </h4>
              <p className="text-xs text-sky-200/70">
                {isAr
                  ? 'برامج تفاعلية مصممة لإثارة شغف الاكتشاف وتطوير ذكاء الطفل'
                  : 'Interactive early childhood curriculums designed for curious young minds'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-[#09152B] border border-cyan-500/25 text-[#00FF9D]">
                {isAr ? '✓ معتمدة تربوياً' : '✓ Certified'}
              </span>
              <span className="px-2.5 py-1 rounded bg-[#09152B] border border-cyan-500/25 text-sky-300">
                {isAr ? '100% متجاوبة' : '100% Responsive'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="p-5 rounded-xl bg-[#061022] border border-cyan-500/25 hover:border-cyan-400/60 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{prog.icon}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${prog.color}`}>
                      {isAr ? prog.tagAr : prog.tagEn}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-sm sm:text-base font-bold text-white">
                      {isAr ? prog.titleAr : prog.titleEn}
                    </h5>
                    <div className="text-xs text-cyan-300/80 font-mono mt-0.5">
                      {isAr ? prog.ageAr : prog.ageEn}
                    </div>
                  </div>
                  <p className="text-xs text-sky-100/75 leading-relaxed">
                    {isAr ? prog.descAr : prog.descEn}
                  </p>
                </div>
                <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProgram(prog.id);
                      setTab('admission');
                    }}
                    className="text-xs font-bold text-[#00F0FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isAr ? 'سجل طفلك في هذا البرنامج' : 'Enroll in this program'}</span>
                    {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Admission Form Simulator */}
      {tab === 'admission' && (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-5">
          <div className="text-center space-y-1">
            <h4 className="text-lg font-bold text-white">
              {isAr ? 'نموذج التسجيل والقبول الإلكتروني للعام الجديد' : 'Online Student Admission Simulator'}
            </h4>
            <p className="text-xs text-sky-200/70">
              {isAr
                ? 'جرب كيفية تقديم أولياء الأمور لطلبات الالتحاق عبر الموقع مباشرة'
                : 'Experience the frictionless paperless enrollment workflow for parents'}
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-2xl">
                ✓
              </div>
              <h5 className="text-base font-bold text-white">
                {isAr ? `تم استلام طلب تسجيل الطفل (${childName}) بنجاح!` : `Admission request for (${childName}) submitted!`}
              </h5>
              <p className="text-xs text-emerald-200/90 leading-relaxed max-w-md mx-auto">
                {isAr
                  ? 'رقم الطلب: #RAW-2026-884 · تم إرسال رسالة تأكيد للبريد والجوال وتحديد موعد الجولة التعريفية بالروضة.'
                  : 'Application ID: #RAW-2026-884 · Confirmation SMS & email sent with orientation tour schedule.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setFormSubmitted(false);
                  setChildName('');
                }}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 cursor-pointer"
              >
                {isAr ? 'تقديم طلب جديد' : 'Submit Another Application'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdmissionSubmit} className="p-5 sm:p-6 rounded-xl bg-[#061022] border border-cyan-500/25 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-sky-200">
                  {isAr ? 'اسم الطفل الثلاثي' : 'Child Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder={isAr ? 'مثال: يوسف مصطفى الجبالي' : 'e.g. Yousef Mustafa Al-Jabali'}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#030712] border border-cyan-500/30 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-sky-200">
                    {isAr ? 'عمر الطفل' : 'Child Age'}
                  </label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#030712] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="2.5">{isAr ? 'سنتان ونصف (حضانة)' : '2.5 Years (Nursery)'}</option>
                    <option value="3">{isAr ? '3 سنوات (روضة أولى KG1)' : '3 Years (KG1)'}</option>
                    <option value="4">{isAr ? '4 سنوات (روضة ثانية KG2)' : '4 Years (KG2)'}</option>
                    <option value="5">{isAr ? '5 سنوات (تمهيدي Prep)' : '5 Years (Prep)'}</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-sky-200">
                    {isAr ? 'البرنامج المرغوب' : 'Preferred Program'}
                  </label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#030712] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="montessori">{isAr ? 'برنامج منتسوري الشامل' : 'Montessori Exploration'}</option>
                    <option value="languages">{isAr ? 'تأسيس اللغات والفونكس' : 'Early Literacy & Phonics'}</option>
                    <option value="arts">{isAr ? 'الفنون والرسم والإبداع' : 'Creative Arts Studio'}</option>
                    <option value="stem">{isAr ? 'العلوم الذكية STEM' : 'Little STEM Explorers'}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl tech-btn-primary font-bold text-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAr ? 'إرسال طلب التسجيل الإلكتروني أونلاين' : 'Submit Admission Application Online'}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Parent Portal */}
      {tab === 'portal' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#061022] border border-cyan-500/25 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-xl">👦</span>
              <div>
                <div className="text-sky-300">{isAr ? 'الطفل المسجل' : 'Student'}</div>
                <div className="font-bold text-white">{isAr ? 'يوسف مصطفى (KG2)' : 'Yousef Mustafa (KG2)'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🥗</span>
              <div>
                <div className="text-sky-300">{isAr ? 'الوجبة اليومية' : 'Daily Meal'}</div>
                <div className="font-bold text-[#00FF9D]">{isAr ? 'سلطة فواكه + شوفان بالعسل' : 'Fruit Bowl + Honey Oats'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎨</span>
              <div>
                <div className="text-sky-300">{isAr ? 'نشاط اليوم' : 'Today Activity'}</div>
                <div className="font-bold text-amber-300">{isAr ? 'ورشة تلوين بالأصابع' : 'Finger Painting Lab'}</div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <a
              href="https://rawdati-website.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#00F0FF] hover:underline"
            >
              <span>{isAr ? 'تصفح كافة مميزات المنصة على الموقع الفعلي المباشر ↗' : 'Explore full features on live deployment ↗'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   2. E-COMMERCE & ONLINE SHOPPING INTERACTIVE MODEL
   ============================================================================ */
interface StoreProduct {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  price: number;
  oldPrice?: number;
  badgeAr: string;
  badgeEn: string;
  stock: number;
}

const INITIAL_PRODUCTS: StoreProduct[] = [
  {
    id: 'p1',
    nameAr: 'سماعة AeroPods Max لاسلكية عازلة للضوضاء (ANC)',
    nameEn: 'AeroPods Max Wireless ANC Headphones',
    categoryAr: 'إلكترونيات',
    categoryEn: 'Electronics',
    price: 249,
    oldPrice: 299,
    badgeAr: 'الأكثر مبيعاً',
    badgeEn: 'BESTSELLER',
    stock: 18,
  },
  {
    id: 'p2',
    nameAr: 'ساعة ذكية Chronos Ultra Smart Watch مقاومة للماء',
    nameEn: 'Chronos Ultra Titanium Smart Watch',
    categoryAr: 'ساعات ذكية',
    categoryEn: 'Smart Watches',
    price: 179,
    oldPrice: 210,
    badgeAr: 'وصل حديثاً',
    badgeEn: 'NEW ARRIVAL',
    stock: 24,
  },
  {
    id: 'p3',
    nameAr: 'لوحة مفاتيح ميكانيكية احترافية RGB Wireless KeyPad',
    nameEn: 'Mechanical Studio RGB Wireless KeyPad',
    categoryAr: 'ملحقات كمبيوتر',
    categoryEn: 'Accessories',
    price: 129,
    badgeAr: 'تقييم 5.0 ★',
    badgeEn: 'TOP RATED ★',
    stock: 12,
  },
  {
    id: 'p4',
    nameAr: 'شاشة محمولة 4K OLED UltraSlim قياس 16 بوصة',
    nameEn: '4K OLED UltraSlim 16" Portable Monitor',
    categoryAr: 'إلكترونيات',
    categoryEn: 'Electronics',
    price: 349,
    oldPrice: 399,
    badgeAr: 'خصم خاص',
    badgeEn: 'SPECIAL DEAL',
    stock: 9,
  },
];

const EcommerceInteractiveDemo: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [viewMode, setViewMode] = useState<'storefront' | 'admin'>('storefront');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [cart, setCart] = useState<Record<string, number>>({ p1: 1, p2: 1 });
  const [checkoutDone, setCheckoutDone] = useState(false);

  const categories = [
    { id: 'ALL', ar: 'كل المنتجات', en: 'All Products' },
    { id: 'Electronics', ar: 'إلكترونيات', en: 'Electronics' },
    { id: 'Smart Watches', ar: 'ساعات ذكية', en: 'Smart Watches' },
    { id: 'Accessories', ar: 'ملحقات كمبيوتر', en: 'Accessories' },
  ];

  const filteredProducts = INITIAL_PRODUCTS.filter(
    (p) => selectedCat === 'ALL' || p.categoryEn === selectedCat
  );

  const addToCart = (id: string) => {
    setCheckoutDone(false);
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const updateQty = (id: string, delta: number) => {
    setCheckoutDone(false);
    setCart((prev) => {
      const nextQty = (prev[id] || 0) + delta;
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: nextQty };
    });
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const prod = INITIAL_PRODUCTS.find((p) => p.id === id);
      return prod ? { product: prod, qty } : null;
    })
    .filter(Boolean) as { product: StoreProduct; qty: number }[];

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const totalCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="rounded-2xl tech-panel border border-cyan-400/30 overflow-hidden shadow-2xl">
      {/* Top Interactive Demo Bar */}
      <div className="bg-[#050D1E] border-b border-cyan-500/25 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-400/15 border border-cyan-400/40 flex items-center justify-center text-[#00F0FF] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-[#00F0FF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isAr
                  ? 'نموذج تجربة تفاعلي حي · LIVE INTERACTIVE DEMO'
                  : 'LIVE INTERACTIVE STOREFRONT DEMO'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {isAr
                ? 'جرب متجر NovaMart وسلة الشراء أو انتقل للوحة إدارة المخزون'
                : 'Experience Customer Storefront Cart & Checkout or Admin Inventory'}
            </h3>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-[#030712] p-1 rounded-xl border border-cyan-500/25 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('storefront')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'storefront'
                ? 'tech-btn-primary text-slate-950'
                : 'text-sky-200/70 hover:text-white'
            }`}
          >
            {isAr ? 'واجهة المتجر والسلة' : 'Customer Storefront'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'admin'
                ? 'tech-btn-primary text-slate-950'
                : 'text-sky-200/70 hover:text-white'
            }`}
          >
            {isAr ? 'لوحة تحكم التاجر (Admin)' : 'Merchant Admin'}
          </button>
        </div>
      </div>

      {viewMode === 'storefront' ? (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Cols: Product Catalog & Filter */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    selectedCat === cat.id
                      ? 'tech-btn-primary text-slate-950 font-bold'
                      : 'bg-[#061022] text-sky-200/75 border border-cyan-500/20 hover:text-white'
                  }`}
                >
                  {isAr ? cat.ar : cat.en}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-[#061022] border border-cyan-500/25 hover:border-[#00F0FF]/60 flex flex-col justify-between space-y-4 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#00F0FF]">{isAr ? p.categoryAr : p.categoryEn}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-[#00FF9D]">
                        {isAr ? p.badgeAr : p.badgeEn}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white line-clamp-2">
                      {isAr ? p.nameAr : p.nameEn}
                    </h4>
                  </div>

                  <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between">
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-lg font-bold text-white" dir="ltr">
                        ${p.price}
                      </span>
                      {p.oldPrice && (
                        <span className="text-xs text-slate-500 line-through" dir="ltr">
                          ${p.oldPrice}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(p.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg tech-btn-primary font-bold text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'أضف للسلة' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 4 Cols: Live Shopping Cart Drawer */}
          <div className="lg:col-span-4 p-5 rounded-xl bg-[#061022] border border-cyan-500/25 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#00F0FF]" />
                  <span>{isAr ? 'سلة التسوق الذكية' : 'Smart Shopping Bag'}</span>
                </div>
                <span className="text-xs font-mono text-[#00FF9D]">{totalCount} items</span>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  {isAr ? 'سلة التسوق فارغة حالياً' : 'Your bag is empty'}
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-lg bg-[#030712] border border-cyan-500/20 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">
                          {isAr ? product.nameAr : product.nameEn}
                        </div>
                        <div className="text-xs font-mono text-[#00FF9D]" dir="ltr">
                          ${product.price * qty}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, -1)}
                          className="w-6 h-6 rounded bg-[#0A172E] text-slate-200 flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center text-white">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(product.id, 1)}
                          className="w-6 h-6 rounded bg-[#0A172E] text-slate-200 flex items-center justify-center hover:bg-slate-700 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-3 border-t border-cyan-500/20">
              <div className="flex items-center justify-between text-sm font-bold text-white">
                <span>{isAr ? 'المجموع الإجمالي' : 'Total Amount'}</span>
                <span className="font-mono text-[#00F0FF] text-base" dir="ltr">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              {checkoutDone ? (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {isAr
                      ? 'تم تأكيد الطلب بنجاح عبر Stripe API!'
                      : 'Payment simulated successfully via Stripe!'}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={() => setCheckoutDone(true)}
                  className="w-full py-3 px-4 rounded-xl tech-btn-primary disabled:opacity-40 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isAr ? 'إتمام الشراء والدفع الآمن' : 'Proceed to Checkout'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Merchant Admin View */
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#061022] border border-cyan-500/25">
              <div className="text-xs font-mono text-sky-200/70">{isAr ? 'مبيعات اليوم' : "Today's Sales"}</div>
              <div className="text-xl font-bold font-mono text-[#00FF9D] mt-1">$4,820.00</div>
              <div className="text-[11px] text-emerald-400 font-mono mt-0.5">+18% vs yesterday</div>
            </div>
            <div className="p-4 rounded-xl bg-[#061022] border border-cyan-500/25">
              <div className="text-xs font-mono text-sky-200/70">{isAr ? 'الطلبات المكتملة' : 'Completed Orders'}</div>
              <div className="text-xl font-bold font-mono text-[#00F0FF] mt-1">38 Orders</div>
              <div className="text-[11px] text-cyan-300 font-mono mt-0.5">100% Fulfilled</div>
            </div>
            <div className="p-4 rounded-xl bg-[#061022] border border-cyan-500/25">
              <div className="text-xs font-mono text-sky-200/70">{isAr ? 'حالة المخزون' : 'Inventory Health'}</div>
              <div className="text-xl font-bold font-mono text-white mt-1">98.4%</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">Automated low-stock alerts</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================================
   3. RESTAURANT DIGITAL MENU & QR ORDER MANAGEMENT (PHOTO-RICH & EASY TO USE)
   ============================================================================ */
interface MenuDish {
  id: string;
  nameAr: string;
  nameEn: string;
  catAr: string;
  catEn: string;
  price: number;
  prepMin: number;
  calories: number;
  imageUrl: string;
  dietTagAr?: string;
  dietTagEn?: string;
  available: boolean;
}

const INITIAL_DISHES: MenuDish[] = [
  {
    id: 'd1',
    nameAr: 'برجر واغيو ترافل مشوي مع جبنة بريفولون',
    nameEn: 'Truffle Wagyu Artisan Smash Burger',
    catAr: 'برجر مشوي',
    catEn: 'Burgers',
    price: 18.5,
    prepMin: 12,
    calories: 680,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    dietTagAr: 'الأكثر طلباً 🔥',
    dietTagEn: 'CHEF PICK 🔥',
    available: true,
  },
  {
    id: 'd2',
    nameAr: 'بيتزا مارغريتا بوراتا إيطالية على الحطب',
    nameEn: 'Margherita Burrata Artisan Woodfired Pizza',
    catAr: 'بيتزا على الحطب',
    catEn: 'Pizza',
    price: 21.0,
    prepMin: 15,
    calories: 740,
    imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80',
    dietTagAr: 'نباتي طازج 🌿',
    dietTagEn: 'VEGETARIAN 🌿',
    available: true,
  },
  {
    id: 'd3',
    nameAr: 'ستيك ريب آي مشوي مع زبدة الأعشاب وإكليل الجبل',
    nameEn: 'Charcoal Ribeye Steak with Garlic Rosemary Butter',
    catAr: 'مشويات وستيك',
    catEn: 'Steaks',
    price: 34.0,
    prepMin: 18,
    calories: 820,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    dietTagAr: 'مشوي فحم 🥩',
    dietTagEn: 'CHARCOAL 🥩',
    available: true,
  },
  {
    id: 'd4',
    nameAr: 'تشيز كيك سان سيباستيان بالفستق والبلجيكي',
    nameEn: 'Pistachio San Sebastian Burnt Cheesecake',
    catAr: 'حلويات ومشروبات',
    catEn: 'Desserts',
    price: 11.5,
    prepMin: 5,
    calories: 450,
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
    dietTagAr: 'حلوى مميزة 🍰',
    dietTagEn: 'DESSERT 🍰',
    available: true,
  },
  {
    id: 'd5',
    nameAr: 'بطاطس مقرمشة بزيت الكمأة وجبنة البارميزان',
    nameEn: 'Crispy Truffle Parmesan Handcut Fries',
    catAr: 'مقبلات وسلطات',
    catEn: 'Appetizers',
    price: 8.0,
    prepMin: 8,
    calories: 380,
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
    dietTagAr: 'مقرمش 🍟',
    dietTagEn: 'CRISPY 🍟',
    available: true,
  },
  {
    id: 'd6',
    nameAr: 'موهيتو التوت البري والنعناع المنعش',
    nameEn: 'Fresh Wild Berry & Mint Sparkling Mojito',
    catAr: 'حلويات ومشروبات',
    catEn: 'Desserts',
    price: 6.5,
    prepMin: 3,
    calories: 120,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    dietTagAr: 'منعش 🍹',
    dietTagEn: 'REFRESHING 🍹',
    available: true,
  },
];

const RestaurantMenuInteractiveDemo: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const [mode, setMode] = useState<'customer' | 'manager'>('customer');
  const [dishes, setDishes] = useState<MenuDish[]>(INITIAL_DISHES);
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [dishSearch, setDishSearch] = useState('');
  const [tableOrder, setTableOrder] = useState<Record<string, number>>({ d1: 1, d2: 1 });
  const [orderSentToKitchen, setOrderSentToKitchen] = useState(false);

  const menuCategories = [
    { id: 'ALL', ar: '🍽️ كل المنيو', en: '🍽️ All Menu' },
    { id: 'Burgers', ar: '🍔 برجر مشوي', en: '🍔 Burgers' },
    { id: 'Pizza', ar: '🍕 بيتزا الحطب', en: '🍕 Pizza' },
    { id: 'Steaks', ar: '🥩 مشويات وستيك', en: '🥩 Steaks' },
    { id: 'Appetizers', ar: '🍟 مقبلات', en: '🍟 Appetizers' },
    { id: 'Desserts', ar: '🍰 حلويات ومشروبات', en: '🍰 Desserts' },
  ];

  const visibleDishes = dishes.filter((d) => {
    const matchesCat = selectedCat === 'ALL' || d.catEn === selectedCat;
    const q = dishSearch.trim().toLowerCase();
    if (!q) return d.available && matchesCat;
    const inName = d.nameAr.toLowerCase().includes(q) || d.nameEn.toLowerCase().includes(q);
    return d.available && matchesCat && inName;
  });

  const addDishToOrder = (id: string) => {
    setOrderSentToKitchen(false);
    setTableOrder((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseDish = (id: string) => {
    setOrderSentToKitchen(false);
    setTableOrder((prev) => {
      const cur = prev[id] || 0;
      if (cur <= 1) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: cur - 1 };
    });
  };

  const removeDishFromOrder = (id: string) => {
    setOrderSentToKitchen(false);
    setTableOrder((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const orderList = Object.entries(tableOrder)
    .map(([id, qty]) => {
      const dish = dishes.find((d) => d.id === id);
      return dish ? { dish, qty } : null;
    })
    .filter(Boolean) as { dish: MenuDish; qty: number }[];

  const orderTotal = orderList.reduce((acc, item) => acc + item.dish.price * item.qty, 0);
  const totalItemCount = orderList.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="rounded-2xl tech-panel border border-amber-500/40 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="bg-[#050D1E] border-b border-cyan-500/25 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5" />
              <span>
                {isAr
                  ? 'منيو رقمي حي وسهل الاستخدام · TOUCH-OPTIMIZED QR MENU'
                  : 'TOUCH-FRIENDLY QR DIGITAL MENU & KITCHEN POS'}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {isAr
                ? 'تصفح أصناف الوجبات بالصور الحقيقية أو أضف لطاولة #08 بلمسة واحدة'
                : 'Browse Photo-Rich Dishes, Table Order Tray & Kitchen Display System'}
            </h3>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-[#030712] p-1 rounded-xl border border-cyan-500/25 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode('customer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'customer'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-sky-200/70 hover:text-white'
            }`}
          >
            {isAr ? 'منيو الزبائن بالصور (QR)' : 'Photo QR Menu'}
          </button>
          <button
            type="button"
            onClick={() => setMode('manager')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mode === 'manager'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'text-sky-200/70 hover:text-white'
            }`}
          >
            {isAr ? 'إدارة المطبخ والأسعار' : 'Kitchen KDS & Admin'}
          </button>
        </div>
      </div>

      {mode === 'customer' ? (
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 8 Cols: Search + Category Pills + Photo-Rich Dishes Grid */}
          <div className="lg:col-span-8 space-y-4">
            {/* Quick Search and Table Indicator */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                <input
                  type="text"
                  value={dishSearch}
                  onChange={(e) => setDishSearch(e.target.value)}
                  placeholder={isAr ? 'ابحث عن صنف، برجر، بيتزا، مشروب...' : 'Search dish, burger, pizza, drink...'}
                  className={`w-full ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 rounded-xl bg-[#030712] border border-cyan-500/25 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400`}
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono shrink-0">
                <QrCode className="w-3.5 h-3.5" />
                <span>{isAr ? 'طاولة رقم #08 · متصل' : 'Table #08 · Live QR'}</span>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {menuCategories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCat(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                    selectedCat === c.id
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-[#061022] text-sky-200/75 border border-cyan-500/20 hover:text-white'
                  }`}
                >
                  {isAr ? c.ar : c.en}
                </button>
              ))}
            </div>

            {/* Dishes Grid with High-Res Photos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visibleDishes.map((dish) => {
                const countInOrder = tableOrder[dish.id] || 0;
                return (
                  <div
                    key={dish.id}
                    className="rounded-xl bg-[#061022] border border-cyan-500/25 hover:border-amber-400/60 overflow-hidden flex flex-col justify-between transition-all group"
                  >
                    {/* Dish Photo Banner */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#030712]">
                      <img
                        src={dish.imageUrl}
                        alt={isAr ? dish.nameAr : dish.nameEn}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#061022] via-transparent to-transparent" />
                      
                      {dish.dietTagAr && (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#030712]/90 backdrop-blur-xs border border-amber-400/40 text-[10px] font-mono text-amber-300 font-bold">
                          {isAr ? dish.dietTagAr : dish.dietTagEn}
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{dish.prepMin} min</span>
                        <span>·</span>
                        <Flame className="w-3 h-3 text-rose-400" />
                        <span>{dish.calories} kcal</span>
                      </div>
                    </div>

                    {/* Dish Info & Easy Add Controls */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="text-[11px] font-mono text-amber-400">
                          {isAr ? dish.catAr : dish.catEn}
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug">
                          {isAr ? dish.nameAr : dish.nameEn}
                        </h4>
                      </div>

                      <div className="pt-2 border-t border-cyan-500/15 flex items-center justify-between gap-2">
                        <span className="text-base font-bold font-mono text-amber-400" dir="ltr">
                          ${dish.price.toFixed(2)}
                        </span>

                        {countInOrder > 0 ? (
                          <div className="flex items-center gap-1.5 bg-[#030712] p-1 rounded-lg border border-amber-400/40">
                            <button
                              type="button"
                              onClick={() => decreaseDish(dish.id)}
                              className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold w-5 text-center text-amber-300">
                              {countInOrder}
                            </span>
                            <button
                              type="button"
                              onClick={() => addDishToOrder(dish.id)}
                              className="w-6 h-6 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center cursor-pointer"
                            >
                              <Plus className="w-3 h-3 font-bold" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addDishToOrder(dish.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{isAr ? 'طلب' : 'Add'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 4 Cols: Live Table Order Summary & Kitchen Sender */}
          <div className="lg:col-span-4 p-5 rounded-xl bg-[#061022] border border-cyan-500/25 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'فاتورة طاولة #08 المباشرة' : 'Table #08 Bill Tray'}</span>
                </div>
                <span className="text-xs font-mono text-[#00FF9D]">{totalItemCount} {isAr ? 'أطباق' : 'dishes'}</span>
              </div>

              {orderList.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                  <div className="text-2xl">🍽️</div>
                  <div>{isAr ? 'لم تختر أي وجبة بعد — اضغط (+) لإضافة وجباتك المفضلة' : 'No items yet — Tap (+) on any dish'}</div>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {orderList.map(({ dish, qty }) => (
                    <div
                      key={dish.id}
                      className="p-2.5 rounded-lg bg-[#030712] border border-cyan-500/20 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-white truncate">
                          {qty}x {isAr ? dish.nameAr : dish.nameEn}
                        </div>
                        <div className="text-[11px] font-mono text-amber-400" dir="ltr">
                          ${(dish.price * qty).toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => decreaseDish(dish.id)}
                          className="w-5 h-5 rounded bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700 cursor-pointer text-xs"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold w-4 text-center text-white">{qty}</span>
                        <button
                          type="button"
                          onClick={() => addDishToOrder(dish.id)}
                          className="w-5 h-5 rounded bg-amber-400 text-slate-950 flex items-center justify-center hover:bg-amber-300 cursor-pointer text-xs font-bold"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeDishFromOrder(dish.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-3 border-t border-cyan-500/20">
              <div className="flex items-center justify-between text-sm font-bold text-white">
                <span>{isAr ? 'المجموع النهائي' : 'Table Total'}</span>
                <span className="font-mono text-amber-400 text-base" dir="ltr">
                  ${orderTotal.toFixed(2)}
                </span>
              </div>

              {orderSentToKitchen ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-bounce-subtle">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00FF9D]" />
                  <span>
                    {isAr
                      ? 'تم إرسال الطلب فوراً إلى شاشة المطبخ (KDS) وجاري التحضير!'
                      : 'Order sent to live Kitchen Display (KDS)! Preparing now.'}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={orderList.length === 0}
                  onClick={() => setOrderSentToKitchen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <ChefHat className="w-4 h-4" />
                  <span>
                    {isAr ? 'إرسال الطلب إلى المطبخ فوراً 🚀' : 'Send Order to Kitchen 🚀'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Kitchen KDS Manager View */
        <div className="p-4 sm:p-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#061022] border border-cyan-500/25 flex items-center justify-between text-xs font-mono">
            <span className="text-[#00FF9D]">● KITCHEN DISPLAY SYSTEM (KDS) ACTIVE</span>
            <span className="text-amber-400">TABLE #08 · LIVE ORDERS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="p-3.5 rounded-xl bg-[#030712] border border-cyan-500/20 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{isAr ? dish.nameAr : dish.nameEn}</div>
                  <div className="text-xs font-mono text-amber-400 mt-0.5">${dish.price.toFixed(2)}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  AVAILABLE
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
