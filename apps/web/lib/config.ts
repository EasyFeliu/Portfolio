import { DEFAULT_GITHUB_USER, githubProfileUrl } from "@portfolio/shared";

/**
 * Configuración pública del frontend (se incluye en el bundle del cliente, así
 * que aquí solo puede haber variables `NEXT_PUBLIC_*` y valores no sensibles).
 */
const DEFAULTS = {
  siteUrl: "http://localhost:3000",
  linkedinUser: "luisfeliu",
  email: "hola@luisfeliu.dev",
} as const;

function env(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

const githubUser = env("NEXT_PUBLIC_GITHUB_USER", DEFAULT_GITHUB_USER);
const linkedinUser = env("NEXT_PUBLIC_LINKEDIN_USER", DEFAULTS.linkedinUser);

export const siteConfig = {
  /** URL pública del sitio; se usa como base de los metadatos Open Graph. */
  url: env("NEXT_PUBLIC_SITE_URL", DEFAULTS.siteUrl),
  email: env("NEXT_PUBLIC_CONTACT_EMAIL", DEFAULTS.email),
  /**
   * Base de las llamadas a la API. Vacío = mismo origen, resuelto por el proxy
   * configurado en `next.config.ts`.
   */
  apiBaseUrl: env("NEXT_PUBLIC_API_BASE_URL", ""),
  github: {
    user: githubUser,
    handle: `@${githubUser}`,
    profileUrl: githubProfileUrl(githubUser),
  },
  linkedin: {
    user: linkedinUser,
    handle: `/in/${linkedinUser}`,
    profileUrl: `https://www.linkedin.com/in/${linkedinUser}`,
  },
} as const;
