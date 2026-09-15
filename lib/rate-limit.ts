type Bucket = {
  count: number;
  resetAt: number;
};

type GlobalWithBuckets = typeof globalThis & {
  __portfolioRateLimit?: Map<string, Bucket>;
};

const globalWithBuckets = globalThis as GlobalWithBuckets;
const buckets = (globalWithBuckets.__portfolioRateLimit ??= new Map<string, Bucket>());

const DEFAULT_MAX_REQUESTS = 5;
const DEFAULT_WINDOW_MINUTES = 10;

function positiveIntFromEnv(name: string, fallback: number): number {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

/** Configuración del límite de peticiones (solo servidor). */
export const rateLimitConfig = {
  maxRequests: positiveIntFromEnv("CONTACT_RATE_LIMIT_MAX", DEFAULT_MAX_REQUESTS),
  windowMinutes: positiveIntFromEnv("CONTACT_RATE_LIMIT_WINDOW_MINUTES", DEFAULT_WINDOW_MINUTES),
} as const;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Límite de peticiones en memoria (ventana fija). Suficiente para una sola
 * instancia; con varios procesos haría falta un almacén compartido (Redis…).
 */
export function rateLimit(
  key: string,
  limit = rateLimitConfig.maxRequests,
  windowMs = rateLimitConfig.windowMinutes * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;
  const retryAfterSeconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  if (bucket.count > limit) {
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return { allowed: true, remaining: Math.max(0, limit - bucket.count), retryAfterSeconds };
}

export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]!.trim();
  }
  return headers.get("x-real-ip")?.trim() || "local";
}
