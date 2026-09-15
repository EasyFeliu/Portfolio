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

export type HealthResponse = {
  ok: true;
  status: "ok";
  timestamp: string;
  uptimeSeconds: number;
  database: { ok: boolean; projects: number; messages: number };
};

export type ProjectsResponse = {
  ok: true;
  count: number;
  projects: Project[];
};

export type ContactSuccessResponse = {
  ok: true;
  id: number;
  message: string;
};

/** Códigos de error que puede devolver la API. */
export type ApiErrorCode =
  | "INVALID_JSON"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "DATABASE_ERROR"
  | "NOT_FOUND"
  | "INTERNAL_ERROR";

export type ApiErrorResponse = {
  ok: false;
  error: ApiErrorCode;
  message: string;
  /** Mensaje de error por campo (solo en `VALIDATION_ERROR`). */
  errors?: Record<string, string>;
};
