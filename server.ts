import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Ensure persistent data and uploads directories exist
const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
const DB_FILE = path.join(DATA_DIR, 'portfolio_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded media files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer for image and video uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    const safeBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .slice(0, 40);
    cb(null, `${safeBase}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 80 * 1024 * 1024, // 80MB max for video/high-res screenshots
  },
});

// Admin credentials & HMAC token signing (never exposed to client)
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'mostafa_dev').trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.createHash('sha256').update(ADMIN_PASSWORD + '_aether_salt').digest('hex');

interface SessionPayload {
  email: string;
  role: 'admin';
  exp: number;
}

function createSessionToken(email: string): string {
  const payload: SessionPayload = {
    email,
    role: 'admin',
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');
  return `${data}.${signature}`;
}

function verifySessionToken(token?: string): SessionPayload | null {
  if (!token || !token.includes('.')) return null;
  const [data, signature] = token.split('.');
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(data)
    .digest('base64url');
  if (signature !== expectedSig) return null;
  try {
    const decoded = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as SessionPayload;
    if (decoded.exp < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
}

function extractAdminSession(req: Request): SessionPayload | null {
  const cookieToken = req.cookies?.aether_admin_session;
  if (cookieToken) {
    const verified = verifySessionToken(cookieToken);
    if (verified) return verified;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    const verified = verifySessionToken(bearerToken);
    if (verified) return verified;
  }
  return null;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const session = extractAdminSession(req);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized: Administrator authentication required.' });
    return;
  }
  next();
}

// Initial clean database state (ready for real projects added via Admin CMS)
const INITIAL_DB = {
  settings: {
    fullName: 'Mustafa Al-Jabali',
    arabicName: 'مصطفى الجبالي',
    headline: 'Full-Stack Web Developer | مبرمج ومطور ويب متكامل',
    subheadline:
      'Building modern, responsive, and scalable websites & full-stack web applications from frontend UI/UX to backend architecture and databases.',
    bio: 'أنا مبرمج ومطور ويب متكامل (Full-Stack Web Developer) متخصص في تصميم وتطوير المواقع وتطبيقات الويب الحديثة المتجاوبة مع جميع الشاشات، وبناء الأنظمة الخلفية وقواعد البيانات ولوحات التحكم المتكاملة بأعلى معايير الأداء والجودة.',
    location: 'فلسطين (متاح للعمل عن بُعد عالمياً)',
    availabilityText: 'متاح لاستلام مشاريع الويب وتطوير المواقع',
    yearsExperience: 'Full-Stack',
    projectsDelivered: '100% Responsive',
    uptimeMetric: '99.9% Quality',
    email: 'mostafaaljabaly9@gmail.com',
    whatsappNumber: '+970595845086',
    whatsappMessage: 'مرحباً م. مصطفى، تصفحت موقعك الشخصي وأود التواصل معك بخصوص تطوير مشروع ويب.',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://x.com',
    resumeUrl: '#contact',
    skills: [
      {
        category: 'Frontend Web Development (تطوير الواجهات)',
        items: ['React.js & Next.js', 'TypeScript & JavaScript (ES6+)', 'Tailwind CSS & Bootstrap', 'HTML5 & CSS3', 'Responsive Design (Mobile / Tablet / Desktop)', 'UI/UX Implementation'],
      },
      {
        category: 'Backend & Databases (البرمجة الخلفية وقواعد البيانات)',
        items: ['Node.js & Express.js', 'RESTful APIs & GraphQL', 'PostgreSQL & MySQL', 'MongoDB & Firebase', 'Authentication & JWT Security', 'CMS & Admin Dashboards'],
      },
      {
        category: 'DevOps & Web Tools (الأدوات والاستضافة)',
        items: ['Git & GitHub', 'Cloud Hosting & VPS Deployment', 'Performance & Speed Optimization', 'SEO Best Practices', 'Payment Gateways & APIs Integration', 'Clean & Maintainable Code'],
      },
    ],
    seoTitle: 'Mustafa Al-Jabali — Full-Stack Web Developer | مصطفى الجبالي — مبرمج ويب',
    seoDescription:
      'معرض أعمال المهندس مصطفى الجبالي — مبرمج ومطور ويب متكامل (Full-Stack Web Developer).',
  },
  projects: [] as Array<{
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    category: string;
    status: 'published' | 'draft';
    featured: boolean;
    thumbnail: string;
    videoUrl: string;
    summary: string;
    description: string;
    architectureNotes: string;
    client: string;
    role: string;
    timeline: string;
    liveUrl: string;
    repoUrl: string;
    techStack: string[];
    metrics: Array<{ label: string; value: string; delta?: string }>;
    gallery: Array<{ id: string; url: string; type: 'image' | 'video'; caption: string }>;
    createdAt: string;
    updatedAt: string;
  }>,
  media: [] as Array<{
    id: string;
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    type: 'image' | 'video';
    sizeBytes: number;
    dimensions: string;
    altText: string;
    uploadedAt: string;
  }>,
};

function readDatabase(): typeof INITIAL_DB {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(INITIAL_DB));
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      settings: { ...INITIAL_DB.settings, ...(parsed.settings || {}) },
      projects: Array.isArray(parsed.projects) ? parsed.projects : INITIAL_DB.projects,
      media: Array.isArray(parsed.media) ? parsed.media : INITIAL_DB.media,
    };
  } catch (err) {
    console.error('Error reading database, falling back to initial state:', err);
    return JSON.parse(JSON.stringify(INITIAL_DB));
  }
}

function writeDatabase(data: typeof INITIAL_DB) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================================================
// PUBLIC API ROUTES
// ============================================================================

app.get('/api/portfolio', (_req: Request, res: Response) => {
  const db = readDatabase();
  const publishedProjects = db.projects.filter((p) => p.status === 'published');
  res.json({
    settings: db.settings,
    projects: publishedProjects,
  });
});

app.get('/api/projects/:slugOrId', (req: Request, res: Response) => {
  const db = readDatabase();
  const { slugOrId } = req.params;
  const isAdmin = Boolean(extractAdminSession(req));
  const project = db.projects.find((p) => p.slug === slugOrId || p.id === slugOrId);

  if (!project || (!isAdmin && project.status !== 'published')) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json({ project });
});

// ============================================================================
// AUTHENTICATION API ROUTES
// ============================================================================

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  const normalizedUsername = String(email || '').trim().toLowerCase();
  const expectedUsername = ADMIN_EMAIL.toLowerCase();

  // Allow login if password matches and username matches configured admin username
  const usernameValid = normalizedUsername === expectedUsername || normalizedUsername === 'mostafa_dev';
  const passwordValid = String(password || '') === ADMIN_PASSWORD;

  if (!usernameValid || !passwordValid) {
    res.status(401).json({
      error: 'Invalid administrator credentials. Please verify your username and password.',
    });
    return;
  }

  const token = createSessionToken(ADMIN_EMAIL);
  res.cookie('aether_admin_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.json({
    authenticated: true,
    token,
    admin: {
      email: ADMIN_EMAIL,
      name: readDatabase().settings.fullName,
      role: 'Principal Administrator',
    },
  });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('aether_admin_session');
  res.json({ authenticated: false });
});

app.get('/api/auth/session', (req: Request, res: Response) => {
  const session = extractAdminSession(req);
  if (!session) {
    res.json({
      authenticated: false,
      defaultEmailHint: ADMIN_EMAIL,
    });
    return;
  }
  res.json({
    authenticated: true,
    admin: {
      email: session.email,
      name: readDatabase().settings.fullName,
      role: 'Principal Administrator',
    },
  });
});

// ============================================================================
// PROTECTED ADMIN CMS API ROUTES
// ============================================================================

app.get('/api/admin/overview', requireAdmin, (_req: Request, res: Response) => {
  const db = readDatabase();
  const totalProjects = db.projects.length;
  const publishedCount = db.projects.filter((p) => p.status === 'published').length;
  const draftCount = db.projects.filter((p) => p.status === 'draft').length;
  const totalMedia = db.media.length;
  const totalStorageBytes = db.media.reduce((acc, item) => acc + (item.sizeBytes || 0), 0);

  res.json({
    stats: {
      totalProjects,
      publishedCount,
      draftCount,
      totalMedia,
      totalStorageBytes,
    },
    projects: db.projects,
    media: db.media,
    settings: db.settings,
  });
});

// Create new project
app.post('/api/admin/projects', requireAdmin, (req: Request, res: Response) => {
  const db = readDatabase();
  const body = req.body || {};
  const title = String(body.title || '').trim();

  if (!title) {
    res.status(400).json({ error: 'Project title is required.' });
    return;
  }

  const id = `proj-${Date.now()}`;
  const baseSlug = slugify(body.slug || title) || id;
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (db.projects.some((p) => p.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  const now = new Date().toISOString();
  const newProject = {
    id,
    slug: uniqueSlug,
    title,
    subtitle: String(body.subtitle || '').trim() || 'Full-Stack Web Engineering Case Study',
    category: String(body.category || 'Cloud & Distributed Systems').trim(),
    status: (body.status === 'draft' ? 'draft' : 'published') as 'published' | 'draft',
    featured: Boolean(body.featured ?? true),
    thumbnail: String(body.thumbnail || 'builtin://aether-observability').trim(),
    videoUrl: String(body.videoUrl || '').trim(),
    summary: String(body.summary || '').trim(),
    description: String(body.description || '').trim(),
    architectureNotes: String(body.architectureNotes || '').trim(),
    client: String(body.client || 'Independent Architecture').trim(),
    role: String(body.role || 'Lead Full-Stack Engineer').trim(),
    timeline: String(body.timeline || '2026').trim(),
    liveUrl: String(body.liveUrl || '').trim(),
    repoUrl: String(body.repoUrl || '').trim(),
    techStack: Array.isArray(body.techStack)
      ? body.techStack.map((t: unknown) => String(t).trim()).filter(Boolean)
      : String(body.techStack || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
    metrics: Array.isArray(body.metrics) ? body.metrics : [],
    gallery: Array.isArray(body.gallery) ? body.gallery : [],
    createdAt: now,
    updatedAt: now,
  };

  db.projects.unshift(newProject);
  writeDatabase(db);
  res.status(201).json({ project: newProject });
});

// Update existing project
app.put('/api/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDatabase();
  const { id } = req.params;
  const index = db.projects.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  const existing = db.projects[index];
  const body = req.body || {};
  const title = body.title !== undefined ? String(body.title).trim() : existing.title;
  if (!title) {
    res.status(400).json({ error: 'Project title cannot be empty.' });
    return;
  }

  let updatedSlug = existing.slug;
  if (body.slug && String(body.slug).trim() !== existing.slug) {
    const candidate = slugify(String(body.slug));
    if (candidate && !db.projects.some((p, idx) => idx !== index && p.slug === candidate)) {
      updatedSlug = candidate;
    }
  }

  const updatedProject = {
    ...existing,
    title,
    slug: updatedSlug,
    subtitle: body.subtitle !== undefined ? String(body.subtitle).trim() : existing.subtitle,
    category: body.category !== undefined ? String(body.category).trim() : existing.category,
    status: (body.status === 'draft' || body.status === 'published' ? body.status : existing.status) as 'published' | 'draft',
    featured: body.featured !== undefined ? Boolean(body.featured) : existing.featured,
    thumbnail: body.thumbnail !== undefined ? String(body.thumbnail).trim() : existing.thumbnail,
    videoUrl: body.videoUrl !== undefined ? String(body.videoUrl).trim() : existing.videoUrl,
    summary: body.summary !== undefined ? String(body.summary).trim() : existing.summary,
    description: body.description !== undefined ? String(body.description).trim() : existing.description,
    architectureNotes:
      body.architectureNotes !== undefined ? String(body.architectureNotes).trim() : existing.architectureNotes,
    client: body.client !== undefined ? String(body.client).trim() : existing.client,
    role: body.role !== undefined ? String(body.role).trim() : existing.role,
    timeline: body.timeline !== undefined ? String(body.timeline).trim() : existing.timeline,
    liveUrl: body.liveUrl !== undefined ? String(body.liveUrl).trim() : existing.liveUrl,
    repoUrl: body.repoUrl !== undefined ? String(body.repoUrl).trim() : existing.repoUrl,
    techStack:
      body.techStack !== undefined
        ? Array.isArray(body.techStack)
          ? body.techStack.map((t: unknown) => String(t).trim()).filter(Boolean)
          : String(body.techStack)
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
        : existing.techStack,
    metrics: Array.isArray(body.metrics) ? body.metrics : existing.metrics,
    gallery: Array.isArray(body.gallery) ? body.gallery : existing.gallery,
    updatedAt: new Date().toISOString(),
  };

  db.projects[index] = updatedProject;
  writeDatabase(db);
  res.json({ project: updatedProject });
});

// Toggle publish / unpublish status
app.patch('/api/admin/projects/:id/status', requireAdmin, (req: Request, res: Response) => {
  const db = readDatabase();
  const { id } = req.params;
  const project = db.projects.find((p) => p.id === id);

  if (!project) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  const nextStatus = req.body?.status === 'draft' || req.body?.status === 'published'
    ? req.body.status
    : project.status === 'published'
    ? 'draft'
    : 'published';

  project.status = nextStatus;
  project.updatedAt = new Date().toISOString();
  writeDatabase(db);
  res.json({ project });
});

// Delete project
app.delete('/api/admin/projects/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDatabase();
  const { id } = req.params;
  const initialLen = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);

  if (db.projects.length === initialLen) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }

  writeDatabase(db);
  res.json({ deletedId: id });
});

// Upload image or video file to Media Library
app.post('/api/admin/media/upload', requireAdmin, upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No media file provided.' });
    return;
  }

  const db = readDatabase();
  const isVideo = req.file.mimetype.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/i.test(req.file.originalname);
  const url = `/uploads/${req.file.filename}`;

  const newAsset = {
    id: `media-${Date.now()}`,
    filename: req.file.filename,
    originalName: req.file.originalname,
    url,
    mimeType: req.file.mimetype || (isVideo ? 'video/mp4' : 'image/png'),
    type: (isVideo ? 'video' : 'image') as 'image' | 'video',
    sizeBytes: req.file.size,
    dimensions: isVideo ? '1080p Video' : 'High-Res Asset',
    altText: String(req.body?.altText || req.file.originalname.replace(/\.[^.]+$/, '')),
    uploadedAt: new Date().toISOString(),
  };

  db.media.unshift(newAsset);
  writeDatabase(db);
  res.status(201).json({ asset: newAsset });
});

// Register external image/video URL in Media Library
app.post('/api/admin/media/external', requireAdmin, (req: Request, res: Response) => {
  const { url, title, type } = req.body || {};
  if (!url || !String(url).trim()) {
    res.status(400).json({ error: 'Valid media URL is required.' });
    return;
  }

  const cleanUrl = String(url).trim();
  const isVideo = type === 'video' || /\.(mp4|webm|ogg|mov)$/i.test(cleanUrl);
  const db = readDatabase();

  const newAsset = {
    id: `media-${Date.now()}`,
    filename: String(title || cleanUrl.split('/').pop() || 'external_asset'),
    originalName: String(title || 'External Media Asset'),
    url: cleanUrl,
    mimeType: isVideo ? 'video/mp4' : 'image/jpeg',
    type: (isVideo ? 'video' : 'image') as 'image' | 'video',
    sizeBytes: 154200,
    dimensions: isVideo ? 'External Video' : 'External Image',
    altText: String(title || 'Project Media Asset'),
    uploadedAt: new Date().toISOString(),
  };

  db.media.unshift(newAsset);
  writeDatabase(db);
  res.status(201).json({ asset: newAsset });
});

// Generate bespoke high-fidelity technical SVG project thumbnail from title, description & tech stack
app.post('/api/admin/media/generate-thumbnail', requireAdmin, (req: Request, res: Response) => {
  const { title, description, category, techStack } = req.body || {};
  const cleanTitle = String(title || 'Aether System Architecture').trim().slice(0, 48);
  const cleanCat = String(category || 'DISTRIBUTED SYSTEM').trim().toUpperCase().slice(0, 36);
  const cleanDesc = String(description || '')
    .replace(/[#*`>-]/g, '')
    .trim()
    .slice(0, 95);
  const stackArr: string[] = Array.isArray(techStack)
    ? techStack.slice(0, 5).map((s) => String(s).trim())
    : String(techStack || 'React 19, TypeScript, Rust, WebGPU')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 5);

  const hash = crypto
    .createHash('md5')
    .update(cleanTitle + cleanDesc + Date.now().toString())
    .digest('hex');

  const palettes = [
    { primary: '#00F0FF', secondary: '#6366F1', tertiary: '#10B981' },
    { primary: '#A855F7', secondary: '#00F0FF', tertiary: '#F43F5E' },
    { primary: '#10B981', secondary: '#00F0FF', tertiary: '#3B82F6' },
    { primary: '#38BDF8', secondary: '#818CF8', tertiary: '#34D399' },
  ];
  const palette = palettes[parseInt(hash.slice(0, 2), 16) % palettes.length];

  const escapeXml = (unsafe: string) =>
    unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });

  const safeTitle = escapeXml(cleanTitle);
  const safeCat = escapeXml(cleanCat);
  const safeDesc = escapeXml(cleanDesc ? `${cleanDesc}...` : 'High-Frequency Production Telemetry & Architecture');

  const svgContent = `<svg viewBox="0 0 1200 675" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="675" fill="#07080D"/>
  <g stroke="#1E293B" stroke-width="1" opacity="0.4">
    <line x1="0" y1="80" x2="1200" y2="80"/>
    <line x1="0" y1="580" x2="1200" y2="580"/>
    <line x1="80" y1="0" x2="80" y2="675"/>
    <line x1="760" y1="80" x2="760" y2="580"/>
  </g>
  <circle cx="420" cy="320" r="260" fill="${palette.primary}" opacity="0.12"/>
  <circle cx="920" cy="360" r="220" fill="${palette.secondary}" opacity="0.12"/>
  <rect x="80" y="24" width="14" height="14" rx="4" fill="${palette.primary}"/>
  <text x="108" y="36" fill="${palette.primary}" font-family="JetBrains Mono, monospace" font-weight="600" font-size="13">${safeCat} // SYNTHESIS_${hash.slice(0, 6).toUpperCase()}</text>
  <text x="980" y="36" fill="#10B981" font-family="JetBrains Mono, monospace" font-weight="600" font-size="12">STATUS: NOMINAL 99.99%</text>
  <g transform="translate(115, 130)">
    <rect width="600" height="400" rx="16" fill="#0C101D" stroke="#1E293B" stroke-width="1.5"/>
    <text x="36" y="54" fill="${palette.primary}" font-family="JetBrains Mono, monospace" font-size="12">ARCHITECTURE BLUEPRINT // TELEMETRY MATRIX</text>
    <text x="36" y="102" fill="#F8FAFC" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="28">${safeTitle}</text>
    <text x="36" y="142" fill="#94A3B8" font-family="Plus Jakarta Sans, sans-serif" font-size="14">${safeDesc}</text>
    <path d="M36 310 C120 250, 200 290, 280 230 C360 170, 440 240, 560 185" stroke="${palette.primary}" stroke-width="3" fill="none"/>
    <path d="M36 335 C130 300, 220 270, 310 295 C400 320, 470 250, 560 245" stroke="${palette.secondary}" stroke-width="2" stroke-dasharray="5 5" fill="none"/>
    <g transform="translate(36, 345)">
      ${stackArr
        .map(
          (tech, idx) => `
        <g transform="translate(${idx * 108}, 0)">
          <rect width="98" height="28" rx="6" fill="#13192B" stroke="${palette.primary}" stroke-opacity="0.35"/>
          <text x="12" y="18" fill="#E2E8F0" font-family="JetBrains Mono, monospace" font-size="11">${escapeXml(
            tech.slice(0, 10)
          )}</text>
        </g>`
        )
        .join('')}
    </g>
  </g>
  <g transform="translate(795, 130)">
    <rect width="325" height="400" rx="16" fill="#0C101D" stroke="#1E293B" stroke-width="1.5"/>
    <text x="28" y="46" fill="#F8FAFC" font-family="Plus Jakarta Sans, sans-serif" font-weight="600" font-size="15">Mesh Node Topology</text>
    <line x1="162" y1="125" x2="88" y2="230" stroke="${palette.primary}" stroke-opacity="0.6" stroke-width="2"/>
    <line x1="162" y1="125" x2="236" y2="230" stroke="${palette.primary}" stroke-opacity="0.6" stroke-width="2"/>
    <line x1="88" y1="230" x2="162" y2="330" stroke="${palette.secondary}" stroke-opacity="0.6" stroke-width="2"/>
    <line x1="236" y1="230" x2="162" y2="330" stroke="${palette.secondary}" stroke-opacity="0.6" stroke-width="2"/>
    <circle cx="162" cy="125" r="24" fill="#07080D" stroke="${palette.primary}" stroke-width="2.5"/>
    <text x="142" y="129" fill="#F8FAFC" font-family="JetBrains Mono, monospace" font-size="10">CORE</text>
    <circle cx="88" cy="230" r="20" fill="#07080D" stroke="${palette.secondary}" stroke-width="2"/>
    <text x="72" y="234" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">N-01</text>
    <circle cx="236" cy="230" r="20" fill="#07080D" stroke="${palette.secondary}" stroke-width="2"/>
    <text x="220" y="234" fill="#94A3B8" font-family="JetBrains Mono, monospace" font-size="10">N-02</text>
    <circle cx="162" cy="330" r="22" fill="#07080D" stroke="${palette.tertiary}" stroke-width="2.5"/>
    <text x="144" y="334" fill="${palette.tertiary}" font-family="JetBrains Mono, monospace" font-size="10">EDGE</text>
  </g>
</svg>`;

  const filename = `generated_thumb_${Date.now()}.svg`;
  const filePath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(filePath, svgContent, 'utf8');

  const url = `/uploads/${filename}`;
  const db = readDatabase();
  const newAsset = {
    id: `media-${Date.now()}`,
    filename,
    originalName: `${cleanTitle} — Technical Thumbnail.svg`,
    url,
    mimeType: 'image/svg+xml',
    type: 'image' as const,
    sizeBytes: Buffer.byteLength(svgContent, 'utf8'),
    dimensions: '1200x675 (16:9)',
    altText: `${cleanTitle} Technical Architecture Thumbnail`,
    uploadedAt: new Date().toISOString(),
  };

  db.media.unshift(newAsset);
  writeDatabase(db);
  res.status(201).json({ asset: newAsset, url });
});

// Delete media asset
app.delete('/api/admin/media/:id', requireAdmin, (req: Request, res: Response) => {
  const db = readDatabase();
  const { id } = req.params;
  const asset = db.media.find((m) => m.id === id);

  if (!asset) {
    res.status(404).json({ error: 'Media asset not found.' });
    return;
  }

  // Remove local file if stored in /uploads/
  if (asset.url.startsWith('/uploads/')) {
    const filePath = path.join(UPLOADS_DIR, path.basename(asset.url));
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn('Failed to unlink file:', e);
      }
    }
  }

  db.media = db.media.filter((m) => m.id !== id);
  writeDatabase(db);
  res.json({ deletedId: id });
});

// Update Developer Profile & Website Settings
app.put('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  const db = readDatabase();
  const body = req.body || {};

  db.settings = {
    ...db.settings,
    ...body,
  };

  writeDatabase(db);
  res.json({ settings: db.settings });
});

// ============================================================================
// VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVING
// ============================================================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aether Portfolio & CMS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
