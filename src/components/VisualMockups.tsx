import React from 'react';
import {
  ExternalLink,
  Lock,
  Sparkles,
  ShoppingBag,
  UtensilsCrossed,
  QrCode,
  ChefHat,
  Clock,
  Flame,
  CheckCircle2,
  Heart,
  Search,
  BookOpen,
  GraduationCap,
  Users,
  Award,
  Play,
  Monitor,
} from 'lucide-react';

/* ============================================================================
   0. FULL-STACK DEVELOPER HERO ILLUSTRATION (Pure Visual Artwork for Hero)
   ============================================================================ */
export const FullStackDeveloperHeroVisual: React.FC<{ isAr?: boolean }> = ({
  isAr = true,
}) => {
  return (
    <div className="relative w-full rounded-2xl tech-panel overflow-hidden p-3 sm:p-5 flex flex-col justify-between select-none border border-cyan-400/30 shadow-[0_0_40px_rgba(0,240,255,0.12)]">
      {/* Subtle Ambient Aura */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-emerald-500/12 blur-3xl" />

      {/* Crisp Vector Illustration of a Full-Stack Web Developer Architecture & Workstation */}
      <div className="relative w-full aspect-[4/3] rounded-xl bg-[#040917] border border-cyan-500/20 overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 640 480"
          className="w-full h-full object-contain"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Full-Stack Web Developer Illustration"
        >
          <defs>
            <linearGradient id="fsBg" x1="0" y1="0" x2="640" y2="480" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#040917" />
              <stop offset="50%" stopColor="#071229" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>
            <linearGradient id="cyanGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="emeraldGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00FF9D" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="screenGrad" x1="140" y1="90" x2="500" y2="330" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0B1936" />
              <stop offset="100%" stopColor="#050C1D" />
            </linearGradient>
            <radialGradient id="centerAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#2563EB" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background & Perspective Tech Grid */}
          <rect width="640" height="480" fill="url(#fsBg)" />
          <circle cx="320" cy="240" r="230" fill="url(#centerAura)" />

          {/* Subtle Isometric Grid Lines */}
          <g stroke="#38BDF8" strokeOpacity="0.08" strokeWidth="1">
            <line x1="0" y1="80" x2="640" y2="80" />
            <line x1="0" y1="160" x2="640" y2="160" />
            <line x1="0" y1="240" x2="640" y2="240" />
            <line x1="0" y1="320" x2="640" y2="320" />
            <line x1="0" y1="400" x2="640" y2="400" />
            <line x1="106" y1="0" x2="106" y2="480" />
            <line x1="213" y1="0" x2="213" y2="480" />
            <line x1="320" y1="0" x2="320" y2="480" />
            <line x1="426" y1="0" x2="426" y2="480" />
            <line x1="533" y1="0" x2="533" y2="480" />
          </g>

          {/* Connecting Data Flow Lines (Frontend <-> Core IDE <-> Backend & DB) */}
          <path
            d="M135 125 L210 165"
            stroke="#00F0FF"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeOpacity="0.7"
          />
          <path
            d="M505 125 L430 165"
            stroke="#00FF9D"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeOpacity="0.7"
          />
          <path
            d="M140 355 L210 305"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeOpacity="0.7"
          />
          <path
            d="M500 355 L430 305"
            stroke="#00FF9D"
            strokeWidth="2"
            strokeDasharray="5 5"
            strokeOpacity="0.7"
          />

          {/* ==================== CENTRAL DEVELOPER WORKSTATION / IDE ==================== */}
          {/* Laptop Base Shadow */}
          <ellipse cx="320" cy="378" rx="185" ry="14" fill="#00F0FF" fillOpacity="0.14" />

          {/* Main Monitor / IDE Frame */}
          <rect
            x="160"
            y="108"
            width="320"
            height="224"
            rx="16"
            fill="url(#screenGrad)"
            stroke="url(#cyanGlow)"
            strokeWidth="2.5"
          />

          {/* IDE Window Top Bar */}
          <path
            d="M162 124 C162 115, 169 110, 176 110 H464 C471 110, 478 115, 478 124 V140 H162 V124 Z"
            fill="#061024"
          />
          <line x1="160" y1="140" x2="480" y2="140" stroke="#00F0FF" strokeOpacity="0.25" />
          <circle cx="180" cy="125" r="4.5" fill="#F43F5E" />
          <circle cx="195" cy="125" r="4.5" fill="#FBBF24" />
          <circle cx="210" cy="125" r="4.5" fill="#00FF9D" />
          <rect x="255" y="119" width="130" height="12" rx="6" fill="#0D1F40" />
          <text
            x="320"
            y="128"
            textAnchor="middle"
            fill="#38BDF8"
            fontFamily="JetBrains Mono, monospace"
            fontSize="8.5"
            fontWeight="700"
          >
            fullstack-app.tsx
          </text>

          {/* Left Sidebar Inside IDE */}
          <rect x="162" y="141" width="46" height="189" fill="#050D1F" opacity="0.85" />
          <line x1="208" y1="140" x2="208" y2="330" stroke="#00F0FF" strokeOpacity="0.18" />
          <rect x="172" y="156" width="26" height="6" rx="3" fill="#00F0FF" fillOpacity="0.6" />
          <rect x="172" y="170" width="20" height="6" rx="3" fill="#38BDF8" fillOpacity="0.35" />
          <rect x="172" y="184" width="24" height="6" rx="3" fill="#00FF9D" fillOpacity="0.5" />
          <rect x="172" y="198" width="18" height="6" rx="3" fill="#38BDF8" fillOpacity="0.35" />
          <rect x="172" y="212" width="22" height="6" rx="3" fill="#818CF8" fillOpacity="0.45" />

          {/* Clean Visual Code Bars Inside IDE */}
          <g transform="translate(224, 156)">
            {/* Code block 1 */}
            <rect x="0" y="0" width="48" height="8" rx="4" fill="#00F0FF" />
            <rect x="56" y="0" width="84" height="8" rx="4" fill="#E0F2FE" fillOpacity="0.85" />
            <rect x="148" y="0" width="36" height="8" rx="4" fill="#00FF9D" />

            {/* Code block 2 */}
            <rect x="16" y="18" width="64" height="8" rx="4" fill="#38BDF8" fillOpacity="0.8" />
            <rect x="88" y="18" width="105" height="8" rx="4" fill="#818CF8" fillOpacity="0.75" />

            {/* Code block 3 */}
            <rect x="32" y="36" width="92" height="8" rx="4" fill="#00FF9D" fillOpacity="0.85" />
            <rect x="132" y="36" width="52" height="8" rx="4" fill="#FBBF24" fillOpacity="0.85" />

            {/* Code block 4 */}
            <rect x="32" y="54" width="56" height="8" rx="4" fill="#00F0FF" fillOpacity="0.7" />
            <rect x="96" y="54" width="76" height="8" rx="4" fill="#E0F2FE" fillOpacity="0.6" />

            {/* Code block 5 */}
            <rect x="16" y="72" width="40" height="8" rx="4" fill="#38BDF8" fillOpacity="0.7" />
            <rect x="0" y="90" width="28" height="8" rx="4" fill="#00F0FF" />
          </g>

          {/* Glowing Center Code Emblem Badge Overlapping Screen */}
          <g transform="translate(362, 232)">
            <rect
              x="0"
              y="0"
              width="96"
              height="76"
              rx="14"
              fill="#07152E"
              stroke="#00F0FF"
              strokeWidth="2"
            />
            <text
              x="48"
              y="47"
              textAnchor="middle"
              fill="#00F0FF"
              fontFamily="JetBrains Mono, monospace"
              fontSize="28"
              fontWeight="800"
            >
              {'</>'}
            </text>
          </g>

          {/* Laptop Sleek Metallic Base */}
          <path
            d="M124 334 H516 L540 356 C544 360, 540 366, 532 366 H108 C100 366, 96 360, 100 356 L124 334 Z"
            fill="#0D1F40"
            stroke="#00F0FF"
            strokeWidth="2"
          />
          <rect x="275" y="334" width="90" height="6" rx="3" fill="#00F0FF" />

          {/* ==================== TOP-LEFT NODE: FRONTEND UI/UX ==================== */}
          <g transform="translate(28, 42)">
            <rect
              x="0"
              y="0"
              width="148"
              height="92"
              rx="14"
              fill="#08152E"
              stroke="#00F0FF"
              strokeWidth="2"
            />
            <circle cx="26" cy="28" r="14" fill="#00F0FF" fillOpacity="0.15" />
            {/* React-style Atom Orbit */}
            <ellipse cx="26" cy="28" rx="10" ry="4" stroke="#00F0FF" strokeWidth="1.5" transform="rotate(30 26 28)" />
            <ellipse cx="26" cy="28" rx="10" ry="4" stroke="#00F0FF" strokeWidth="1.5" transform="rotate(-30 26 28)" />
            <circle cx="26" cy="28" r="2.5" fill="#00F0FF" />
            <text
              x="48"
              y="25"
              fill="#FFFFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontSize="12"
              fontWeight="800"
            >
              Frontend UI
            </text>
            <text
              x="48"
              y="39"
              fill="#00F0FF"
              fontFamily="JetBrains Mono, monospace"
              fontSize="9.5"
              fontWeight="600"
            >
              React · Next.js
            </text>
            {/* Mini UI preview bars */}
            <rect x="14" y="54" width="54" height="24" rx="5" fill="#0D2247" stroke="#38BDF8" strokeOpacity="0.4" />
            <rect x="76" y="54" width="58" height="10" rx="3" fill="#00F0FF" fillOpacity="0.35" />
            <rect x="76" y="68" width="42" height="10" rx="3" fill="#00FF9D" fillOpacity="0.35" />
          </g>

          {/* ==================== TOP-RIGHT NODE: BACKEND & APIs ==================== */}
          <g transform="translate(464, 42)">
            <rect
              x="0"
              y="0"
              width="148"
              height="92"
              rx="14"
              fill="#08152E"
              stroke="#00FF9D"
              strokeWidth="2"
            />
            <circle cx="26" cy="28" r="14" fill="#00FF9D" fillOpacity="0.15" />
            <text
              x="26"
              y="32"
              textAnchor="middle"
              fill="#00FF9D"
              fontFamily="JetBrains Mono, monospace"
              fontSize="11"
              fontWeight="800"
            >
              API
            </text>
            <text
              x="48"
              y="25"
              fill="#FFFFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontSize="12"
              fontWeight="800"
            >
              Backend Core
            </text>
            <text
              x="48"
              y="39"
              fill="#00FF9D"
              fontFamily="JetBrains Mono, monospace"
              fontSize="9.5"
              fontWeight="600"
            >
              Node.js · REST
            </text>
            {/* Server Status Bars */}
            <rect x="14" y="55" width="120" height="9" rx="4.5" fill="#0D2247" />
            <circle cx="22" cy="59.5" r="2.5" fill="#00FF9D" />
            <rect x="30" y="57.5" width="68" height="4" rx="2" fill="#00FF9D" fillOpacity="0.7" />
            <rect x="14" y="69" width="120" height="9" rx="4.5" fill="#0D2247" />
            <circle cx="22" cy="73.5" r="2.5" fill="#00F0FF" />
            <rect x="30" y="71.5" width="52" height="4" rx="2" fill="#00F0FF" fillOpacity="0.7" />
          </g>

          {/* ==================== BOTTOM-LEFT NODE: RESPONSIVE MOBILE & WEB ==================== */}
          <g transform="translate(36, 336)">
            <rect
              x="0"
              y="0"
              width="136"
              height="74"
              rx="14"
              fill="#08152E"
              stroke="#38BDF8"
              strokeWidth="1.8"
            />
            {/* Mobile Device Icon */}
            <rect x="16" y="15" width="24" height="44" rx="5" fill="#0D2247" stroke="#00F0FF" strokeWidth="1.5" />
            <line x1="25" y1="53" x2="31" y2="53" stroke="#00FF9D" strokeWidth="2" strokeLinecap="round" />
            <text
              x="50"
              y="33"
              fill="#FFFFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontSize="11.5"
              fontWeight="800"
            >
              Responsive
            </text>
            <text
              x="50"
              y="48"
              fill="#38BDF8"
              fontFamily="JetBrains Mono, monospace"
              fontSize="9.5"
              fontWeight="600"
            >
              Mobile & Web
            </text>
          </g>

          {/* ==================== BOTTOM-RIGHT NODE: DATABASE & CLOUD ==================== */}
          <g transform="translate(468, 336)">
            <rect
              x="0"
              y="0"
              width="136"
              height="74"
              rx="14"
              fill="#08152E"
              stroke="#00FF9D"
              strokeWidth="1.8"
            />
            {/* Database Cylinders */}
            <ellipse cx="28" cy="23" rx="13" ry="5" fill="#0D2247" stroke="#00FF9D" strokeWidth="1.5" />
            <path d="M15 23 V37 C15 40, 41 40, 41 37 V23" fill="#0D2247" stroke="#00FF9D" strokeWidth="1.5" />
            <path d="M15 37 V50 C15 53, 41 53, 41 50 V37" fill="#0D2247" stroke="#00FF9D" strokeWidth="1.5" />
            <text
              x="50"
              y="33"
              fill="#FFFFFF"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontSize="11.5"
              fontWeight="800"
            >
              Databases
            </text>
            <text
              x="50"
              y="48"
              fill="#00FF9D"
              fontFamily="JetBrains Mono, monospace"
              fontSize="9.5"
              fontWeight="600"
            >
              SQL · Cloud
            </text>
          </g>

          {/* Bottom Engineering Badge */}
          <rect
            x="170"
            y="424"
            width="300"
            height="32"
            rx="16"
            fill="#07132B"
            stroke="#00F0FF"
            strokeOpacity="0.4"
          />
          <circle cx="192" cy="440" r="4.5" fill="#00FF9D" />
          <text
            x="328"
            y="444"
            textAnchor="middle"
            fill="#E0F2FE"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10.5"
            fontWeight="700"
          >
            FULL-STACK WEB DEVELOPER
          </text>
        </svg>
      </div>

      {/* Clean Compact Caption Strip */}
      <div className="pt-3 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FF9D] shadow-[0_0_8px_#00FF9D]" />
          <span className="font-bold text-white">
            {isAr ? 'تطوير ويب متكامل (Full-Stack)' : 'Full-Stack Web Engineering'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#00F0FF]" dir="ltr">
          Frontend · Backend · DB
        </span>
      </div>
    </div>
  );
};

/* ============================================================================
   1. RAWDATI KINDERGARTEN & EARLY LEARNING MOCKUP (rawdati-website.vercel.app)
   ============================================================================ */
export const RawdatiPlatformMockup: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => {
  return (
    <div
      className={`w-full h-full bg-[#070D1E] text-slate-100 flex flex-col justify-between overflow-hidden select-none border border-cyan-500/20 relative font-sans ${className}`}
      dir="rtl"
    >
      {/* Playful Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Browser Top Window Bar (Always LTR for browser chrome) */}
      <div
        className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#040814] border-b border-slate-800/80 flex items-center justify-between gap-2 text-xs shrink-0"
        dir="ltr"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500/90" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400/90" />
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-400/90" />
        </div>

        {/* URL Pill */}
        <div className="flex-1 max-w-xs mx-auto px-2.5 py-0.5 rounded bg-[#0B132B] border border-cyan-500/30 text-[10px] font-mono text-sky-300 flex items-center justify-center gap-1 truncate">
          <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
          <span className="truncate">rawdati-website.vercel.app</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold">
          <span>LIVE</span>
        </div>
      </div>

      {/* Website Navigation Header */}
      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0B132B]/80 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm shadow-sm shrink-0">
            ☀️
          </div>
          <span className="font-extrabold text-xs sm:text-sm text-white truncate">
            روضتي · Rawdati
          </span>
        </div>

        <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[10px] shadow-sm whitespace-nowrap">
          التسجيل للعام الجديد 🚀
        </div>
      </div>

      {/* Hero Showcase Body */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between gap-2">
        <div className="space-y-1">
          <h3 className="text-xs sm:text-base lg:text-lg font-extrabold text-white leading-snug truncate">
            روضتي · بيئة تعليمية وتربوية ملهمة لطفلك
          </h3>
          <p className="hidden sm:block text-[11px] text-slate-300 line-clamp-1">
            منصة تعليمية متكاملة تجمع بين اللعب التفاعلي ومناهج منتسوري الحديثة.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          <div className="p-1.5 sm:p-2 rounded-lg bg-[#0F1A36]/90 border border-rose-500/30 flex flex-col items-center sm:items-start text-center sm:text-right gap-1">
            <span className="text-sm sm:text-base">🎨</span>
            <div className="text-[9px] sm:text-[11px] font-bold text-white truncate w-full">فنون وإبداع</div>
          </div>

          <div className="p-1.5 sm:p-2 rounded-lg bg-[#0F1A36]/90 border border-cyan-500/30 flex flex-col items-center sm:items-start text-center sm:text-right gap-1">
            <span className="text-sm sm:text-base">📚</span>
            <div className="text-[9px] sm:text-[11px] font-bold text-white truncate w-full">لغات وقراءة</div>
          </div>

          <div className="p-1.5 sm:p-2 rounded-lg bg-[#0F1A36]/90 border border-emerald-500/30 flex flex-col items-center sm:items-start text-center sm:text-right gap-1">
            <span className="text-sm sm:text-base">🧩</span>
            <div className="text-[9px] sm:text-[11px] font-bold text-white truncate w-full">ذكاء و STEM</div>
          </div>

          <div className="p-1.5 sm:p-2 rounded-lg bg-[#0F1A36]/90 border border-amber-500/30 flex flex-col items-center sm:items-start text-center sm:text-right gap-1">
            <span className="text-sm sm:text-base">⚽</span>
            <div className="text-[9px] sm:text-[11px] font-bold text-white truncate w-full">أنشطة ومرح</div>
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div className="hidden sm:flex pt-1.5 border-t border-slate-800/80 items-center justify-between gap-2 text-[10px] text-slate-400">
          <span className="text-emerald-400 font-bold">+500 طفل مسجل</span>
          <span className="text-cyan-300 font-mono" dir="ltr">
            rawdati-website.vercel.app
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. RAWDATI PARENT PORTAL MOCKUP (Diary & Schedule)
   ============================================================================ */
export const RawdatiPortalMockup: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => {
  return (
    <div
      className={`w-full h-full min-h-[260px] bg-[#070D1E] text-slate-100 flex flex-col justify-between overflow-hidden select-none border border-cyan-500/20 relative font-sans ${className}`}
      dir="rtl"
    >
      {/* Top Chrome */}
      <div
        className="px-3.5 py-2 bg-[#040814] border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs"
        dir="ltr"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
        </div>
        <div className="text-[11px] font-mono text-cyan-300">
          Rawdati Parent Communication Portal · Live Activity Diary
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Child Header Card */}
        <div className="p-3 rounded-xl bg-[#0E172E] border border-cyan-500/25 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xl shrink-0">
              👦
            </div>
            <div>
              <div className="text-xs font-bold text-white">الطفل: يوسف مصطفى الجبالي</div>
              <div className="text-[10px] text-cyan-300 font-mono">فئة الروضة الثانية (KG2 - صف النجوم)</div>
            </div>
          </div>
          <div className="text-left font-mono" dir="ltr">
            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
              PRESENT (8:15 AM)
            </span>
          </div>
        </div>

        {/* 3 Activity Items */}
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg bg-[#0B1328] border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🎨</span>
              <div className="text-xs text-white font-medium">ورشة الرسم بالألوان المائية (شجرة العائلة)</div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">مكتمل ✓</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0B1328] border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🧩</span>
              <div className="text-xs text-white font-medium">تعلّم الأشكال الهندسية وتركيب المكعبات الذكية</div>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">مكتمل ✓</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#0B1328] border border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🥗</span>
              <div className="text-xs text-white font-medium">وجبة الغداء الصحية: سلطة فواكه مع الحليب والعسل</div>
            </div>
            <span className="text-[10px] font-mono text-amber-400">تناولها كاملة</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>يوميات الصور: تم التقاط 6 صور للطفل اليوم</span>
          <span className="text-cyan-400 font-bold cursor-pointer">عرض ألبوم الصور 📸</span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. E-COMMERCE STOREFRONT MOCKUP (NovaMart)
   ============================================================================ */
export const EcommerceStoreMockup: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => {
  return (
    <div
      className={`w-full h-full min-h-[260px] bg-[#070912] text-slate-100 flex flex-col justify-between overflow-hidden select-none border border-cyan-500/20 relative font-sans ${className}`}
      dir="ltr"
    >
      {/* Top Browser Chrome */}
      <div className="px-3.5 py-2 bg-[#04060E] border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
        </div>
        <div className="px-3 py-1 rounded bg-[#0B1020] border border-slate-800 text-[11px] font-mono text-cyan-300">
          novamart.store/electronics · Verified SSL
        </div>
        <div className="text-[11px] font-mono text-[#00FF9D] font-bold">LIVE CART (3)</div>
      </div>

      {/* Store Navigation Bar */}
      <div className="px-4 py-2.5 bg-[#0C1224] border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-cyan-400/20 border border-cyan-400 text-cyan-400 flex items-center justify-center text-xs font-black">
            N
          </div>
          <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight">
            NOVAMART // STORE
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#070912] border border-slate-800 text-xs text-slate-400 w-52">
          <Search className="w-3.5 h-3.5" />
          <span className="text-[11px]">Search gadgets...</span>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>$428.00</span>
        </div>
      </div>

      {/* Store Showcase Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-cyan-950/70 border border-cyan-500/30 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold">
              FLASH SALE · 20% OFF
            </span>
            <div className="text-sm sm:text-base font-bold text-white">Next-Gen Audio & Smart Devices</div>
            <div className="text-[11px] text-slate-300">Stripe Checkout · Express Global Delivery</div>
          </div>
          <div className="hidden sm:block text-3xl">🎧</div>
        </div>

        {/* 3 Product Cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-lg bg-[#0B1020] border border-slate-800 flex flex-col justify-between space-y-2">
            <div className="text-[10px] text-cyan-400 font-mono font-bold">AUDIO</div>
            <div className="text-xs font-bold text-white truncate">AeroPods Max ANC</div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white font-bold">$249</span>
              <span className="text-[10px] text-emerald-400 font-bold">+ ADD</span>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-lg bg-[#0B1020] border border-slate-800 flex flex-col justify-between space-y-2">
            <div className="text-[10px] text-cyan-400 font-mono font-bold">WATCH</div>
            <div className="text-xs font-bold text-white truncate">Chronos Titanium</div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white font-bold">$179</span>
              <span className="text-[10px] text-emerald-400 font-bold">+ ADD</span>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-lg bg-[#0B1020] border border-slate-800 flex flex-col justify-between space-y-2">
            <div className="text-[10px] text-cyan-400 font-mono font-bold">KEYBOARD</div>
            <div className="text-xs font-bold text-white truncate">RGB Wireless Pro</div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white font-bold">$129</span>
              <span className="text-[10px] text-emerald-400 font-bold">+ ADD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. E-COMMERCE ADMIN MOCKUP (Merchant Analytics)
   ============================================================================ */
export const EcommerceAdminMockup: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => {
  return (
    <div
      className={`w-full h-full min-h-[260px] bg-[#070912] text-slate-100 flex flex-col justify-between overflow-hidden select-none border border-cyan-500/20 relative font-sans ${className}`}
      dir="ltr"
    >
      <div className="px-3.5 py-2 bg-[#04060E] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-cyan-400 font-bold">NOVAMART ADMIN CMS // ANALYTICS</span>
        <span className="text-emerald-400">DATABASE: POSTGRESQL · LIVE</span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-[#0B1020] border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">TODAY REVENUE</div>
            <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">$8,420.00</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0B1020] border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">FULFILLED ORDERS</div>
            <div className="text-base sm:text-lg font-bold font-mono text-cyan-400">142 Orders</div>
          </div>
          <div className="p-3 rounded-lg bg-[#0B1020] border border-slate-800">
            <div className="text-[10px] text-slate-400 font-mono">STRIPE CHECKOUT</div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-400">99.8% Success</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[#0B1020] border border-slate-800 text-xs font-mono space-y-2">
          <div className="text-slate-400 text-[10px]">RECENT FULFILLMENTS</div>
          <div className="flex items-center justify-between text-slate-200">
            <span>Order #NV-40291 (AeroPods Max)</span>
            <span className="text-emerald-400">SHIPPED · $249</span>
          </div>
          <div className="flex items-center justify-between text-slate-200">
            <span>Order #NV-40292 (Chronos Ultra)</span>
            <span className="text-emerald-400">SHIPPED · $179</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   5. RESTAURANT DIGITAL MENU MOCKUP (GustoQR)
   ============================================================================ */
export const RestaurantMenuMockup: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => {
  return (
    <div
      className={`w-full h-full min-h-[260px] bg-[#0A0D16] text-slate-100 flex flex-col justify-between overflow-hidden select-none border border-amber-500/25 relative font-sans ${className}`}
      dir="rtl"
    >
      {/* Top Chrome */}
      <div
        className="px-3.5 py-2 bg-[#05070D] border-b border-slate-800 flex items-center justify-between text-xs"
        dir="ltr"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
        </div>
        <div className="text-[11px] font-mono text-amber-400 font-bold">
          TABLE #08 · LIVE QR ORDERING MENU
        </div>
      </div>

      {/* Header Bar */}
      <div className="px-4 py-2.5 bg-[#0F1424] border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍔</span>
          <span className="font-extrabold text-xs sm:text-sm text-white">
            GUSTO // QR MENU
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
          <QrCode className="w-3.5 h-3.5" />
          <span>طاولة رقم #08</span>
        </div>
        <div className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs">
          الفاتورة ($47.50)
        </div>
      </div>

      {/* Menu Dishes Showcase */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#12192E] border border-slate-800 flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80"
              alt="Wagyu Burger"
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">برجر واغيو ترافل مشوي</div>
              <div className="text-[10px] text-amber-400 font-mono font-bold">$18.50 · 680 kcal</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#12192E] border border-slate-800 flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=200&q=80"
              alt="Burrata Pizza"
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">بيتزا مارغريتا بوراتا</div>
              <div className="text-[10px] text-amber-400 font-mono font-bold">$21.00 · حطب 🍕</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#12192E] border border-slate-800 flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=200&q=80"
              alt="Ribeye Steak"
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">ستيك ريب آي مشوي</div>
              <div className="text-[10px] text-amber-400 font-mono font-bold">$34.00 · أعشاب 🥩</div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#12192E] border border-slate-800 flex items-center gap-2.5">
            <img
              src="https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=200&q=80"
              alt="Cheesecake"
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">تشيز كيك سان سيباستيان</div>
              <div className="text-[10px] text-amber-400 font-mono font-bold">$11.50 · فستق 🍰</div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400 font-bold">● متصل بشاشة المطبخ (Live KDS)</span>
          <span className="text-amber-400 font-bold">إرسال مباشر بدون انتظار نادل</span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   6. RESTAURANT KITCHEN DISPLAY MOCKUP (KDS)
   ============================================================================ */
export const RestaurantKitchenMockup: React.FC<{ className?: string }> = ({
  className = 'w-full h-full',
}) => {
  return (
    <div
      className={`w-full h-full min-h-[260px] bg-[#0A0D16] text-slate-100 flex flex-col justify-between overflow-hidden select-none border border-amber-500/25 relative font-sans ${className}`}
      dir="ltr"
    >
      <div className="px-3.5 py-2 bg-[#05070D] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <span className="text-amber-400 font-bold">GUSTO KITCHEN DISPLAY SYSTEM (KDS)</span>
        <span className="text-emerald-400">WEBSOCKET REALTIME ACTIVE</span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-[#12192E] border border-amber-400/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-amber-400">TABLE #08</span>
              <span className="text-rose-400">PREP: 04:12</span>
            </div>
            <div className="text-xs font-bold text-white">2x Wagyu Truffle Burger</div>
            <div className="text-xs font-bold text-white">1x Burrata Artisan Pizza</div>
            <div className="text-[10px] text-emerald-400 font-mono">STATUS: ON GRILL</div>
          </div>

          <div className="p-3 rounded-xl bg-[#12192E] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-cyan-400">TABLE #12</span>
              <span className="text-amber-400">PREP: 01:45</span>
            </div>
            <div className="text-xs font-bold text-white">1x Ribeye Charcoal Steak</div>
            <div className="text-xs font-bold text-white">1x Truffle Handcut Fries</div>
            <div className="text-[10px] text-cyan-300 font-mono">STATUS: PLATING</div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono text-center">
          Instant synchronization between table QR scans and kitchen preparation displays.
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   7. MAIN UNIVERSAL PROJECT MEDIA RENDERER
   ============================================================================ */
export const ProjectMediaRenderer: React.FC<{
  src?: string;
  title: string;
  className?: string;
}> = ({ src, title, className = 'w-full h-full object-cover' }) => {
  const [imgError, setImgError] = React.useState(false);

  if (!src || imgError) {
    return <RawdatiPlatformMockup className={className} />;
  }

  // Built-in device mockups with zero overlapping text
  if (src === 'builtin://rawdati-cover') {
    return <RawdatiPlatformMockup className={className} />;
  }
  if (src === 'builtin://rawdati-portal') {
    return <RawdatiPortalMockup className={className} />;
  }
  if (src === 'builtin://ecommerce-store') {
    return <EcommerceStoreMockup className={className} />;
  }
  if (src === 'builtin://ecommerce-admin') {
    return <EcommerceAdminMockup className={className} />;
  }
  if (src === 'builtin://restaurant-menu') {
    return <RestaurantMenuMockup className={className} />;
  }
  if (src === 'builtin://restaurant-kds') {
    return <RestaurantKitchenMockup className={className} />;
  }

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);
  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        controls
        playsInline
        muted
        loop
      />
    );
  }

  return (
    <img
      src={src}
      alt={title}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={className}
    />
  );
};
