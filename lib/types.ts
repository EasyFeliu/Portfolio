export type Project = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  year: number;
  repoUrl: string | null;
  demoUrl: string | null;
  featured: boolean;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export type ProjectsResponse = {
  ok: true;
  count: number;
  projects: Project[];
};

export type ApiErrorResponse = {
  ok: false;
  error: string;
  message: string;
  errors?: Record<string, string>;
};

export type ContactSuccessResponse = {
  ok: true;
  id: number;
  message: string;
};
