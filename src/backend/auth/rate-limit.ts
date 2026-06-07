import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (!redisClient) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("Upstash Redis env vars are not configured.");
    }
    redisClient = new Redis({ url, token });
  }
  return redisClient;
}

/**
 * Rate limit check — max N requests per time window per IP.
 * Returns { allowed: true } or { allowed: false, retryAfterSeconds }
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 900 // 15 minutes
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  try {
    const redis = getRedis();
    const key = `rate-limit:${identifier}`;
    const current = await redis.incr(key);

    // Set expiry on first request
    if (current === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (current <= limit) {
      return { allowed: true };
    }

    // Get remaining TTL for retry-after header
    const ttl = await redis.ttl(key);
    return {
      allowed: false,
      retryAfterSeconds: ttl > 0 ? ttl : windowSeconds,
    };
  } catch (err) {
    // If Redis is down, allow the request (fail open for availability)
    console.error("Rate limit check failed:", err);
    return { allowed: true };
  }
}

/**
 * Rate limit for login/register — stricter limits
 * Max 5 attempts per 15 minutes per IP
 */
export async function checkAuthRateLimit(
  ip: string
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  return checkRateLimit(`auth:${ip}`, 5, 900);
}

/**
 * Rate limit for password reset — very strict
 * Max 3 attempts per 24 hours per email
 */
export async function checkPasswordResetRateLimit(
  email: string
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  return checkRateLimit(`password-reset:${email}`, 3, 86400); // 24 hours
}

/**
 * Extract client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}
