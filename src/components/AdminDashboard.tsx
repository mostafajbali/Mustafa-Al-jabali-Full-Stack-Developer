import React, { useState, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  FilePlus2,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  Clock,
  Upload,
  Maximize2,
  X,
  Save,
  Copy,
  Check,
  ArrowLeft,
  Film,
  Sparkles,
  Menu,
  Languages,
} from 'lucide-react';
import { DeveloperSettings, MediaAsset, Project, ProjectMediaItem, ProjectMetric } from '../types';
import { ProjectMediaRenderer } from './VisualMockups';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useI18n, LanguageSwitcher } from '../i18n';

export type AdminTab =
  | 'overview'
  | 'directory'
  | 'editor'
  | 'media'
  | 'settings';

interface AdminDashboardProps {
  token: string | null;
  projects: Project[];
  media: MediaAsset[];
  settings: DeveloperSettings;
  onRefresh: () => Promise<void>;
  onLogout: () => Promise<void>;
  onViewLiveSite: () => void;
  onInspectPublicProject: (slugOrId: string) => void;
  initialTab?: AdminTab;
  initialEditingProject?: Project | null;
}

const EMPTY_PROJECT_FORM: Omit<Project, 'id' | 'slug' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  slug?: string;
} = {
  title: '',
  subtitle: '',
  category: 'Web Application',
  status: 'published',
  featured: true,
  thumbnail: '',
  videoUrl: '',
  summary: '',
  description: '',
  architectureNotes: '',
  client: '',
  role: 'Full-Stack Web Developer',
  timeline: '2026',
  liveUrl: '',
  repoUrl: '',
  techStack: [],
  metrics: [],
  gallery: [],
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  projects,
  media,
  settings,
  onRefresh,
  onLogout,
  onViewLiveSite,
  onInspectPublicProject,
  initialTab = 'overview',
  initialEditingProject = null,
}) => {
  const { lang, toggleLang } = useI18n();
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<AdminTab>(
    initialEditingProject ? 'editor' : initialTab
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Directory state
  const [dirSearch, setDirSearch] = useState('');
  const [dirStatusFilter, setDirStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // Project Editor state (Add New / Edit Existing + Mobile Markdown Preview Mode)
  const [editorForm, setEditorForm] = useState<typeof EMPTY_PROJECT_FORM>(() =>
    initialEditingProject ? { ...initialEditingProject } : { ...EMPTY_PROJECT_FORM }
  );
  const [techStackInput, setTechStackInput] = useState<string>(() =>
    (initialEditingProject ? initialEditingProject.techStack : EMPTY_PROJECT_FORM.techStack).join(
      ', '
    )
  );
  const [editorMode, setEditorMode] = useState<'write' | 'preview' | 'split'>('split');
  const [savingProject, setSavingProject] = useState(false);
  const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
  const [showMediaPickerModal, setShowMediaPickerModal] = useState<
    null | 'thumbnail' | 'video' | 'gallery'
  >(null);

  // Media Library state + Fullscreen Inspector
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [mediaSearch, setMediaSearch] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [externalMediaUrl, setExternalMediaUrl] = useState('');
  const [externalMediaTitle, setExternalMediaTitle] = useState('');
  const [inspectedAsset, setInspectedAsset] = useState<MediaAsset | null>(null);
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Developer Settings state
  const [settingsForm, setSettingsForm] = useState<DeveloperSettings>({ ...settings });
  const [savingSettings, setSavingSettings] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const authHeaders = useMemo(() => {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  const tabNamesAr: Record<AdminTab, string> = {
    overview: 'نظرة عامة',
    directory: 'إدارة المشاريع',
    editor: 'محرر المشروع',
    media: 'مكتبة الوسائط',
    settings: 'إعدادات الموقع والمطور',
  };

  // Open Editor for New Project
  const handleStartNewProject = () => {
    setEditorForm({ ...EMPTY_PROJECT_FORM, id: undefined, slug: undefined });
    setTechStackInput('');
    setActiveTab('editor');
    setSidebarOpen(false);
  };

  // Open Editor for Existing Project
  const handleEditProject = (proj: Project) => {
    setEditorForm({ ...proj });
    setTechStackInput(proj.techStack.join(', '));
    setActiveTab('editor');
    setSidebarOpen(false);
  };

  // Save Project (Create or Update)
  const handleSaveProject = async (targetStatus?: 'published' | 'draft') => {
    if (!editorForm.title.trim()) {
      showNotification(
        isAr ? 'يرجى إدخال عنوان المشروع أولاً.' : 'Please enter a project title before saving.',
        'error'
      );
      return;
    }

    setSavingProject(true);
    const payload = {
      ...editorForm,
      status: targetStatus || editorForm.status,
      techStack: techStackInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const isEditing = Boolean(editorForm.id);
      const url = isEditing ? `/api/admin/projects/${editorForm.id}` : '/api/admin/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save project.');
      }

      await onRefresh();
      setEditorForm({ ...data.project });
      setTechStackInput((data.project.techStack || []).join(', '));
      showNotification(
        isAr
          ? isEditing
            ? `تم تحديث المشروع "${data.project.title}" بنجاح`
            : `تم إضافة ونشر المشروع "${data.project.title}" بنجاح`
          : isEditing
          ? `Updated "${data.project.title}" (${data.project.status.toUpperCase()})`
          : `Created "${data.project.title}" (${data.project.status.toUpperCase()})`
      );
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Error saving project', 'error');
    } finally {
      setSavingProject(false);
    }
  };

  // Toggle Publish / Unpublish
  const handleToggleProjectStatus = async (proj: Project) => {
    const nextStatus = proj.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/projects/${proj.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error('Failed to update project status');
      await onRefresh();
      showNotification(
        isAr
          ? `تم تغيير حالة المشروع "${proj.title}" إلى ${
              nextStatus === 'published' ? 'منشور على الموقع العام' : 'مسودة مخفية'
            }.`
          : `Project "${proj.title}" is now ${
              nextStatus === 'published' ? 'PUBLISHED on public portfolio' : 'UNPUBLISHED (Draft)'
            }.`
      );
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Status update failed', 'error');
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: string, title: string) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Failed to delete project');
      setDeletingProjectId(null);
      await onRefresh();
      showNotification(
        isAr ? `تم حذف المشروع "${title}".` : `Deleted project "${title}".`
      );
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  // Upload File to Media Library (and optionally bind to editor)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    bindTarget?: 'thumbnail' | 'video' | 'gallery'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMedia(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('altText', file.name.replace(/\.[^.]+$/, ''));

        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          headers: authHeaders,
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');

        if (bindTarget === 'thumbnail') {
          setEditorForm((prev) => ({ ...prev, thumbnail: data.asset.url }));
        } else if (bindTarget === 'video') {
          setEditorForm((prev) => ({ ...prev, videoUrl: data.asset.url }));
        } else if (bindTarget === 'gallery') {
          const item: ProjectMediaItem = {
            id: `gal-${Date.now()}-${i}`,
            url: data.asset.url,
            type: data.asset.type,
            caption: data.asset.altText || file.name,
          };
          setEditorForm((prev) => ({
            ...prev,
            gallery: [...(prev.gallery || []), item],
          }));
        }
      }
      await onRefresh();
      showNotification(
        isAr ? 'تم رفع الملف وحفظه بنجاح.' : 'Media uploaded and stored in library.'
      );
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Media upload error', 'error');
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  // Generate Technical Project Thumbnail from Description & Stack
  const handleGenerateThumbnail = async () => {
    setGeneratingThumbnail(true);
    try {
      const res = await fetch('/api/admin/media/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          title: editorForm.title || 'Web Engineering Project',
          description: editorForm.summary || editorForm.description,
          category: editorForm.category,
          techStack: techStackInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate thumbnail');
      setEditorForm((prev) => ({ ...prev, thumbnail: data.url }));
      await onRefresh();
      showNotification(
        isAr
          ? 'تم توليد الصورة التقنية للمشروع وحفظها في مكتبة الوسائط!'
          : 'Generated technical project thumbnail & saved to Media Library!'
      );
    } catch (err) {
      showNotification(
        err instanceof Error ? err.message : 'Thumbnail generation failed',
        'error'
      );
    } finally {
      setGeneratingThumbnail(false);
    }
  };

  // Add External Media Asset URL
  const handleAddExternalMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!externalMediaUrl.trim()) return;
    setUploadingMedia(true);
    try {
      const res = await fetch('/api/admin/media/external', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          url: externalMediaUrl.trim(),
          title: externalMediaTitle.trim() || 'External Media Asset',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add external URL');
      setExternalMediaUrl('');
      setExternalMediaTitle('');
      await onRefresh();
      showNotification(
        isAr ? 'تمت إضافة الرابط الخارجي إلى المكتبة.' : 'External media registered in library.'
      );
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Failed to register URL', 'error');
    } finally {
      setUploadingMedia(false);
    }
  };

  // Delete Media Asset
  const handleDeleteMedia = async (asset: MediaAsset) => {
    try {
      const res = await fetch(`/api/admin/media/${asset.id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      if (!res.ok) throw new Error('Failed to delete media asset');
      if (inspectedAsset?.id === asset.id) {
        setInspectedAsset(null);
      }
      await onRefresh();
      showNotification(
        isAr
          ? `تم حذف الملف "${asset.originalName}" من المكتبة.`
          : `Removed "${asset.originalName}" from media library.`
      );
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Error deleting asset', 'error');
    }
  };

  // Save Developer Profile & Platform Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify(settingsForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');
      await onRefresh();
      setSettingsForm({ ...data.settings });
      showNotification(
        isAr
          ? 'تم حفظ بيانات المطور وإعدادات الموقع بنجاح!'
          : 'Developer profile & website settings saved.'
      );
    } catch (err) {
      showNotification(err instanceof Error ? err.message : 'Settings update failed', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredDirectoryProjects = useMemo(() => {
    return projects.filter((p) => {
      const statusOk = dirStatusFilter === 'all' || p.status === dirStatusFilter;
      const q = dirSearch.trim().toLowerCase();
      if (!q) return statusOk;
      return (
        statusOk &&
        (p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.client.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q)))
      );
    });
  }, [projects, dirStatusFilter, dirSearch]);

  const filteredMediaAssets = useMemo(() => {
    return media.filter((m) => {
      const typeOk = mediaFilter === 'all' || m.type === mediaFilter;
      const q = mediaSearch.trim().toLowerCase();
      if (!q) return typeOk;
      return (
        typeOk &&
        (m.originalName.toLowerCase().includes(q) ||
          m.altText.toLowerCase().includes(q) ||
          m.filename.toLowerCase().includes(q))
      );
    });
  }, [media, mediaFilter, mediaSearch]);

  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;
  const totalStorageMB = (
    media.reduce((acc, m) => acc + (m.sizeBytes || 0), 0) /
    (1024 * 1024)
  ).toFixed(2);

  return (
    <div className="min-h-screen tech-canvas text-sky-50 flex overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 px-5 py-3.5 rounded-xl border text-xs font-mono shadow-2xl flex items-center justify-between sm:justify-start gap-3 transition-all ${
            toast.type === 'error'
              ? 'bg-rose-950/95 border-rose-500/50 text-rose-200'
              : 'bg-[#071328]/95 border-[#00F0FF]/50 text-[#00F0FF]'
          }`}
        >
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/65 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 ${
          isAr ? 'right-0 border-l' : 'left-0 border-r'
        } z-40 w-64 bg-[#040B1A] border-cyan-500/20 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0'
            : isAr
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 space-y-8">
          {/* CMS Brand Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-base font-bold text-white tracking-tight">
                {isAr ? 'لوحة تحكم أثير' : 'AETHER // CMS'}
              </div>
              <div className="text-[11px] font-mono text-cyan-400">
                {isAr ? 'إدارة معرض الأعمال' : 'PORTFOLIO CONTROL SUITE'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Navigation Items */}
          <nav className="space-y-1.5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('overview');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'نظرة عامة (الرئيسية)' : 'Dashboard Overview'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('directory');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'إدارة المشاريع' : 'Project Directory'}</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">{projects.length}</span>
            </button>

            <button
              type="button"
              onClick={handleStartNewProject}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <FilePlus2 className="w-4 h-4 shrink-0" />
              <span>
                {editorForm.id
                  ? isAr
                    ? 'تعديل المشروع الحالي'
                    : 'Project Editor (Active)'
                  : isAr
                  ? 'إضافة مشروع جديد'
                  : 'Add New Project'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('media');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'media'
                  ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <span className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'مكتبة الصور والفيديو' : 'Media Library'}</span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">{media.length}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSettingsForm({ ...settings });
                setActiveTab('settings');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-cyan-400/15 text-cyan-400 border border-cyan-400/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'إعدادات الموقع والمطور' : 'Developer Settings'}</span>
            </button>
          </nav>
        </div>

        {/* Bottom Admin Actions */}
        <div className="p-6 border-t border-slate-800/80 space-y-3">
          <button
            type="button"
            onClick={onViewLiveSite}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111627] hover:bg-slate-800 text-xs font-semibold text-cyan-400 border border-slate-800 transition-colors cursor-pointer"
          >
            <span>{isAr ? 'عرض الموقع العام' : 'View Live Public Site'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 border border-rose-500/25 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isAr ? 'تسجيل الخروج' : 'Sign Out Session'}</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Workspace Header */}
        <header className="sticky top-0 z-20 bg-[#07080D]/90 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-slate-800 text-slate-300 hover:text-white shrink-0 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="text-xs font-mono text-slate-400 truncate">
                <span className="hidden sm:inline">{isAr ? 'لوحة التحكم' : 'ADMIN CMS'}</span>
                <span className="hidden sm:inline mx-2 text-slate-600">/</span>
                <span className="text-white font-semibold uppercase">
                  {isAr ? tabNamesAr[activeTab] : activeTab}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <LanguageSwitcher />

              <button
                type="button"
                onClick={handleStartNewProject}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'مشروع جديد' : 'New Project'}</span>
              </button>
            </div>
          </div>

          {/* Mobile & Tablet Horizontal Quick-Navigation Bar */}
          <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-1">
            {(
              [
                { id: 'overview', ar: 'الرئيسية', en: 'Overview' },
                { id: 'directory', ar: `المشاريع (${projects.length})`, en: `Projects (${projects.length})` },
                { id: 'editor', ar: '+ إضافة / محرر', en: '+ Editor' },
                { id: 'media', ar: `الوسائط (${media.length})`, en: `Media (${media.length})` },
                { id: 'settings', ar: 'الإعدادات', en: 'Settings' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  if (t.id === 'settings') setSettingsForm({ ...settings });
                  setActiveTab(t.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  activeTab === t.id
                    ? 'bg-cyan-400 text-slate-950'
                    : 'bg-[#0D101B] text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {isAr ? t.ar : t.en}
              </button>
            ))}
          </div>
        </header>

        {/* Dynamic Tab Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          {/* ================================================================
              TAB 1: CMS ADMIN DASHBOARD OVERVIEW
             ================================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    {isAr
                      ? 'ملخص المنصة وإدارة المشاريع الحقيقية'
                      : 'SYSTEM TELEMETRY & CONTENT SUMMARY'}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                    {isAr
                      ? `مرحباً بك، ${settings.arabicName || settings.fullName}`
                      : `Welcome back, ${settings.fullName}`}
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={onViewLiveSite}
                  className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  <span>{isAr ? 'معاينة الموقع العام' : 'OPEN PUBLIC PORTFOLIO'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 4-Column KPI Metric Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-slate-400">
                    {isAr ? 'إجمالي المشاريع' : 'TOTAL PROJECTS'}
                  </div>
                  <div className="text-3xl font-bold font-mono tabular-nums text-white">
                    {projects.length}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isAr ? 'مسجلة في قاعدة البيانات' : 'In persistent database'}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-emerald-400">
                    {isAr ? 'المشاريع المنشورة' : 'PUBLISHED LIVE'}
                  </div>
                  <div className="text-3xl font-bold font-mono tabular-nums text-emerald-400">
                    {publishedCount}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isAr ? 'تظهر للزوار في الموقع العام' : 'Visible on public showcase'}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-amber-400">
                    {isAr ? 'المسودات (غير منشورة)' : 'STAGED DRAFTS'}
                  </div>
                  <div className="text-3xl font-bold font-mono tabular-nums text-amber-400">
                    {draftCount}
                  </div>
                  <div className="text-xs text-slate-400">
                    {isAr ? 'مخفية عن الزوار' : 'Private to administrator'}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-2">
                  <div className="text-xs font-mono text-cyan-400">
                    {isAr ? 'ملفات الوسائط المرفوعة' : 'MEDIA ASSETS'}
                  </div>
                  <div className="text-3xl font-bold font-mono tabular-nums text-white">
                    {media.length}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {totalStorageMB} MB {isAr ? 'حجم الملفات' : 'indexed'}
                  </div>
                </div>
              </div>

              {/* Recent Projects Table or Empty Prompt */}
              <div className="rounded-2xl bg-[#0D101B] border border-slate-800 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white">
                      {isAr ? 'مشاريعك على المنصة' : 'Your Portfolio Projects'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isAr
                        ? 'أضف مشاريعك الحقيقية أو عدّل حالة نشرها على الموقع العام'
                        : 'Add your real projects or toggle their publication status on the public site'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleStartNewProject}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة مشروع الآن' : 'Add Project Now'}</span>
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="p-12 text-center space-y-4">
                    <p className="text-base font-semibold text-white">
                      {isAr
                        ? 'لا توجد أي مشاريع مضافة حالياً (تم تنظيف البيانات التجريبية)'
                        : 'No projects added yet (all sample data cleared)'}
                    </p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                      {isAr
                        ? 'اضغط على زر "إضافة مشروع جديد" لرفع أول مشروع حقيقي لك مع صوره وفيديوهاته ورابطه المباشر.'
                        : 'Click "Add Project Now" to upload your first real project with screenshots, videos, and external live links.'}
                    </p>
                    <button
                      type="button"
                      onClick={handleStartNewProject}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? 'إضافة أول مشروع حقيقي' : 'Add First Real Project'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800/80 text-[11px] font-mono text-slate-400 uppercase">
                          <th className="py-3.5 px-6">{isAr ? 'المشروع' : 'Project'}</th>
                          <th className="py-3.5 px-4">{isAr ? 'التصنيف' : 'Category'}</th>
                          <th className="py-3.5 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                          <th className="py-3.5 px-4">{isAr ? 'آخر تحديث' : 'Updated'}</th>
                          <th className="py-3.5 px-6 text-right">
                            {isAr ? 'الإجراءات' : 'Actions'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-sm">
                        {projects.map((proj) => (
                          <tr key={proj.id} className="hover:bg-slate-800/25 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3.5">
                                <div className="w-14 h-9 rounded-lg overflow-hidden bg-[#07080D] border border-slate-800 shrink-0">
                                  <ProjectMediaRenderer
                                    src={proj.thumbnail}
                                    title={proj.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-semibold text-white">{proj.title}</div>
                                  <div className="text-xs text-slate-400 font-mono">
                                    /{proj.slug}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-xs text-slate-300">{proj.category}</td>
                            <td className="py-4 px-4">
                              <button
                                type="button"
                                onClick={() => handleToggleProjectStatus(proj)}
                                className={`inline-flex items-center gap-1.5 text-xs font-mono cursor-pointer ${
                                  proj.status === 'published'
                                    ? 'text-emerald-400 hover:text-emerald-300'
                                    : 'text-amber-400 hover:text-amber-300'
                                }`}
                              >
                                {proj.status === 'published' ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : (
                                  <Clock className="w-3.5 h-3.5" />
                                )}
                                <span>
                                  {proj.status === 'published'
                                    ? isAr
                                      ? 'منشور'
                                      : 'Published'
                                    : isAr
                                    ? 'مسودة'
                                    : 'Draft'}
                                </span>
                              </button>
                            </td>
                            <td className="py-4 px-4 text-xs font-mono tabular-nums text-slate-400">
                              {new Date(proj.updatedAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => onInspectPublicProject(proj.slug)}
                                  title={isAr ? 'معاينة المشروع' : 'Preview Case Study'}
                                  className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-200 cursor-pointer"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditProject(proj)}
                                  title={isAr ? 'تعديل المشروع' : 'Edit Project'}
                                  className="p-2 rounded-lg bg-cyan-400/15 hover:bg-cyan-400/25 text-cyan-300 cursor-pointer"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 2: CMS PROJECT MANAGEMENT DIRECTORY
             ================================================================ */}
          {activeTab === 'directory' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    {isAr ? 'دليل إدارة جميع المشاريع' : 'CMS PROJECT MANAGEMENT DIRECTORY'}
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                    {isAr
                      ? `كل المشاريع (${filteredDirectoryProjects.length})`
                      : `All Portfolio Projects (${filteredDirectoryProjects.length})`}
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={handleStartNewProject}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'إنشاء مشروع جديد' : 'Create New Project'}</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D101B] border border-slate-800">
                <div className="flex items-center gap-1.5 bg-[#07080D] p-1 rounded-xl border border-slate-800 self-start">
                  {(
                    [
                      { id: 'all', ar: 'الكل', en: 'All' },
                      { id: 'published', ar: 'منشور', en: 'Published' },
                      { id: 'draft', ar: 'مسودة', en: 'Draft' },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setDirStatusFilter(st.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        dirStatusFilter === st.id
                          ? 'bg-cyan-400 text-slate-950'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isAr ? st.ar : st.en}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dirSearch}
                    onChange={(e) => setDirSearch(e.target.value)}
                    placeholder={
                      isAr
                        ? 'ابحث بالعنوان، العميل، التقنية...'
                        : 'Filter by title, client, stack...'
                    }
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#07080D] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Project Cards List */}
              {filteredDirectoryProjects.length === 0 ? (
                <div className="p-12 rounded-2xl bg-[#0D101B] border border-slate-800 text-center space-y-4">
                  <p className="text-base font-semibold text-white">
                    {isAr ? 'لا توجد مشاريع مطابقة' : 'No matching projects found'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {isAr
                      ? 'ابدأ بإضافة مشروعك الحقيقي الأول من خلال الزر أدناه.'
                      : 'Create a new project or clear your search filter.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleStartNewProject}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isAr ? 'إضافة مشروع جديد' : 'Create New Project'}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredDirectoryProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-5 rounded-2xl bg-[#0D101B] border border-slate-800 hover:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 min-w-0 flex-1">
                        <div
                          onClick={() => handleEditProject(proj)}
                          className="w-full sm:w-40 aspect-video rounded-xl overflow-hidden bg-[#07080D] border border-slate-800 shrink-0 cursor-pointer"
                        >
                          <ProjectMediaRenderer
                            src={proj.thumbnail}
                            title={proj.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-2 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                            <span
                              className={
                                proj.status === 'published'
                                  ? 'text-emerald-400 font-semibold'
                                  : 'text-amber-400 font-semibold'
                              }
                            >
                              {proj.status === 'published'
                                ? isAr
                                  ? '● منشور'
                                  : '● PUBLISHED'
                                : isAr
                                ? '○ مسودة'
                                : '○ DRAFT'}
                            </span>
                            <span aria-hidden="true" className="text-slate-600">
                              ·
                            </span>
                            <span className="text-cyan-400">{proj.category}</span>
                            <span aria-hidden="true" className="text-slate-600">
                              ·
                            </span>
                            <span className="text-slate-400">{proj.timeline}</span>
                          </div>

                          <h3
                            onClick={() => handleEditProject(proj)}
                            className="text-lg font-bold text-white hover:text-cyan-400 cursor-pointer truncate"
                          >
                            {proj.title}
                          </h3>

                          <p className="text-xs text-slate-400 line-clamp-2">{proj.summary}</p>

                          <div className="text-[11px] font-mono text-slate-400 truncate">
                            {proj.techStack.join(' · ')}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
                        <button
                          type="button"
                          onClick={() => handleToggleProjectStatus(proj)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                            proj.status === 'published'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                          }`}
                        >
                          {proj.status === 'published'
                            ? isAr
                              ? 'إلغاء النشر'
                              : 'Unpublish'
                            : isAr
                            ? 'نشر على الموقع'
                            : 'Publish Live'}
                        </button>

                        <button
                          type="button"
                          onClick={() => onInspectPublicProject(proj.slug)}
                          className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isAr ? 'معاينة' : 'Preview'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditProject(proj)}
                          className="px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'تعديل' : 'Edit'}</span>
                        </button>

                        {deletingProjectId === proj.id ? (
                          <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/40 px-2.5 py-1.5 rounded-lg">
                            <span className="text-[11px] text-rose-200 font-mono">
                              {isAr ? 'تأكيد الحذف؟' : 'Confirm?'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(proj.id, proj.title)}
                              className="px-2 py-0.5 rounded bg-rose-500 text-white text-[11px] font-semibold cursor-pointer"
                            >
                              {isAr ? 'حذف' : 'Delete'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingProjectId(null)}
                              className="px-1.5 py-0.5 text-[11px] text-slate-300 hover:text-white cursor-pointer"
                            >
                              {isAr ? 'إلغاء' : 'Cancel'}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingProjectId(proj.id)}
                            title={isAr ? 'حذف المشروع' : 'Delete Project'}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              TAB 3: CMS PROJECT EDITOR (ADD / EDIT + MARKDOWN PREVIEW MODE)
             ================================================================ */}
          {activeTab === 'editor' && (
            <div className="space-y-8">
              {/* Top Editor Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('directory')}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>
                      {isAr ? 'العودة إلى قائمة المشاريع' : 'BACK TO PROJECT DIRECTORY'}
                    </span>
                  </button>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {editorForm.id
                      ? isAr
                        ? `تعديل المشروع: ${editorForm.title}`
                        : `Edit Project: ${editorForm.title}`
                      : isAr
                      ? 'إضافة مشروع حقيقي جديد'
                      : 'Create New Portfolio Project'}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={savingProject}
                    onClick={() => handleSaveProject('draft')}
                    className="px-4 py-2.5 rounded-xl bg-[#111627] hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isAr ? 'حفظ كمسودة' : 'Save as Draft'}
                  </button>
                  <button
                    type="button"
                    disabled={savingProject}
                    onClick={() => handleSaveProject('published')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {savingProject
                        ? isAr
                          ? 'جاري الحفظ...'
                          : 'Saving...'
                        : editorForm.id
                        ? isAr
                          ? 'حفظ التعديلات ونشر المشروع'
                          : 'Update & Publish Live'
                        : isAr
                        ? 'حفظ ونشر المشروع على الموقع'
                        : 'Publish Project Live'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Core Metadata Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-5">
                    <div className="text-xs font-mono text-cyan-400">
                      {isAr
                        ? '01. بيانات المشروع والروابط الخارجية'
                        : '01. PROJECT IDENTITY & EXTERNAL LINKS'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'عنوان المشروع *' : 'PROJECT TITLE *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={editorForm.title}
                          onChange={(e) =>
                            setEditorForm({ ...editorForm, title: e.target.value })
                          }
                          placeholder={
                            isAr
                              ? 'مثال: منصة التجارة الإلكترونية المتكاملة'
                              : 'e.g. Full-Stack E-Commerce Platform'
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'العنوان الفرعي للمشروع' : 'SUBTITLE / TAGLINE'}
                        </label>
                        <input
                          type="text"
                          value={editorForm.subtitle}
                          onChange={(e) =>
                            setEditorForm({ ...editorForm, subtitle: e.target.value })
                          }
                          placeholder={
                            isAr
                              ? 'وصف مختصر يظهر تحت العنوان الرئيسي'
                              : 'Short tagline displayed below the project title'
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'تصنيف المشروع' : 'ENGINEERING CATEGORY'}
                        </label>
                        <input
                          type="text"
                          value={editorForm.category}
                          onChange={(e) =>
                            setEditorForm({ ...editorForm, category: e.target.value })
                          }
                          placeholder={isAr ? 'تطبيقات ويب / متاجر' : 'Web Application / SaaS'}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'العميل أو الجهة' : 'CLIENT / ORGANIZATION'}
                        </label>
                        <input
                          type="text"
                          value={editorForm.client}
                          onChange={(e) =>
                            setEditorForm({ ...editorForm, client: e.target.value })
                          }
                          placeholder={isAr ? 'اسم العميل أو الشركة' : 'Client or Company Name'}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'دورك في المشروع' : 'YOUR ROLE'}
                        </label>
                        <input
                          type="text"
                          value={editorForm.role}
                          onChange={(e) =>
                            setEditorForm({ ...editorForm, role: e.target.value })
                          }
                          placeholder={isAr ? 'مطور ويب متكامل' : 'Full-Stack Developer'}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'تاريخ الإنجاز / السنة' : 'TIMELINE / YEAR'}
                        </label>
                        <input
                          type="text"
                          value={editorForm.timeline}
                          onChange={(e) =>
                            setEditorForm({ ...editorForm, timeline: e.target.value })
                          }
                          placeholder="2026"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'رابط الموقع المباشر (Live URL)' : 'EXTERNAL LIVE URL'}
                        </label>
                        <input
                          type="url"
                          value={editorForm.liveUrl}
                          onChange={(e) =>
                            setEditorForm({ ...editorForm, liveUrl: e.target.value })
                          }
                          placeholder="https://example.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'رابط الكود (GitHub URL)' : 'GITHUB / SOURCE REPOSITORY URL'}
                        </label>
                        <input
                          type="url"
                          value={editorForm.repoUrl}
                          onChange={(e) =>
                            setEditorForm({ ...editorForm, repoUrl: e.target.value })
                          }
                          placeholder="https://github.com/..."
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr
                            ? 'التقنيات المستخدمة (افصل بينها بفاصلة ,)'
                            : 'TECH STACK (COMMA SEPARATED)'}
                        </label>
                        <input
                          type="text"
                          value={techStackInput}
                          onChange={(e) => setTechStackInput(e.target.value)}
                          placeholder="React, TypeScript, Node.js, Tailwind CSS"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr
                            ? 'ملخص المشروع (يظهر على البطاقة في الصفحة الرئيسية)'
                            : 'EXECUTIVE SUMMARY (CARD & HERO LEAD)'}
                        </label>
                        <textarea
                          rows={3}
                          value={editorForm.summary}
                          onChange={(e) =>
                            setEditorForm({ ...editorForm, summary: e.target.value })
                          }
                          placeholder={
                            isAr
                              ? 'اكتب نبذة مختصرة من سطرين أو ثلاثة توضح فكرة المشروع وأهم مميزاته...'
                              : 'Concise 2-3 sentence summary displayed on portfolio cards...'
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Markdown Case Study Editor with Write / Mobile Preview / Split Mode */}
                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs font-mono text-cyan-400">
                        {isAr
                          ? '02. التفاصيل الكاملة للمشروع (يدعم Markdown والمعاينة الفورية)'
                          : '02. CASE STUDY MARKDOWN EDITOR & LIVE PREVIEW'}
                      </div>

                      {/* Segmented Mode Toggle */}
                      <div className="flex items-center gap-1 bg-[#07080D] p-1 rounded-xl border border-slate-800">
                        {(
                          [
                            { id: 'write', ar: 'كتابة النص', en: 'Markdown Source' },
                            { id: 'preview', ar: 'معاينة العرض', en: 'Live Preview' },
                            { id: 'split', ar: 'عرض مزدوج', en: 'Split View' },
                          ] as const
                        ).map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setEditorMode(mode.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              editorMode === mode.id
                                ? 'bg-cyan-400 text-slate-950'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {isAr ? mode.ar : mode.en}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div
                      className={`grid gap-6 ${
                        editorMode === 'split'
                          ? 'grid-cols-1 lg:grid-cols-2'
                          : 'grid-cols-1'
                      }`}
                    >
                      {(editorMode === 'write' || editorMode === 'split') && (
                        <div className="space-y-2">
                          <div className="text-[11px] font-mono text-slate-400">
                            {isAr
                              ? 'اشرح تفاصيل المشروع، المميزات، والتحديات التقنية'
                              : 'MARKDOWN INPUT (SUPPORTS ### HEADINGS, - LISTS, **BOLD**, `CODE`)'}
                          </div>
                          <textarea
                            rows={14}
                            value={editorForm.description}
                            onChange={(e) =>
                              setEditorForm({ ...editorForm, description: e.target.value })
                            }
                            placeholder={
                              isAr
                                ? 'اكتب شرحاً مفصلاً عن المشروع وكيف قمت ببنائه...'
                                : 'Write your full engineering case study in Markdown...'
                            }
                            className="w-full p-4 rounded-xl bg-[#07080D] border border-slate-800 text-xs sm:text-sm font-mono text-slate-100 leading-relaxed focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      )}

                      {(editorMode === 'preview' || editorMode === 'split') && (
                        <div className="space-y-2">
                          <div className="text-[11px] font-mono text-emerald-400">
                            {isAr ? 'معاينة مباشرة للنص' : 'RENDERED CASE STUDY PREVIEW'}
                          </div>
                          <div className="p-5 rounded-xl bg-[#07080D] border border-slate-800 min-h-[320px] max-h-[420px] overflow-y-auto">
                            <MarkdownRenderer content={editorForm.description} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 space-y-1.5">
                      <label className="block text-xs font-mono text-slate-300">
                        {isAr
                          ? 'مخطط البنية التقنية (اختياري)'
                          : 'SYSTEM ARCHITECTURE DATAFLOW PIPELINE (OPTIONAL)'}
                      </label>
                      <input
                        type="text"
                        value={editorForm.architectureNotes}
                        onChange={(e) =>
                          setEditorForm({
                            ...editorForm,
                            architectureNotes: e.target.value,
                          })
                        }
                        placeholder="React Frontend -> Node.js Express API -> PostgreSQL Database"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Quantitative Metrics Editor */}
                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-cyan-400">
                        {isAr
                          ? '03. أرقام وإحصائيات المشروع (اختياري)'
                          : '03. QUANTITATIVE TELEMETRY & IMPACT METRICS'}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setEditorForm({
                            ...editorForm,
                            metrics: [
                              ...(editorForm.metrics || []),
                              { label: 'Performance', value: '99%', delta: 'Fast load' },
                            ],
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إضافة إحصائية' : 'Add Metric'}</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editorForm.metrics || []).map((m: ProjectMetric, idx: number) => (
                        <div
                          key={idx}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#07080D] p-3 rounded-xl border border-slate-800"
                        >
                          <input
                            type="text"
                            value={m.label}
                            onChange={(e) => {
                              const next = [...editorForm.metrics];
                              next[idx] = { ...next[idx], label: e.target.value };
                              setEditorForm({ ...editorForm, metrics: next });
                            }}
                            placeholder={isAr ? 'العنوان (مثال: سرعة التحميل)' : 'Metric Label'}
                            className="sm:col-span-4 px-3 py-2 rounded-lg bg-[#0D101B] border border-slate-800 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={m.value}
                            onChange={(e) => {
                              const next = [...editorForm.metrics];
                              next[idx] = { ...next[idx], value: e.target.value };
                              setEditorForm({ ...editorForm, metrics: next });
                            }}
                            placeholder={isAr ? 'القيمة (مثال: 0.8s)' : 'Value'}
                            className="sm:col-span-4 px-3 py-2 rounded-lg bg-[#0D101B] border border-slate-800 text-xs font-mono text-white"
                          />
                          <input
                            type="text"
                            value={m.delta || ''}
                            onChange={(e) => {
                              const next = [...editorForm.metrics];
                              next[idx] = { ...next[idx], delta: e.target.value };
                              setEditorForm({ ...editorForm, metrics: next });
                            }}
                            placeholder={isAr ? 'ملاحظة إضافية' : 'Delta'}
                            className="sm:col-span-3 px-3 py-2 rounded-lg bg-[#0D101B] border border-slate-800 text-xs font-mono text-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = editorForm.metrics.filter((_, i) => i !== idx);
                              setEditorForm({ ...editorForm, metrics: next });
                            }}
                            className="sm:col-span-1 p-2 text-rose-400 hover:text-rose-300 flex justify-center cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 4 Columns: Media Thumbnail, Video Demo & Gallery Manager */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Publication State Card */}
                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-4">
                    <div className="text-xs font-mono text-cyan-400">
                      {isAr ? 'حالة النشر والظهور' : 'PUBLICATION & VISIBILITY'}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">{isAr ? 'الحالة' : 'Status'}</span>
                      <select
                        value={editorForm.status}
                        onChange={(e) =>
                          setEditorForm({
                            ...editorForm,
                            status: e.target.value as 'published' | 'draft',
                          })
                        }
                        className="px-3 py-1.5 rounded-lg bg-[#07080D] border border-slate-800 text-xs font-mono text-white"
                      >
                        <option value="published">
                          {isAr ? 'منشور (يظهر للجميع)' : 'PUBLISHED (Public)'}
                        </option>
                        <option value="draft">
                          {isAr ? 'مسودة (مخفي)' : 'DRAFT (Hidden)'}
                        </option>
                      </select>
                    </div>

                    <label className="flex items-center justify-between text-sm cursor-pointer pt-2 border-t border-slate-800/80">
                      <span className="text-slate-300">
                        {isAr ? 'تثبيت كمشروع مميز في الأعلى' : 'Pin as Featured Project'}
                      </span>
                      <input
                        type="checkbox"
                        checked={editorForm.featured}
                        onChange={(e) =>
                          setEditorForm({ ...editorForm, featured: e.target.checked })
                        }
                        className="w-4 h-4 accent-cyan-400 rounded"
                      />
                    </label>
                  </div>

                  {/* Thumbnail Artwork Selector & Uploader */}
                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-4">
                    <div className="text-xs font-mono text-cyan-400">
                      {isAr
                        ? 'الصورة المصغرة للمشروع (Thumbnail)'
                        : 'PROJECT THUMBNAIL ARTWORK'}
                    </div>

                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#07080D] border border-slate-800">
                      <ProjectMediaRenderer
                        src={editorForm.thumbnail}
                        title={editorForm.title || 'Thumbnail Preview'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Upload from device or pick from library */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <label className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 text-xs font-semibold cursor-pointer text-center">
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingMedia
                            ? isAr
                              ? 'جاري الرفع...'
                              : 'Uploading...'
                            : isAr
                            ? 'رفع صورة من جهازك'
                            : 'Upload Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'thumbnail')}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowMediaPickerModal('thumbnail')}
                        className="px-3 py-2.5 rounded-xl bg-[#07080D] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        {isAr ? 'اختيار من المكتبة' : 'Choose Library'}
                      </button>
                    </div>

                    {/* AI Technical Thumbnail Generator Button */}
                    <button
                      type="button"
                      disabled={generatingThumbnail}
                      onClick={handleGenerateThumbnail}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400/20 via-indigo-500/20 to-emerald-400/20 hover:from-cyan-400/30 hover:to-emerald-400/30 border border-cyan-400/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>
                        {generatingThumbnail
                          ? isAr
                            ? 'جاري توليد الصورة المصغرة...'
                            : 'Generating Technical Thumbnail...'
                          : isAr
                          ? 'توليد غلاف تقني تلقائي من وصف المشروع'
                          : 'Generate Technical Thumbnail from Description'}
                      </span>
                    </button>

                    <input
                      type="text"
                      value={editorForm.thumbnail}
                      onChange={(e) =>
                        setEditorForm({ ...editorForm, thumbnail: e.target.value })
                      }
                      placeholder={
                        isAr
                          ? 'أو الصق رابط صورة مباشر هنا...'
                          : 'Or paste direct image URL...'
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#07080D] border border-slate-800 text-xs font-mono text-slate-200"
                    />
                  </div>

                  {/* Project Video Showcase Uploader */}
                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-cyan-400">
                        {isAr ? 'فيديو استعراض المشروع (اختياري)' : 'PROJECT VIDEO REEL (OPTIONAL)'}
                      </div>
                      <Film className="w-4 h-4 text-slate-400" />
                    </div>

                    <input
                      type="text"
                      value={editorForm.videoUrl || ''}
                      onChange={(e) =>
                        setEditorForm({ ...editorForm, videoUrl: e.target.value })
                      }
                      placeholder={
                        isAr
                          ? 'رابط فيديو (.mp4, .webm) أو ارفع ملف فيديو'
                          : 'Video URL (.mp4, .webm) or upload file'
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-[#07080D] border border-slate-800 text-xs font-mono text-slate-200"
                    />

                    <div className="grid grid-cols-2 gap-2.5">
                      <label className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-xs font-semibold cursor-pointer text-center">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isAr ? 'رفع فيديو من جهازك' : 'Upload Video'}</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'video')}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowMediaPickerModal('video')}
                        className="px-3 py-2.5 rounded-xl bg-[#07080D] hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold cursor-pointer"
                      >
                        {isAr ? 'من المكتبة' : 'From Library'}
                      </button>
                    </div>
                  </div>

                  {/* Project Gallery Slides */}
                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono text-cyan-400">
                        {isAr
                          ? `صور إضافية للمشروع (${(editorForm.gallery || []).length})`
                          : `GALLERY SCREENS (${(editorForm.gallery || []).length})`}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer">
                          {isAr ? '+ رفع صور' : '+ Upload'}
                          <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, 'gallery')}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowMediaPickerModal('gallery')}
                          className="text-xs font-mono text-emerald-400 hover:text-emerald-300 cursor-pointer"
                        >
                          {isAr ? '+ من المكتبة' : '+ Library'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {(editorForm.gallery || []).map((item, gIdx) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-[#07080D] border border-slate-800 space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-10 rounded overflow-hidden bg-slate-900 shrink-0">
                              <ProjectMediaRenderer
                                src={item.url}
                                title={item.caption}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <input
                              type="text"
                              value={item.caption}
                              onChange={(e) => {
                                const next = [...editorForm.gallery];
                                next[gIdx] = { ...next[gIdx], caption: e.target.value };
                                setEditorForm({ ...editorForm, gallery: next });
                              }}
                              placeholder={isAr ? 'وصف اللقطة...' : 'Screen caption...'}
                              className="flex-1 px-2.5 py-1.5 rounded bg-[#0D101B] border border-slate-800 text-xs text-white"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = editorForm.gallery.filter((_, i) => i !== gIdx);
                                setEditorForm({ ...editorForm, gallery: next });
                              }}
                              className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================
              TAB 4: CMS MEDIA LIBRARY & FULLSCREEN ASSET INSPECTOR
             ================================================================ */}
          {activeTab === 'media' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    {isAr
                      ? 'مكتبة الوسائط وإدارة الملفات'
                      : 'CMS MEDIA LIBRARY & ASSET REPOSITORY'}
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                    {isAr
                      ? `الصور والفيديوهات المرفوعة (${filteredMediaAssets.length})`
                      : `Uploaded Images & Videos (${filteredMediaAssets.length})`}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e)}
                  />
                  <button
                    type="button"
                    disabled={uploadingMedia}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>
                      {uploadingMedia
                        ? isAr
                          ? 'جاري الرفع...'
                          : 'Uploading...'
                        : isAr
                        ? 'رفع صور أو فيديو من جهازك'
                        : 'Upload Media Files'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Register External Asset Bar & Search Filter */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <form
                  onSubmit={handleAddExternalMedia}
                  className="lg:col-span-7 p-4 rounded-2xl bg-[#0D101B] border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  <input
                    type="url"
                    required
                    value={externalMediaUrl}
                    onChange={(e) => setExternalMediaUrl(e.target.value)}
                    placeholder={
                      isAr
                        ? 'الصق رابط صورة أو فيديو خارجي (https://...)'
                        : 'Paste external image or video URL (https://...)'
                    }
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#07080D] border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    value={externalMediaTitle}
                    onChange={(e) => setExternalMediaTitle(e.target.value)}
                    placeholder={isAr ? 'عنوان الملف' : 'Asset title / label'}
                    className="sm:w-44 px-3.5 py-2 rounded-xl bg-[#07080D] border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="submit"
                    disabled={uploadingMedia}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 whitespace-nowrap cursor-pointer"
                  >
                    {isAr ? 'إضافة الرابط' : 'Add URL'}
                  </button>
                </form>

                <div className="lg:col-span-5 p-4 rounded-2xl bg-[#0D101B] border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 bg-[#07080D] p-1 rounded-xl border border-slate-800">
                    {(
                      [
                        { id: 'all', ar: 'الكل', en: 'all' },
                        { id: 'image', ar: 'صور', en: 'image' },
                        { id: 'video', ar: 'فيديو', en: 'video' },
                      ] as const
                    ).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setMediaFilter(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${
                          mediaFilter === t.id
                            ? 'bg-cyan-400 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {isAr ? t.ar : t.en}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={mediaSearch}
                    onChange={(e) => setMediaSearch(e.target.value)}
                    placeholder={isAr ? 'بحث في الوسائط...' : 'Search assets...'}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07080D] border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              {/* Media Assets Grid */}
              {filteredMediaAssets.length === 0 ? (
                <div className="p-12 rounded-2xl bg-[#0D101B] border border-slate-800 text-center space-y-4">
                  <p className="text-base font-semibold text-white">
                    {isAr ? 'مكتبة الوسائط فارغة حالياً' : 'Media library is currently empty'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {isAr
                      ? 'ارفع صور أو فيديوهات مشاريعك من جهازك لتستخدمها في مشاريعك.'
                      : 'Upload project screenshots or videos from your device.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMediaAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="group rounded-2xl bg-[#0D101B] border border-slate-800 hover:border-cyan-400/50 overflow-hidden flex flex-col justify-between transition-all"
                    >
                      <div
                        onClick={() => setInspectedAsset(asset)}
                        className="relative aspect-video w-full bg-[#07080D] overflow-hidden cursor-pointer"
                      >
                        <ProjectMediaRenderer
                          src={asset.url}
                          title={asset.altText || asset.originalName}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/85 border border-slate-800 text-[10px] font-mono text-cyan-400 uppercase">
                          {asset.type}
                        </div>
                        <button
                          type="button"
                          className="absolute bottom-3 right-3 p-2 rounded-lg bg-slate-950/85 border border-slate-700 text-slate-200 opacity-90 group-hover:opacity-100 group-hover:border-cyan-400"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <div className="text-sm font-semibold text-white truncate">
                            {asset.originalName}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                            {(asset.sizeBytes / 1024).toFixed(1)} KB ·{' '}
                            {asset.dimensions || 'High-Res'}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText(asset.url);
                              setCopiedAssetId(asset.id);
                              setTimeout(() => setCopiedAssetId(null), 2000);
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-cyan-400 cursor-pointer"
                          >
                            {copiedAssetId === asset.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">
                                  {isAr ? 'تم النسخ' : 'Copied URL'}
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{isAr ? 'نسخ الرابط' : 'Copy URL'}</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setInspectedAsset(asset)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer"
                            >
                              {isAr ? 'فحص' : 'Inspect'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(asset)}
                              className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================
              TAB 5: CMS WEBSITE SETTINGS & DEVELOPER PROFILE MANAGEMENT
             ================================================================ */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono text-cyan-400">
                    {isAr
                      ? 'إعدادات الموقع والبيانات الشخصية للمطور'
                      : 'PLATFORM & DEVELOPER PROFILE SETTINGS'}
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                    {isAr
                      ? 'تعديل بياناتك الشخصية، رقم الواتساب، والمهارات'
                      : 'Developer Identity, WhatsApp & SEO Configuration'}
                  </h1>
                </div>

                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer self-start"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {savingSettings
                      ? isAr
                        ? 'جاري الحفظ...'
                        : 'Saving Changes...'
                      : isAr
                      ? 'حفظ الإعدادات'
                      : 'Save Platform Settings'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-5">
                    <div className="text-xs font-mono text-cyan-400">
                      {isAr
                        ? '01. البيانات الشخصية والنصوص الرئيسية'
                        : '01. PUBLIC DEVELOPER PROFILE & HERO COPY'}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'الاسم بالإنجليزية' : 'FULL NAME (ENGLISH)'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.fullName}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, fullName: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'الاسم بالعربية' : 'ARABIC NAME'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.arabicName || ''}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, arabicName: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'الموقع / المدينة' : 'LOCATION & TIMEZONE'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.location}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, location: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'حالة التفرغ للعمل' : 'AVAILABILITY STATUS LINE'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.availabilityText}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              availabilityText: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'العنوان الترحيبي الرئيسي (Hero Headline)' : 'PRIMARY HERO HEADLINE'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.headline}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, headline: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'الوصف الفرعي تحت العنوان' : 'HERO SUBHEADLINE'}
                        </label>
                        <textarea
                          rows={2}
                          value={settingsForm.subheadline}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              subheadline: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'النبذة التعريفية عنك (Bio)' : 'ENGINEERING BIOGRAPHY'}
                        </label>
                        <textarea
                          rows={4}
                          value={settingsForm.bio}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, bio: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hero KPI Metrics */}
                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-5">
                    <div className="text-xs font-mono text-cyan-400">
                      {isAr ? '02. أرقام وإحصائيات الواجهة' : '02. PORTFOLIO KPI STRIP METRICS'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'سنوات الخبرة' : 'EXPERIENCE METRIC'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.yearsExperience}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              yearsExperience: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm font-mono text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'المشاريع المنجزة' : 'SYSTEMS DELIVERED'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.projectsDelivered}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              projectsDelivered: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm font-mono text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono text-slate-300">
                          {isAr ? 'معيار الجودة / الاستقرار' : 'PRODUCTION SLA METRIC'}
                        </label>
                        <input
                          type="text"
                          value={settingsForm.uptimeMetric}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              uptimeMetric: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm font-mono text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 4 Columns: WhatsApp Floating CTA & Social Channels */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-4">
                    <div className="text-xs font-mono text-emerald-400">
                      {isAr
                        ? 'إعدادات زر الواتساب العائم'
                        : 'FLOATING WHATSAPP CONTACT BUTTON'}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-300">
                        {isAr ? 'رقم الجوال / الواتساب' : 'WHATSAPP & PHONE NUMBER'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            whatsappNumber: e.target.value,
                          })
                        }
                        placeholder="+970595845086"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-sm font-mono text-white text-left"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-300">
                        {isAr ? 'رسالة الترحيب التلقائية في واتساب' : 'DEFAULT WHATSAPP MESSAGE'}
                      </label>
                      <textarea
                        rows={3}
                        value={settingsForm.whatsappMessage}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            whatsappMessage: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0D101B] border border-slate-800 space-y-4">
                    <div className="text-xs font-mono text-cyan-400">
                      {isAr ? 'روابط التواصل والحسابات' : 'CONTACT & SOCIAL LINKS'}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-300">
                        {isAr ? 'البريد الإلكتروني' : 'DIRECT EMAIL'}
                      </label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, email: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-300">
                        {isAr ? 'رابط حساب GitHub' : 'GITHUB PROFILE URL'}
                      </label>
                      <input
                        type="url"
                        value={settingsForm.githubUrl}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, githubUrl: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-slate-300">
                        {isAr ? 'رابط حساب LinkedIn' : 'LINKEDIN PROFILE URL'}
                      </label>
                      <input
                        type="url"
                        value={settingsForm.linkedinUrl}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl bg-[#07080D] border border-slate-800 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* Media Picker Modal for Project Editor */}
      {showMediaPickerModal && (
        <div
          onClick={() => setShowMediaPickerModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full rounded-2xl bg-[#0D101B] border border-slate-700 overflow-hidden shadow-2xl space-y-4 p-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-sm font-bold text-white">
                {isAr
                  ? 'اختر ملفاً من مكتبة الوسائط'
                  : 'Select Media Asset from Library'}
              </div>
              <button
                type="button"
                onClick={() => setShowMediaPickerModal(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {media.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                {isAr
                  ? 'لا توجد ملفات مرفوعة في المكتبة بعد. استخدم زر "رفع صورة من جهازك".'
                  : 'No media files in library yet. Use the upload button to add files.'}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
                {media.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => {
                      if (showMediaPickerModal === 'thumbnail') {
                        setEditorForm((prev) => ({ ...prev, thumbnail: asset.url }));
                      } else if (showMediaPickerModal === 'video') {
                        setEditorForm((prev) => ({ ...prev, videoUrl: asset.url }));
                      } else if (showMediaPickerModal === 'gallery') {
                        setEditorForm((prev) => ({
                          ...prev,
                          gallery: [
                            ...(prev.gallery || []),
                            {
                              id: `gal-${Date.now()}`,
                              url: asset.url,
                              type: asset.type,
                              caption: asset.altText || asset.originalName,
                            },
                          ],
                        }));
                      }
                      setShowMediaPickerModal(null);
                    }}
                    className="group rounded-xl bg-[#07080D] border border-slate-800 hover:border-cyan-400 overflow-hidden cursor-pointer"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <ProjectMediaRenderer
                        src={asset.url}
                        title={asset.originalName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2.5 text-xs text-slate-200 truncate font-mono">
                      {asset.originalName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Media Asset Inspector Modal */}
      {inspectedAsset && (
        <div
          onClick={() => setInspectedAsset(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full rounded-2xl bg-[#0D101B] border border-slate-700 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-8 bg-[#07080D] flex items-center justify-center p-4 min-h-[280px] sm:min-h-[420px]">
              <ProjectMediaRenderer
                src={inspectedAsset.url}
                title={inspectedAsset.altText}
                className="w-full h-full max-h-[70vh] object-contain"
              />
            </div>

            <div className="lg:col-span-4 p-6 flex flex-col justify-between space-y-6 border-t lg:border-t-0 lg:border-l border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 uppercase">
                    {isAr
                      ? `فاحص الملفات · ${inspectedAsset.type}`
                      : `ASSET INSPECTOR · ${inspectedAsset.type}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInspectedAsset(null)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white break-all">
                  {inspectedAsset.originalName}
                </h3>

                <div className="space-y-2.5 text-xs font-mono text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isAr ? 'النوع:' : 'MIME Type:'}</span>
                    <span>{inspectedAsset.mimeType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isAr ? 'الحجم:' : 'Size:'}</span>
                    <span>{(inspectedAsset.sizeBytes / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isAr ? 'الأبعاد:' : 'Dimensions:'}</span>
                    <span>{inspectedAsset.dimensions || '1920x1080'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{isAr ? 'تاريخ الرفع:' : 'Uploaded:'}</span>
                    <span>{new Date(inspectedAsset.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="text-[11px] font-mono text-slate-400">
                    {isAr ? 'رابط الملف المباشر' : 'ASSET PATH / URL'}
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#07080D] border border-slate-800 text-xs font-mono text-cyan-300 break-all">
                    {inspectedAsset.url}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(inspectedAsset.url);
                    showNotification(
                      isAr ? 'تم نسخ رابط الملف.' : 'Asset URL copied to clipboard.'
                    );
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{isAr ? 'نسخ رابط الملف' : 'Copy Asset URL'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteMedia(inspectedAsset)}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isAr ? 'حذف الملف نهائياً' : 'Delete Asset Permanently'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
