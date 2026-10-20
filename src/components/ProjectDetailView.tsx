import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Layers,
  Terminal,
  Maximize2,
  X,
} from 'lucide-react';
import { DeveloperSettings, Project } from '../types';
import { ProjectMediaRenderer } from './VisualMockups';
import { MarkdownRenderer } from './MarkdownRenderer';
import { FloatingWhatsAppButton } from './FloatingWhatsAppButton';
import { InteractiveProjectDemo } from './InteractiveProjectDemo';
import {
  useI18n,
  LanguageSwitcher,
  getLocalizedProfile,
  ARABIC_PROJECT_TRANSLATIONS,
} from '../i18n';

interface ProjectDetailViewProps {
  project: Project;
  allProjects: Project[];
  settings: DeveloperSettings;
  onBack: () => void;
  onSelectProject: (slugOrId: string) => void;
  isAuthenticated: boolean;
  onEditInCms?: (project: Project) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  allProjects,
  settings,
  onBack,
  onSelectProject,
}) => {
  const { lang } = useI18n();
  const isAr = lang === 'ar';
  const profile = getLocalizedProfile(settings, lang);
  const arOverride = isAr ? ARABIC_PROJECT_TRANSLATIONS[project.slug] : undefined;

  const displayTitle = arOverride ? arOverride.title : project.title;
  const displaySubtitle = arOverride ? arOverride.subtitle : project.subtitle;
  const displayCategory = arOverride ? arOverride.category : project.category;
  const displaySummary = arOverride ? arOverride.summary : project.summary;
  const displayRole = arOverride ? arOverride.role : project.role;
  const displayClient = arOverride ? arOverride.client : project.client;
  const displayDescription = arOverride ? arOverride.description : project.description;
  const displayMetrics = arOverride?.metrics || project.metrics;

  const [lightboxMedia, setLightboxMedia] = useState<{
    url: string;
    caption: string;
  } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxMedia(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const relatedProjects = allProjects
    .filter((p) => p.id !== project.id && p.status === 'published')
    .slice(0, 2);

  return (
    <div className="min-h-screen tech-canvas text-sky-50 flex flex-col overflow-x-hidden selection:bg-cyan-400 selection:text-slate-950">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 tech-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-8 px-4 sm:px-6 py-3.5 sm:py-4">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={onBack}
            className="text-sm sm:text-lg font-bold tracking-tight text-white hover:text-[#00F0FF] transition-colors truncate cursor-pointer"
          >
            {profile.fullName}
          </button>

          {/* Zone 2: Navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-sky-100/80">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-[#00F0FF] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isAr ? 'كل المشاريع' : 'All Projects'}</span>
            </button>
            <a
              href="#live-demo"
              className="hover:text-[#00F0FF] transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'التجربة التفاعلية' : 'Interactive Demo'}
            </a>
            <a
              href="#case-study"
              className="hover:text-[#00F0FF] transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'تفاصيل المشروع' : 'Case Study'}
            </a>
            {project.gallery && project.gallery.length > 0 && (
              <a
                href="#media-gallery"
                className="hover:text-[#00F0FF] transition-colors whitespace-nowrap shrink-0"
              >
                {isAr ? 'صور المشروع' : 'Media Gallery'}
              </a>
            )}
          </nav>

          {/* Zone 3: AR / EN Switcher + Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSwitcher />

            {project.liveUrl && project.liveUrl.startsWith('http') && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold tech-btn-primary rounded-lg whitespace-nowrap shrink-0 shadow-lg"
              >
                <span>{isAr ? 'الموقع الحي ↗' : 'Live Site ↗'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold tech-btn-secondary rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>{isAr ? 'عودة للمعرض' : 'Back to Portfolio'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Project Header & Hero Showcase */}
        <section className="pt-8 sm:pt-10 pb-12 sm:pb-16 border-b border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
            {/* Back Button & Metadata */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-xs font-mono text-sky-200/75 hover:text-[#00F0FF] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>
                  {isAr ? 'العودة إلى معرض المشاريع' : 'BACK TO PORTFOLIO SHOWCASE'}
                </span>
              </button>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#00F0FF]">
                <span className="font-semibold">{displayCategory}</span>
                {displayClient && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-sky-100">{displayClient}</span>
                  </>
                )}
                {project.timeline && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#00FF9D]">{project.timeline}</span>
                  </>
                )}
                {displayRole && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-sky-200/75">{displayRole}</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tech-title-gradient tracking-tight leading-tight max-w-4xl">
                {displayTitle}
              </h1>

              {displaySubtitle && (
                <p className="text-base sm:text-xl text-sky-100/85 max-w-3xl leading-relaxed">
                  {displaySubtitle}
                </p>
              )}

              {/* Action Links */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                {project.liveUrl && project.liveUrl.startsWith('http') && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl tech-btn-primary font-bold text-xs sm:text-sm shadow-xl"
                  >
                    <span>
                      {isAr
                        ? 'زيارة الموقع الفعلي الحي ↗ (rawdati-website.vercel.app)'
                        : 'Visit Live Production Website ↗'}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                <a
                  href="#live-demo"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl tech-btn-secondary font-bold text-xs sm:text-sm"
                >
                  <span>
                    {isAr ? 'تجربة النموذج التفاعلي الحي بالأسفل' : 'Try Interactive Live Demo Below'}
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl tech-btn-secondary font-semibold text-xs sm:text-sm"
                  >
                    <Github className="w-4 h-4 text-[#00F0FF]" />
                    <span>{isAr ? 'الكود المصدري (GitHub)' : 'Source Code (GitHub)'}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Primary Hero Media Frame */}
            <div className="relative rounded-2xl overflow-hidden tech-panel">
              {project.videoUrl ? (
                <div className="aspect-video w-full bg-black">
                  <video
                    src={project.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div
                  onClick={() =>
                    setLightboxMedia({
                      url: project.thumbnail,
                      caption: displayTitle,
                    })
                  }
                  className="group relative aspect-video w-full overflow-hidden cursor-zoom-in"
                >
                  <ProjectMediaRenderer
                    src={project.thumbnail}
                    title={displayTitle}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-3 py-1.5 rounded-lg bg-[#030712]/90 border border-cyan-400/40 text-xs font-mono text-sky-100 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:border-[#00F0FF] transition-all"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                    <span>{isAr ? 'تكبير الصورة' : 'Inspect Fullscreen'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Performance Metrics Strip */}
            {displayMetrics && displayMetrics.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
                {displayMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-xl tech-panel space-y-1.5"
                  >
                    <div className="text-xs font-mono text-sky-200/70">
                      {metric.label}
                    </div>
                    <div className="text-xl sm:text-3xl font-bold font-mono tabular-nums text-[#00F0FF]">
                      {metric.value}
                    </div>
                    {metric.delta && (
                      <div className="text-xs font-mono text-[#00FF9D]">
                        {metric.delta}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Embedded Interactive Live Demo */}
            <div id="live-demo" className="pt-4">
              <InteractiveProjectDemo slug={project.slug} />
            </div>
          </div>
        </section>

        {/* Deep-Dive Case Study & Technical Specifications */}
        <section id="case-study" className="py-12 sm:py-16 border-b border-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left 8 Columns: Markdown Case Study */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              <div className="p-6 sm:p-8 rounded-2xl tech-panel space-y-4">
                <div className="text-xs font-mono text-[#00F0FF]">
                  {isAr ? 'ملخص المشروع' : 'EXECUTIVE OVERVIEW'}
                </div>
                <p className="text-sm sm:text-lg text-sky-50 leading-relaxed">
                  {displaySummary}
                </p>
              </div>

              {displayDescription && (
                <div className="space-y-4">
                  <MarkdownRenderer content={displayDescription} />
                </div>
              )}

              {/* Architecture Dataflow Pipeline */}
              {project.architectureNotes && (
                <div
                  id="architecture-pipeline"
                  className="p-5 sm:p-7 rounded-2xl tech-panel space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF]">
                    <Terminal className="w-4 h-4" />
                    <span>
                      {isAr
                        ? 'مخطط البنية البرمجية للنظام · ARCHITECTURE'
                        : 'SYSTEM ARCHITECTURE & PIPELINE'}
                    </span>
                  </div>
                  <div
                    dir="ltr"
                    className="font-mono text-xs sm:text-sm text-[#00FF9D] bg-[#020611] p-4 rounded-xl border border-cyan-500/30 overflow-x-auto leading-relaxed text-left"
                  >
                    {project.architectureNotes}
                  </div>
                </div>
              )}
            </div>

            {/* Right 4 Columns: Project Metadata & Tech Stack */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="p-6 sm:p-7 rounded-2xl tech-panel space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF]">
                  <Layers className="w-4 h-4" />
                  <span>{isAr ? 'معلومات وتفاصيل المشروع' : 'PROJECT SPECIFICATIONS'}</span>
                </div>

                <div className="space-y-4 text-sm">
                  {displayClient && (
                    <div className="border-b border-cyan-500/20 pb-3">
                      <div className="text-xs text-sky-200/70">
                        {isAr ? 'العميل / الجهة' : 'Client / Organization'}
                      </div>
                      <div className="font-semibold text-white mt-0.5">{displayClient}</div>
                    </div>
                  )}
                  <div className="border-b border-cyan-500/20 pb-3">
                    <div className="text-xs text-sky-200/70">
                      {isAr ? 'الدور في المشروع' : 'Developer Role'}
                    </div>
                    <div className="font-semibold text-white mt-0.5">
                      {displayRole || 'Full-Stack Web Developer'}
                    </div>
                  </div>
                  {project.timeline && (
                    <div className="border-b border-cyan-500/20 pb-3">
                      <div className="text-xs text-sky-200/70">
                        {isAr ? 'تاريخ الإنجاز' : 'Timeline'}
                      </div>
                      <div className="font-mono text-[#00FF9D] mt-0.5">{project.timeline}</div>
                    </div>
                  )}
                  {project.techStack && project.techStack.length > 0 && (
                    <div>
                      <div className="text-xs text-sky-200/70 mb-2">
                        {isAr ? 'التقنيات المستخدمة' : 'Technology Stack'}
                      </div>
                      <div className="text-xs font-mono text-[#00F0FF] leading-relaxed" dir="ltr">
                        {project.techStack.join(' · ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Project Media & Screen Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <section id="media-gallery" className="py-12 sm:py-16 border-b border-cyan-500/20 tech-section-alt">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="space-y-2">
                <div className="text-xs font-mono text-[#00F0FF]">
                  {isAr ? 'معرض صور وشاشات المشروع · GALLERY' : 'PROJECT SCREENSHOTS & MEDIA'}
                </div>
                <h2 className="text-xl sm:text-3xl font-bold tech-title-gradient tracking-tight">
                  {isAr ? 'لقطات من واجهات المشروع ولوحة التحكم' : 'System Screens & Visual Captures'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {project.gallery.map((item) => {
                  const localizedCaption =
                    (isAr && arOverride?.galleryCaptions?.[item.id]) || item.caption;
                  return (
                    <div
                      key={item.id}
                      onClick={() =>
                        setLightboxMedia({
                          url: item.url,
                          caption: localizedCaption || displayTitle,
                        })
                      }
                      className="group rounded-2xl tech-panel tech-panel-interactive overflow-hidden cursor-pointer"
                    >
                      <div className="aspect-video w-full bg-[#030712] overflow-hidden">
                        <ProjectMediaRenderer
                          src={item.url}
                          title={localizedCaption || displayTitle}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </div>
                      {localizedCaption && (
                        <div className="p-4 text-xs text-sky-100 font-mono border-t border-cyan-500/20 flex items-center justify-between gap-4">
                          <span className="truncate">{localizedCaption}</span>
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-400/70 group-hover:text-[#00F0FF] shrink-0" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Next / Related Case Studies */}
        {relatedProjects.length > 0 && (
          <section className="py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold tech-title-gradient tracking-tight">
                  {isAr ? 'مشاريع أخرى من أعمالي' : 'More Web Development Projects'}
                </h2>
                <button
                  type="button"
                  onClick={onBack}
                  className="text-xs font-mono text-[#00F0FF] hover:text-cyan-300 cursor-pointer shrink-0"
                >
                  {isAr ? 'عرض كل المشاريع ←' : 'VIEW ALL WORKS →'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {relatedProjects.map((rel) => {
                  const relAr = isAr ? ARABIC_PROJECT_TRANSLATIONS[rel.slug] : undefined;
                  return (
                    <div
                      key={rel.id}
                      onClick={() => onSelectProject(rel.slug)}
                      className="group rounded-2xl tech-panel tech-panel-interactive overflow-hidden cursor-pointer flex flex-col justify-between"
                    >
                      <div className="aspect-video w-full bg-[#030712] overflow-hidden">
                        <ProjectMediaRenderer
                          src={rel.thumbnail}
                          title={relAr ? relAr.title : rel.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </div>
                      <div className="p-5 sm:p-6 space-y-2">
                        <div className="text-xs font-mono text-[#00F0FF]">
                          {relAr ? relAr.category : rel.category} · <span className="text-[#00FF9D]">{rel.timeline}</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                          {relAr ? relAr.title : rel.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-sky-100/75 line-clamp-2">
                          {relAr ? relAr.summary : rel.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Fullscreen Lightbox Modal */}
      {lightboxMedia && (
        <div
          onClick={() => setLightboxMedia(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-6xl w-full rounded-2xl tech-panel overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-cyan-500/20">
              <div className="text-xs sm:text-sm font-medium text-white truncate pr-4">
                {lightboxMedia.caption}
              </div>
              <button
                type="button"
                onClick={() => setLightboxMedia(null)}
                className="p-1.5 rounded-lg tech-btn-secondary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-[#030712]">
              <ProjectMediaRenderer
                src={lightboxMedia.url}
                title={lightboxMedia.caption}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      <FloatingWhatsAppButton
        phoneNumber={settings.whatsappNumber || '+970595845086'}
        defaultMessage={profile.whatsappMessage}
      />
    </div>
  );
};
