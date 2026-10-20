/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DeveloperSettings, MediaAsset, Project } from './types';
import { PublicPortfolio } from './components/PublicPortfolio';
import { ProjectDetailView } from './components/ProjectDetailView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard, AdminTab } from './components/AdminDashboard';
import { I18nProvider } from './i18n';
import initialPortfolioData from '../data/portfolio_db.json';

type AppRoute =
  | { view: 'home' }
  | { view: 'project'; slugOrId: string }
  | { view: 'login' }
  | { view: 'admin'; tab?: AdminTab; editProject?: Project | null };

const DEFAULT_SETTINGS: DeveloperSettings = {
  fullName: 'Mustafa Al-Jabali',
  arabicName: 'مصطفى الجبالي',
  headline: 'Full-Stack Web Developer | مبرمج ومطور ويب متكامل',
  subheadline:
    'تصميم وتطوير مواقع وتطبيقات ويب حديثة ومتجاوبة بالكامل مع جميع الشاشات — من واجهات المستخدم (Frontend) إلى الأنظمة الخلفية وقواعد البيانات (Backend & Databases).',
  bio: 'أنا مبرمج ومطور ويب متكامل (Full-Stack Web Developer) متخصص في بناء وتطوير المواقع الإلكترونية، المنصات الرقمية، ولوحات التحكم المتكاملة. أحرص على تقديم تجربة مستخدم عصرية ومتجاوبة 100% مع جميع الشاشات (الجوال، التابلت، والكمبيوتر) مع كود برمجي نظيف، سريع، وآمن.',
  location: 'فلسطين · متاح للعمل عن بُعد',
  availabilityText: 'متاح لاستلام وتطوير مشاريع الويب',
  yearsExperience: 'Full-Stack',
  projectsDelivered: '100% Responsive',
  uptimeMetric: '99.9% Quality',
  email: 'mostafaaljabaly9@gmail.com',
  whatsappNumber: '+970595845086',
  whatsappMessage:
    'مرحباً م. مصطفى، تصفحت موقعك الشخصي وأود التواصل معك بخصوص تطوير مشروع ويب.',
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  twitterUrl: 'https://x.com',
  resumeUrl: '#contact',
  skills: [],
  seoTitle: 'Mustafa Al-Jabali — Full-Stack Web Developer | مصطفى الجبالي — مبرمج ويب',
  seoDescription:
    'معرض أعمال المهندس مصطفى الجبالي — مبرمج ومطور ويب متكامل (Full-Stack Web Developer).',
};

function resolveInitialRouteFromLocation(): AppRoute {
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  if (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/login' ||
    pathname === '/cms' ||
    hash === '#admin' ||
    hash === '#/admin' ||
    hash === '#login' ||
    search.includes('admin')
  ) {
    return { view: 'admin', tab: 'overview' };
  }

  if (pathname.startsWith('/project/')) {
    const slug = pathname.replace('/project/', '').trim();
    if (slug) return { view: 'project', slugOrId: slug };
  }

  if (hash.startsWith('#project/')) {
    const slug = hash.replace('#project/', '').trim();
    if (slug) return { view: 'project', slugOrId: slug };
  }

  if (hash.startsWith('#/project/')) {
    const slug = hash.replace('#/project/', '').trim();
    if (slug) return { view: 'project', slugOrId: slug };
  }

  return { view: 'home' };
}

