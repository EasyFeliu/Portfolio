import type {
  ApiErrorResponse,
  ContactData,
  ContactSuccessResponse,
  Project,
  ProjectsResponse,
} from "@portfolio/shared";

import { siteConfig } from "@/lib/config";

/** Única capa que habla con el backend: los componentes no usan `fetch`. */
function apiUrl(path: string): string {
  return `${siteConfig.apiBaseUrl}${path}`;
}

/** La API no ha respondido (red caída, backend apagado, CORS…). */
export class ApiUnreachableError extends Error {
  constructor(cause?: unknown) {
    super("No se pudo contactar con la API.");
    this.name = "ApiUnreachableError";
    this.cause = cause;
  }
}

export async function fetchProjects(signal?: AbortSignal): Promise<Project[]> {
  const response = await fetch(apiUrl("/api/projects"), { signal, cache: "no-store" });
  if (!response.ok) {
    throw new Error(`GET /api/projects respondió ${response.status}`);
  }
  const data = (await response.json()) as ProjectsResponse;
  return data.projects ?? [];
}

export type ContactResult =
  | { ok: true; message: string }
  | { ok: false; message: string; errors: Record<string, string> };

export async function submitContact(input: ContactData): Promise<ContactResult> {
  let response: Response;
  try {
    response = await fetch(apiUrl("/api/contact"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch (error) {
    throw new ApiUnreachableError(error);
  }

  const data = (await response.json()) as ContactSuccessResponse | ApiErrorResponse;

  if (!response.ok || !data.ok) {
    const error = data as ApiErrorResponse;
    return { ok: false, message: error.message, errors: error.errors ?? {} };
  }

  return { ok: true, message: data.message };
}
