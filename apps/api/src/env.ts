import path from "node:path";

import { DEFAULT_GITHUB_USER } from "@portfolio/shared";

/**
 * Carga `.env.local` y `.env` si existen. Las variables ya presentes en el
 * entorno tienen prioridad, así que en producción basta con definirlas ahí.
 */
function loadEnvFiles(): void {
  for (const file of [".env.local", ".env"]) {
    try {
      process.loadEnvFile(path.resolve(process.cwd(), file));
    } catch {
      // El fichero no existe: seguimos con las variables del sistema.
    }
  }
}

loadEnvFiles();

function str(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

function positiveInt(name: string, fallback: number): number {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function bool(name: string, fallback: boolean): boolean {
  const value = process.env[name]?.trim().toLowerCase();
  if (value === undefined || value.length === 0) return fallback;
  return value === "true" || value === "1";
}

function list(name: string, fallback: string[]): string[] {
  const value = process.env[name]?.trim();
  if (!value) return fallback;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/** Configuración del backend, toda en un sitio y con valores por defecto. */
export const env = {
  nodeEnv: str("NODE_ENV", "development"),
  host: str("HOST", "0.0.0.0"),
  port: positiveInt("PORT", 4000),
  /** Ruta del fichero SQLite, relativa a `apps/api` si no es absoluta. */
  databasePath: str("DATABASE_PATH", "data/portfolio.db"),
  /** Orígenes autorizados a llamar a la API directamente desde el navegador. */
  corsOrigins: list("CORS_ORIGINS", ["http://localhost:3000"]),
  /** Necesario para leer la IP real cuando el frontend hace de proxy. */
  trustProxy: bool("TRUST_PROXY", true),
  contactRateLimit: {
    maxRequests: positiveInt("CONTACT_RATE_LIMIT_MAX", 5),
    windowMinutes: positiveInt("CONTACT_RATE_LIMIT_WINDOW_MINUTES", 10),
  },
  /** Usuario de GitHub con el que se construyen las URLs de los proyectos. */
  githubUser: str("GITHUB_USER", DEFAULT_GITHUB_USER),
} as const;

export const isProduction = env.nodeEnv === "production";