export function AppContent() {
  const [route, setRoute] = useState<AppRoute>(() => resolveInitialRouteFromLocation());
  const [publicProjects, setPublicProjects] = useState<Project[]>(() =>
    Array.isArray(initialPortfolioData.projects)
      ? (initialPortfolioData.projects as unknown as Project[])
      : []
  );
  const [adminProjects, setAdminProjects] = useState<Project[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [settings, setSettings] = useState<DeveloperSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...((initialPortfolioData.settings || {}) as unknown as DeveloperSettings),
  }));
  const [loading, setLoading] = useState<boolean>(false);

  // Auth Session State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem('aether_cms_token')
  );
  const [defaultEmailHint, setDefaultEmailHint] = useState<string>('mostafa_dev');

  // Sync browser URL / hash changes and Ctrl+Shift+A shortcut for independent Admin access
  useEffect(() => {
    const handleLocationChange = () => {
      const next = resolveInitialRouteFromLocation();
      setRoute(next);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.history.pushState({}, '', '/admin');
        setRoute({ view: 'admin', tab: 'overview' });
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const fetchPublicPortfolio = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
        if (Array.isArray(data.projects)) setPublicProjects(data.projects);
      }
    } catch (err) {
      console.error('Failed to load public portfolio:', err);
    }
  }, []);

  const fetchAdminData = useCallback(
    async (tokenToUse?: string | null) => {
      const activeToken = tokenToUse !== undefined ? tokenToUse : authToken;
      const headers: Record<string, string> = {};
      if (activeToken) {
        headers['Authorization'] = `Bearer ${activeToken}`;
      }
      try {
        const res = await fetch('/api/admin/overview', { headers });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          if (Array.isArray(data.projects)) setAdminProjects(data.projects);
          if (Array.isArray(data.media)) setMediaAssets(data.media);
          if (data.settings) setSettings(data.settings);
          return true;
        } else if (res.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('aether_cms_token');
          setAuthToken(null);
        }
      } catch (err) {
        console.error('Failed to load admin overview:', err);
      }
      return false;
    },
    [authToken]
  );

  const refreshAll = useCallback(async () => {
    await fetchPublicPortfolio();
    if (isAuthenticated || authToken) {
      await fetchAdminData();
    }
  }, [fetchPublicPortfolio, fetchAdminData, isAuthenticated, authToken]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await fetchPublicPortfolio();

      // Check existing session
      try {
        const headers: Record<string, string> = {};
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
        const sessionRes = await fetch('/api/auth/session', { headers });
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          if (sessionData.defaultEmailHint) {
            setDefaultEmailHint(sessionData.defaultEmailHint);
          }
          if (sessionData.authenticated && mounted) {
            setIsAuthenticated(true);
            await fetchAdminData(authToken);
          }
        }
      } catch {
        // Ignore session check error
      }

      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [fetchPublicPortfolio, fetchAdminData, authToken]);

  const handleOpenAdmin = () => {
    window.history.pushState({}, '', '/admin');
    if (isAuthenticated) {
      setRoute({ view: 'admin', tab: 'overview' });
    } else {
      setRoute({ view: 'login' });
    }
  };

  const handleReturnToPublicSite = () => {
    if (window.location.hash) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    setRoute({ view: 'home' });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectProject = (slugOrId: string) => {
    window.location.hash = `project/${slugOrId}`;
    setRoute({ view: 'project', slugOrId });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLoginSuccess = async (
    token: string,
    _admin: { email: string; name: string; role: string }
  ) => {
    localStorage.setItem('aether_cms_token', token);
    setAuthToken(token);
    setIsAuthenticated(true);
    await fetchAdminData(token);
    window.history.pushState({}, '', '/admin');
    setRoute({ view: 'admin', tab: 'overview' });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore error
    }
    localStorage.removeItem('aether_cms_token');
    setAuthToken(null);
    setIsAuthenticated(false);
    window.history.pushState({}, '', '/');
    setRoute({ view: 'home' });
  };

  // Render Project Details View
  if (route.view === 'project') {
    const sourceList = isAuthenticated && adminProjects.length > 0 ? adminProjects : publicProjects;
    const found =
      sourceList.find(
        (p) => p.slug === route.slugOrId || p.id === route.slugOrId
      ) || publicProjects[0];

    if (found) {
      return (
        <ProjectDetailView
          project={found}
          allProjects={publicProjects}
          settings={settings}
          onBack={handleReturnToPublicSite}
          onSelectProject={handleSelectProject}
          isAuthenticated={isAuthenticated}
          onEditInCms={(proj) => {
            window.history.pushState({}, '', '/admin');
            setRoute({ view: 'admin', tab: 'editor', editProject: proj });
          }}
        />
      );
    }
  }

  // Render Admin Login View
  if (route.view === 'login') {
    return (
      <AdminLogin
        defaultEmail={defaultEmailHint}
        onLoginSuccess={handleLoginSuccess}
        onBackToSite={handleReturnToPublicSite}
      />
    );
  }

  // Render Protected Admin CMS Suite (/admin)
  if (route.view === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          defaultEmail={defaultEmailHint}
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={handleReturnToPublicSite}
        />
      );
    }

    return (
      <AdminDashboard
        token={authToken}
        projects={adminProjects}
        media={mediaAssets}
        settings={settings}
        onRefresh={refreshAll}
        onLogout={handleLogout}
        onViewLiveSite={handleReturnToPublicSite}
        onInspectPublicProject={handleSelectProject}
        initialTab={route.tab || 'overview'}
        initialEditingProject={route.editProject || null}
      />
    );
  }

  // Default: Public Developer Portfolio & Showcase
  return (
    <PublicPortfolio
      settings={settings}
      projects={publicProjects}
      loading={loading}
      onSelectProject={handleSelectProject}
      onOpenAdmin={handleOpenAdmin}
      isAuthenticated={isAuthenticated}
    />
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
