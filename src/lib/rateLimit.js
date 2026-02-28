// Simple in-memory rate limiter (per-process, resets on deploy)
const tokenBuckets = new Map();

const CLEANUP_INTERVAL = 60 * 1000; // Clean up stale entries every minute

// Periodic cleanup to prevent memory leaks
let cleanupTimer = null;
function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of tokenBuckets) {
      if (now - bucket.lastRefill > bucket.windowMs * 2) {
        tokenBuckets.delete(key);
      }
    }
  }, CLEANUP_INTERVAL);
  // Don't block Node from exiting
  if (cleanupTimer.unref) cleanupTimer.unref();
}

/**
 * Rate limit by IP address.
 * @param {Request} request - The incoming request
 * @param {object} options
 * @param {number} options.limit - Max requests per window
 * @param {number} options.windowMs - Window size in milliseconds
 * @returns {{ success: boolean, remaining: number }} Whether the request is allowed
 */
export function rateLimit(request, { limit = 20, windowMs = 60 * 1000 } = {}) {
  ensureCleanup();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const key = `${ip}:${request.nextUrl?.pathname || request.url}`;
  const now = Date.now();

  let bucket = tokenBuckets.get(key);
  if (!bucket || now - bucket.lastRefill > windowMs) {
    bucket = { tokens: limit, lastRefill: now, windowMs };
    tokenBuckets.set(key, bucket);
  }

  if (bucket.tokens > 0) {
    bucket.tokens--;
    return { success: true, remaining: bucket.tokens };
  }

  return { success: false, remaining: 0 };
}
