/**
 * Configuración pública del sitio (se incluye en el bundle del cliente, así que
 * aquí solo puede haber variables `NEXT_PUBLIC_*` y valores no sensibles).
 * La configuración de servidor vive junto a quien la usa: `lib/db.ts` y
 * `lib/rate-limit.ts`.
 */
const DEFAULTS = {
  siteUrl: "http://localhost:3000",
  githubUser: "EasyFeliu",
  linkedinUser: "luisfeliu",
  email: "hola@luisfeliu.dev",
} as const;

function env(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

const githubUser = env("NEXT_PUBLIC_GITHUB_USER", DEFAULTS.githubUser);
const linkedinUser = env("NEXT_PUBLIC_LINKEDIN_USER", DEFAULTS.linkedinUser);

export const siteConfig = {
  /** URL pública del sitio; se usa como base de los metadatos Open Graph. */
  url: env("NEXT_PUBLIC_SITE_URL", DEFAULTS.siteUrl),
  email: env("NEXT_PUBLIC_CONTACT_EMAIL", DEFAULTS.email),
  github: {
    user: githubUser,
    handle: `@${githubUser}`,
    profileUrl: `https://github.com/${githubUser}`,
    /** URL de un repositorio del usuario configurado. */
    repoUrl: (repo: string) => `https://github.com/${githubUser}/${repo}`,
  },
  linkedin: {
    user: linkedinUser,
    handle: `/in/${linkedinUser}`,
    profileUrl: `https://www.linkedin.com/in/${linkedinUser}`,
  },
} as const;
