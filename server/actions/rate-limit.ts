'use server';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const RATE_LIMITS = {
  message: { requests: 10, window: 60 }, // 10 msgs per minute
  upload: { requests: 5, window: 3600 }, // 5 uploads per hour
  api: { requests: 100, window: 60 }, // 100 API calls per minute
};

export async function checkRateLimit(userId: string, action: string): Promise<{ ok: boolean; remaining?: number }> {
  const limit = RATE_LIMITS[action as keyof typeof RATE_LIMITS];
  if (!limit) return { ok: true };

  const key = `ratelimit:${userId}:${action}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, limit.window);
  }

  if (current > limit.requests) {
    return { ok: false };
  }

  return { ok: true, remaining: limit.requests - current };
}

export async function getRateLimitStatus(userId: string, action: string) {
  const key = `ratelimit:${userId}:${action}`;
  const current = (await redis.get(key)) as number | null;
  const limit = RATE_LIMITS[action as keyof typeof RATE_LIMITS];

  return {
    used: current || 0,
    limit: limit?.requests || 0,
    window: limit?.window || 0,
  };
}
