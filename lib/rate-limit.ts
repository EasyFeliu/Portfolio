type Bucket = {
  count: number;
  resetAt: number;
};

type GlobalWithBuckets = typeof globalThis & {
  __portfolioRateLimit?: Map<string, Bucket>;
};

const globalWithBuckets = globalThis as GlobalWithBuckets;
const buckets = (globalWithBuckets.__portfolioRateLimit ??= new Map<string, Bucket>());

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Límite de peticiones en memoria (ventana fija). Suficiente para una sola
 * instancia; para varios procesos haría falta Redis o similar.
 */
export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000): RateLimitResult {
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
