/**
 * Rate limiter with Upstash Redis + in-memory fallback.
 *
 * If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set,
 * uses durable Redis-backed limiting. Otherwise falls back to
 * an in-memory Map (best-effort under serverless scaling).
 */

let upstashClient: unknown = null;
let upstashTried = false;

async function getUpstash() {
  if (upstashTried) return upstashClient;
  upstashTried = true;
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  try {
    const { Redis } = await import("@upstash/redis").catch(() => ({
      Redis: null,
    }));
    if (!Redis) return null;
    upstashClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    return upstashClient;
  } catch {
    return null;
  }
}

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();

let lastCleanup = 0;
function maybeCleanupMemory() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [k, v] of memoryBuckets.entries()) {
    if (v.resetAt < now) memoryBuckets.delete(k);
  }
}

function memoryLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const existing = memoryBuckets.get(key);

  if (!existing || existing.resetAt < now) {
    memoryBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  return true;
}

/**
 * Check if a request is within rate limits.
 * @param ip        Client IP address
 * @param namespace Route namespace (e.g. "audit", "chat")
 * @param limit     Max requests allowed in the window
 * @param windowMs  Window duration in ms (default: 1 hour)
 * @returns true if allowed, false if rate-limited
 */
export async function checkRateLimit(
  ip: string,
  namespace: string,
  limit: number,
  windowMs: number = 60 * 60 * 1000
): Promise<boolean> {
  maybeCleanupMemory();
  const bucketKey = `${namespace}:ip:${ip}`;
  const windowSec = Math.ceil(windowMs / 1000);

  const upstash = (await getUpstash()) as {
    incr: (key: string) => Promise<number>;
    expire: (key: string, sec: number) => Promise<unknown>;
  } | null;

  if (upstash) {
    try {
      const count = await upstash.incr(bucketKey);
      if (count === 1) {
        await upstash.expire(bucketKey, windowSec);
      }
      return count <= limit;
    } catch {
      // Fall through to memory
    }
  }

  return memoryLimit(bucketKey, limit, windowMs);
}
