import { env } from "./env";

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

const WINDOW_MS = env.contactRateLimit.windowMinutes * 60 * 1000;

/**
 * Límite de peticiones en memoria (ventana fija). Suficiente para una sola
 * instancia; con varios procesos haría falta un almacén compartido (Redis…).
 */
export function rateLimit(
  key: string,
  limit = env.contactRateLimit.maxRequests,
  windowMs = WINDOW_MS,
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

/** Elimina las ventanas ya caducadas para que el mapa no crezca sin límite. */
export function pruneRateLimitBuckets(now = Date.now()): number {
  let removed = 0;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
      removed += 1;
    }
  }
  return removed;
}
