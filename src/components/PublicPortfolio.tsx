import React, { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  Search,
  Terminal,
  Layers,
  Cpu,
  Globe,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  ExternalLink,
  CheckCircle2,
  Play,
  Phone,
  Code2,
} from 'lucide-react';
import { DeveloperSettings, Project } from '../types';
import { ProjectMediaRenderer, FullStackDeveloperHeroVisual } from './VisualMockups';
import { FloatingWhatsAppButton } from './FloatingWhatsAppButton';
import {
  useI18n,
  LanguageSwitcher,
  getLocalizedProfile,
  ARABIC_PROJECT_TRANSLATIONS,
} from '../i18n';

interface PublicPortfolioProps {
  settings: DeveloperSettings;
  projects: Project[];
  loading: boolean;
  onSelectProject: (slugOrId: string) => void;
  onOpenAdmin: () => void;
  isAuthenticated: boolean;
}

export const PublicPortfolio: React.FC<PublicPortfolioProps> = ({
  settings,
  projects,
  loading,
  onSelectProject,
  onOpenAdmin,
}) => {
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const profile = useMemo(() => getLocalizedProfile(settings, lang), [settings, lang]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const localizedProjects = useMemo(() => {
    if (!isAr) return projects;
    return projects.map((p) => {
      const tr = ARABIC_PROJECT_TRANSLATIONS[p.slug];
      if (!tr) return p;
      return {
        ...p,
        title: tr.title,
        subtitle: tr.subtitle,
        category: tr.category,
        summary: tr.summary,
        role: tr.role,
        client: tr.client || p.client,
        timeline: tr.timeline || p.timeline,
        description: tr.description || p.description,
        metrics: tr.metrics || p.metrics,
      };
    });
  }, [projects, isAr]);

  const categories = useMemo(() => {
    const cats = new Set<string>(['All']);
    localizedProjects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [localizedProjects]);

  const filteredProjects = useMemo(() => {
    return localizedProjects.filter((proj) => {
      const matchesCategory =
        selectedCategory === 'All' || proj.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;
      const inTitle = proj.title.toLowerCase().includes(q);
      const inSummary = proj.summary.toLowerCase().includes(q);
      const inTech = proj.techStack.some((t) => t.toLowerCase().includes(q));
      const inClient = proj.client.toLowerCase().includes(q);
      return matchesCategory && (inTitle || inSummary || inTech || inClient);
    });
  }, [localizedProjects, selectedCategory, searchQuery]);

  const phoneRaw = (settings.whatsappNumber || '+970595845086').trim();
  const phoneDisplay = phoneRaw.startsWith('+') ? phoneRaw : `+${phoneRaw}`;
  const cleanWhatsappDigits = phoneRaw.replace(/[^0-9]/g, '') || '970595845086';

  return (
    <div className="min-h-screen tech-canvas text-sky-50 flex flex-col overflow-x-hidden selection:bg-cyan-400 selection:text-slate-950">
      {/* Responsive Sticky Technical Header */}
      <header className="sticky top-0 z-40 tech-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4">
          {/* Zone 1: Brand Wordmark & Role */}
          <a
            href="#top"
            className="flex items-center gap-2.5 min-w-0 shrink-0 group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-cyan-400/20 via-sky-500/15 to-blue-600/25 border border-cyan-400/40 shadow-[0_0_16px_rgba(0,240,255,0.2)] flex items-center justify-center text-[#00F0FF] shrink-0 group-hover:border-cyan-300 transition-all">
              <Code2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="truncate">
              <div className="text-sm sm:text-base font-bold tracking-tight text-white truncate">
                {profile.fullName}
              </div>
              <div className="text-[10px] sm:text-[11px] text-[#00F0FF] truncate" dir="ltr">
                Full-Stack Web Developer
              </div>
            </div>
          </a>

          {/* Zone 2: Desktop & Laptop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-sky-100/80">
            <a
              href="#works"
              className="hover:text-[#00F0FF] transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'أعمالي ومشاريعي' : 'Portfolio Works'}
            </a>
            <a
              href="#architecture"
              className="hover:text-[#00F0FF] transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'خدماتي البرمجية' : 'Web Services'}
            </a>
            <a
              href="#stack"
              className="hover:text-[#00F0FF] transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'المهارات والتقنيات' : 'Tech Stack'}
            </a>
            <a
              href="#contact"
              className="hover:text-[#00F0FF] transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'تواصل معي' : 'Contact'}
            </a>
          </nav>

          {/* Zone 3: AR / EN Language Switcher + Client CTA + Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSwitcher onSwitch={() => setSelectedCategory('All')} />

            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-bold tech-btn-primary rounded-lg whitespace-nowrap shrink-0"
            >
              <span>{isAr ? 'اطلب مشروعك' : 'Start a Project'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 rounded-lg tech-btn-secondary cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-cyan-500/25 bg-[#040B1A]/95 backdrop-blur-xl px-4 sm:px-6 py-4 space-y-3 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-semibold text-sky-100">
              <a
                href="#works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl tech-panel hover:border-cyan-400/60 hover:text-[#00F0FF] transition-colors text-center"
              >
                {isAr ? 'أعمالي ومشاريعي' : 'Projects'}
              </a>
              <a
                href="#architecture"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl tech-panel hover:border-cyan-400/60 hover:text-[#00F0FF] transition-colors text-center"
              >
                {isAr ? 'خدماتي البرمجية' : 'Services'}
              </a>
              <a
                href="#stack"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl tech-panel hover:border-cyan-400/60 hover:text-[#00F0FF] transition-colors text-center"
              >
                {isAr ? 'المهارات والتقنيات' : 'Tech Stack'}
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl tech-panel hover:border-cyan-400/60 hover:text-[#00F0FF] transition-colors text-center"
              >
                {isAr ? 'تواصل معي' : 'Contact'}
              </a>
            </div>

            <a
              href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                profile.whatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl tech-btn-emerald font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isAr ? 'تواصل مباشر عبر واتساب' : 'Chat on WhatsApp'}</span>
            </a>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1">
        {/* Clean, Balanced Hero Section: Personal Intro + Full-Stack Developer Visual */}
        <section className="relative overflow-hidden border-b border-cyan-500/20 py-8 sm:py-16 lg:py-22">
          {/* Technical Ambient Glow Orbs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-10 w-72 h-72 rounded-full bg-blue-600/12 blur-3xl"
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-center">
              {/* Column 1: Personal Introduction ("أنا مصطفى الجبالي") */}
              <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6">
                {/* Compact Availability Badge */}
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#00F0FF] bg-cyan-950/60 border border-cyan-400/35 px-3.5 py-1.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#00FF9D] shadow-[0_0_8px_#00FF9D]" />
                    <span>
                      {isAr
                        ? 'متاح لاستلام وتطوير مشاريع الويب · Full-Stack'
                        : 'Available for Full-Stack Web Projects'}
                    </span>
                  </div>
                </div>

                {/* Personal Name & Full-Stack Developer Title */}
                <div className="space-y-2 sm:space-y-3">
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.25]">
                    <span className="block text-white">
                      {isAr ? 'أنا مصطفى الجبالي' : "I'm Mustafa Al-Jabali"}
                    </span>
                    <span className="block text-xl sm:text-3xl lg:text-4xl tech-title-gradient mt-1.5">
                      {isAr
                        ? 'مبرمج ومطور ويب متكامل — Full-Stack Developer'
                        : 'Full-Stack Web Developer'}
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base lg:text-lg text-sky-100/85 leading-relaxed max-w-2xl">
                    {isAr
                      ? 'أنا مصطفى الجبالي، مبرمج ومطور ويب متكامل (Full-Stack Web Developer). أقوم بتصميم وبرمجة مواقع وتطبيقات ويب حديثة، سريعة، ومتجاوبة بالكامل مع جميع الشاشات والجوالات — من واجهات المستخدم التفاعلية (Frontend UI/UX) إلى الأنظمة الخلفية وقواعد البيانات (Backend & Databases).'
                      : "I'm Mustafa Al-Jabali, a Full-Stack Web Developer specializing in designing and building modern, fast, and 100% responsive websites and web applications — from interactive Frontend UI/UX to scalable Backend APIs and Databases."}
                  </p>
                </div>

                {/* Clean Primary Action Buttons */}
                <div className="grid grid-cols-2 sm:flex sm:flex-row items-center gap-3 sm:gap-4 pt-1">
                  <a
                    href="#works"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl tech-btn-primary font-bold text-xs sm:text-sm text-center"
                  >
                    <span>{isAr ? 'تصفح أعمالي' : 'My Projects'}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </a>
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl tech-btn-secondary font-semibold text-xs sm:text-sm text-center"
                  >
                    <Mail className="w-4 h-4 text-[#00F0FF] shrink-0" />
                    <span>{isAr ? 'تواصل معي' : 'Contact Me'}</span>
                  </a>
                </div>

                {/* Clean Core Stack Pills (Hidden on tiny screens to keep mobile ultra-clean) */}
                <div className="hidden sm:flex flex-wrap items-center gap-2 pt-1 text-xs text-sky-200/80">
                  <span className="px-3 py-1 rounded-lg bg-[#061022] border border-cyan-500/25 text-[#00F0FF] font-mono">
                    React.js & Next.js
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#061022] border border-cyan-500/25 text-sky-200 font-mono">
                    Node.js & REST APIs
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#061022] border border-cyan-500/25 text-[#00FF9D] font-mono">
                    TypeScript & Databases
                  </span>
                </div>
              </div>

              {/* Column 2: Full-Stack Developer Visual Illustration (Replaces Project Link Card) */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <FullStackDeveloperHeroVisual isAr={isAr} />
              </div>
            </div>

            {/* Compact 2x2 (Mobile) / 4-Column (Desktop) Highlights Strip */}
            <div className="mt-8 sm:mt-14 pt-6 sm:pt-10 border-t border-cyan-500/20 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              <div className="p-3.5 sm:p-5 rounded-xl tech-panel">
                <div className="text-base sm:text-2xl font-bold text-[#00F0FF]" dir="ltr">
                  Full-Stack
                </div>
                <div className="mt-1 text-[11px] sm:text-xs text-sky-100/75">
                  {isAr
                    ? 'تطوير واجهات وأنظمة ويب متكاملة'
                    : 'Frontend, Backend & Databases'}
                </div>
              </div>
              <div className="p-3.5 sm:p-5 rounded-xl tech-panel">
                <div className="text-base sm:text-2xl font-bold text-[#00FF9D]" dir="ltr">
                  100% Responsive
                </div>
                <div className="mt-1 text-[11px] sm:text-xs text-sky-100/75">
                  {isAr
                    ? 'متجاوب مع الجوال وكل الشاشات'
                    : 'Mobile, Tablet & Desktop Ready'}
                </div>
              </div>
              <div className="p-3.5 sm:p-5 rounded-xl tech-panel">
                <div className="text-base sm:text-2xl font-bold text-sky-300" dir="ltr">
                  Clean Code
                </div>
                <div className="mt-1 text-[11px] sm:text-xs text-sky-100/75">
                  {isAr
                    ? 'سرعة عالية وأمان وتجربة سلسة'
                    : 'Fast Performance & Modern UX'}
                </div>
              </div>
              <div className="p-3.5 sm:p-5 rounded-xl tech-panel">
                <div className="text-base sm:text-2xl font-bold text-[#00FF9D]" dir="ltr">
                  24/7 Support
                </div>
                <div className="mt-1 text-[11px] sm:text-xs text-sky-100/75">
                  {isAr
                    ? 'تواصل مباشر ومتابعة مستمرة'
                    : 'Direct Developer Communication'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Projects Showcase Section */}
        <section id="works" className="py-10 sm:py-20 border-b border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[#00F0FF]">
                  {isAr
                    ? 'معرض المشاريع والأعمال البرمجية'
                    : 'PORTFOLIO · WEB DEVELOPMENT WORKS'}
                </div>
                <h2 className="text-xl sm:text-4xl font-bold tech-title-gradient tracking-tight">
                  {isAr ? 'أحدث مشاريعي وتطبيقات الويب' : 'Selected Web Development Projects'}
                </h2>
              </div>

              {/* Search Input */}
              {projects.length > 0 && (
                <div className="relative w-full md:w-72">
                  <Search
                    className={`w-4 h-4 text-cyan-400/70 absolute ${
                      isAr ? 'right-3.5' : 'left-3.5'
                    } top-1/2 -translate-y-1/2 pointer-events-none`}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isAr
                        ? 'ابحث في المشاريع...'
                        : 'Search projects...'
                    }
                    className={`w-full ${
                      isAr ? 'pr-10 pl-10' : 'pl-10 pr-10'
                    } py-2 text-xs sm:text-sm bg-[#061022] border border-cyan-500/30 rounded-xl text-sky-50 placeholder:text-sky-200/45 focus:outline-none focus:border-[#00F0FF] transition-colors`}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className={`absolute ${
                        isAr ? 'left-3' : 'right-3'
                      } top-1/2 -translate-y-1/2 text-xs text-cyan-300 hover:text-white cursor-pointer`}
                    >
                      {isAr ? 'مسح' : 'Clear'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Interactive Category Filter Bar */}
            {categories.length > 1 && (
              <div className="flex items-center gap-1.5 p-1.5 bg-[#061022] border border-cyan-500/25 rounded-xl overflow-x-auto max-w-full">
                {categories.map((category) => {
                  const active = selectedCategory === category;
                  const displayCat =
                    category === 'All' ? (isAr ? 'الكل' : 'All') : category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'tech-btn-primary text-slate-950'
                          : 'text-sky-200/75 hover:text-[#00F0FF] hover:bg-cyan-500/10'
                      }`}
                    >
                      {displayCat}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Loading / Empty / Populated Project Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {[1, 2].map((n) => (
                  <div
                    key={n}
                    className="rounded-2xl tech-panel p-5 space-y-4 animate-pulse"
                  >
                    <div className="aspect-video w-full rounded-xl bg-cyan-950/50" />
                    <div className="h-4 w-1/3 bg-cyan-950/50 rounded" />
                    <div className="h-6 w-3/4 bg-cyan-950/50 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="rounded-2xl tech-panel p-8 text-center space-y-4">
                <p className="text-base font-semibold text-white">
                  {isAr
                    ? 'لا توجد مشاريع مطابقة للبحث'
                    : 'No projects match your filter criteria'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-lg tech-btn-primary text-xs font-bold cursor-pointer"
                >
                  {isAr ? 'عرض كل المشاريع' : 'Reset Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    onClick={() => onSelectProject(project.slug)}
                    className="group rounded-2xl tech-panel tech-panel-interactive overflow-hidden cursor-pointer flex flex-col justify-between"
                  >
                    {/* Media Container */}
                    <div className="relative aspect-video overflow-hidden bg-[#030712] border-b border-cyan-500/20">
                      <ProjectMediaRenderer
                        src={project.thumbnail}
                        title={project.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      {project.videoUrl && (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-[#030712]/90 border border-cyan-400/40 text-[11px] text-[#00F0FF] flex items-center gap-1.5">
                          <Play className="w-3 h-3 fill-[#00F0FF]" />
                          <span>{isAr ? 'فيديو' : 'VIDEO'}</span>
                        </div>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="p-4 sm:p-6 flex flex-col justify-between space-y-4 flex-1">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 text-xs text-sky-200/75">
                          <span className="text-[#00F0FF] font-semibold truncate">
                            {project.category}
                          </span>
                          {project.timeline && (
                            <span className="text-[#00FF9D] font-mono shrink-0" dir="ltr">
                              {project.timeline}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-xl font-bold text-white group-hover:text-[#00F0FF] transition-colors flex items-start justify-between gap-2">
                          <span className="line-clamp-1">{project.title}</span>
                          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-cyan-400/70 group-hover:text-[#00F0FF] transition-colors mt-0.5" />
                        </h3>

                        <p className="text-xs sm:text-sm text-sky-100/80 line-clamp-2 leading-relaxed">
                          {project.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between gap-3">
                        <div className="text-[11px] font-mono text-cyan-300/85 truncate" dir="ltr">
                          {project.techStack.slice(0, 3).join(' · ')}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProject(project.slug);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg tech-btn-secondary text-xs font-bold text-sky-100 hover:text-white cursor-pointer"
                          >
                            <span>{isAr ? 'تفاصيل ومعاينة' : 'Case Study & Demo'}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#00F0FF]" />
                          </button>

                          {project.liveUrl && project.liveUrl.startsWith('http') && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg tech-btn-primary text-xs font-bold whitespace-nowrap shadow-md cursor-pointer"
                            >
                              <span>{isAr ? 'الموقع الحي ↗' : 'Live Site ↗'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Full-Stack Web Development Services Section */}
        <section id="architecture" className="py-10 sm:py-20 border-b border-cyan-500/20 tech-section-alt">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-7 sm:space-y-12">
            <div className="max-w-3xl space-y-2">
              <div className="text-xs font-semibold text-[#00F0FF]">
                {isAr
                  ? 'خدمات تطوير وبرمجة الويب'
                  : 'FULL-STACK WEB DEVELOPMENT SERVICES'}
              </div>
              <h2 className="text-xl sm:text-4xl font-bold tech-title-gradient tracking-tight">
                {isAr
                  ? 'حلول ويب متكاملة ومتجاوبة مع كل الشاشات'
                  : 'Complete Web Solutions Built for Performance & Every Screen'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-5 sm:p-7 rounded-2xl tech-panel tech-panel-interactive space-y-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-400/15 border border-cyan-400/40 flex items-center justify-center text-[#00F0FF]">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isAr
                    ? 'تطوير الواجهات الأمامية (Frontend)'
                    : 'Responsive Frontend Development'}
                </h3>
                <p className="text-xs sm:text-sm text-sky-100/75 leading-relaxed">
                  {isAr
                    ? 'تصميم وبرمجة واجهات مستخدم عصرية وسريعة باستخدام React.js وNext.js وTailwind CSS، متجاوبة 100% مع الجوال والشاشات.'
                    : 'Building modern, fast, and pixel-perfect interfaces using React.js, Next.js, TypeScript, and Tailwind CSS.'}
                </p>
              </div>

              <div className="p-5 sm:p-7 rounded-2xl tech-panel tech-panel-interactive space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-400/40 flex items-center justify-center text-sky-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isAr
                    ? 'البرمجة الخلفية وقواعد البيانات (Backend)'
                    : 'Scalable Backend & Databases'}
                </h3>
                <p className="text-xs sm:text-sm text-sky-100/75 leading-relaxed">
                  {isAr
                    ? 'بناء الخوادم والواجهات البرمجية (APIs) وأنظمة الحماية وقواعد البيانات (PostgreSQL, MySQL, MongoDB) بكفاءة وأمان.'
                    : 'Engineering secure server-side applications, RESTful APIs, authentication systems, and SQL/NoSQL databases.'}
                </p>
              </div>

              <div className="p-5 sm:p-7 rounded-2xl tech-panel tech-panel-interactive space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/15 border border-emerald-400/40 flex items-center justify-center text-[#00FF9D]">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isAr
                    ? 'المتاجر والمنصات ولوحات التحكم'
                    : 'E-Commerce, SaaS & Admin CMS'}
                </h3>
                <p className="text-xs sm:text-sm text-sky-100/75 leading-relaxed">
                  {isAr
                    ? 'تطوير منصات الويب الكاملة، المتاجر الإلكترونية، ولوحات التحكم الإدارية (Dashboards) مع تهيئة محركات البحث (SEO).'
                    : 'Delivering complete web platforms, e-commerce stores, and custom admin dashboards with SEO optimization.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Matrix Section */}
        <section id="stack" className="py-10 sm:py-20 border-b border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-10">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-[#00F0FF]">
                {isAr ? 'المهارات والتقنيات البرمجية' : 'FULL-STACK TECHNICAL SKILLS'}
              </div>
              <h2 className="text-xl sm:text-3xl font-bold tech-title-gradient tracking-tight">
                {isAr ? 'التقنيات والأدوات التي أعمل بها' : 'Web Development Technology Stack'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {profile.skills.map((group, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl tech-panel tech-panel-interactive space-y-4"
                >
                  <div className="text-xs sm:text-sm text-[#00F0FF] font-bold flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
                    <span>{group.category}</span>
                    <span className="w-2 h-2 rounded-full bg-[#00FF9D] shadow-[0_0_8px_#00FF9D] shrink-0" />
                  </div>
                  <ul className="space-y-2.5">
                    {group.items.map((skill, sIdx) => (
                      <li
                        key={sIdx}
                        className="flex items-center justify-between gap-2 text-xs sm:text-sm text-sky-50 border-b border-cyan-500/10 pb-2 last:border-none last:pb-0"
                      >
                        <span className="font-medium">{skill}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00FF9D] shrink-0" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Direct Contact & Collaboration Section */}
        <section id="contact" className="py-10 sm:py-20 tech-section-alt">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl tech-panel p-5 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              <div className="lg:col-span-7 space-y-3">
                <div className="text-xs font-semibold text-[#00FF9D]">
                  {isAr
                    ? 'تواصل مباشر مع م. مصطفى الجبالي'
                    : 'DIRECT DEVELOPER CONTACT'}
                </div>
                <h2 className="text-xl sm:text-4xl font-bold tech-title-gradient tracking-tight">
                  {isAr
                    ? 'هل لديك مشروع ويب وتريد تنفيذه بأعلى جودة؟'
                    : 'Ready to Build Your Next Website or Full-Stack Web App?'}
                </h2>
                <p className="text-sky-100/80 text-xs sm:text-base leading-relaxed max-w-2xl">
                  {isAr
                    ? 'تواصل معي مباشرة عبر WhatsApp أو الاتصال أو البريد الإلكتروني لمناقشة فكرة مشروعك والبدء في تنفيذها.'
                    : 'Contact me directly via WhatsApp, phone, or email to discuss your project requirements and get started.'}
                </p>
              </div>

              <div className="lg:col-span-5 flex flex-col gap-3">
                <a
                  href={`https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(
                    profile.whatsappMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl tech-btn-emerald font-bold text-xs sm:text-sm"
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>{isAr ? 'تواصل عبر WhatsApp:' : 'WhatsApp:'}</span>
                  <span className="font-mono font-bold" dir="ltr">
                    {phoneDisplay}
                  </span>
                </a>

                <a
                  href={`tel:${phoneDisplay}`}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl tech-btn-secondary font-semibold text-xs sm:text-sm"
                >
                  <Phone className="w-4 h-4 text-[#00F0FF] shrink-0" />
                  <span>{isAr ? 'اتصال مباشر:' : 'Call Directly:'}</span>
                  <span className="font-mono" dir="ltr">
                    {phoneDisplay}
                  </span>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-[#00F0FF] border border-cyan-400/40 font-semibold text-xs sm:text-sm transition-colors break-all"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span dir="ltr">{settings.email}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Client-Facing Technical Footer */}
      <footer className="border-t border-cyan-500/20 bg-[#020611] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sky-200/70 text-center sm:text-start">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-semibold text-white">{profile.fullName}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#00F0FF] font-mono" dir="ltr">
              Full-Stack Web Developer
            </span>
            <span aria-hidden="true">·</span>
            <span onDoubleClick={onOpenAdmin} className="select-none">
              {isAr
                ? `جميع الحقوق محفوظة © ${new Date().getFullYear()}`
                : `All rights reserved © ${new Date().getFullYear()}`}
            </span>
          </div>

          <div className="flex items-center justify-center gap-5">
            {settings.githubUrl && (
              <a
                href={settings.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00F0FF] transition-colors inline-flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            )}
            {settings.linkedinUrl && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00F0FF] transition-colors inline-flex items-center gap-1.5"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button (Icon Only) */}
      <FloatingWhatsAppButton
        phoneNumber={settings.whatsappNumber || '+970595845086'}
        defaultMessage={profile.whatsappMessage}
      />
    </div>
  );
};
