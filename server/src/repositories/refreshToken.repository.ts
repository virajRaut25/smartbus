import { redis } from "../redis/client.js";
import { refreshTokenKey, refreshTokenSetKey } from "../redis/keys.js";

export async function storeRefreshToken(
  userId: string,
  jti: string,
  ttlSeconds: number
): Promise<void> {
  await redis.set(refreshTokenKey(userId, jti), "1", "EX", ttlSeconds);
  await redis.sadd(refreshTokenSetKey(userId), jti);
}

export async function isRefreshTokenValid(userId: string, jti: string): Promise<boolean> {
  const exists = await redis.exists(refreshTokenKey(userId, jti));
  return exists === 1;
}

export async function revokeRefreshToken(userId: string, jti: string): Promise<void> {
  await redis.del(refreshTokenKey(userId, jti));
  await redis.srem(refreshTokenSetKey(userId), jti);
}

export async function revokeAllRefreshTokens(userId: string): Promise<void> {
  const setKey = refreshTokenSetKey(userId);
  const jtis = await redis.smembers(setKey);

  if (jtis.length > 0) {
    const keys = jtis.map((jti) => refreshTokenKey(userId, jti));
    await redis.del(...keys);
  }

  await redis.del(setKey);
}

export async function pruneStaleSessions(userId: string): Promise<void> {
  const setKey = refreshTokenSetKey(userId);
  const jtis = await redis.smembers(setKey);
  if (jtis.length === 0) return;

  const staleJtis: string[] = [];
  for (const jti of jtis) {
    const exists = await redis.exists(refreshTokenKey(userId, jti));
    if (exists === 0) staleJtis.push(jti);
  }

  if (staleJtis.length > 0) {
    await redis.srem(setKey, ...staleJtis);
  }
}
