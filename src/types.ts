export interface ProjectMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
  delta?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  status: 'published' | 'draft';
  featured: boolean;
  thumbnail: string;
  videoUrl?: string;
  summary: string;
  description: string; // Supports full Markdown case study
  architectureNotes: string;
  client: string;
  role: string;
  timeline: string;
  liveUrl: string;
  repoUrl: string;
  techStack: string[];
  metrics: ProjectMetric[];
  gallery: ProjectMediaItem[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  type: 'image' | 'video';
  sizeBytes: number;
  dimensions?: string;
  altText: string;
  uploadedAt: string;
}

export interface DeveloperSettings {
  fullName: string;
  arabicName?: string;
  headline: string;
  subheadline: string;
  bio: string;
  location: string;
  availabilityText: string;
  yearsExperience: string;
  projectsDelivered: string;
  uptimeMetric: string;
  email: string;
  whatsappNumber: string;
  whatsappMessage: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  resumeUrl: string;
  skills: {
    category: string;
    items: string[];
  }[];
  seoTitle: string;
  seoDescription: string;
}
