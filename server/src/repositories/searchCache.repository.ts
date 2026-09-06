import { redis } from "../redis/client.js";
import type { SearchTripsResult } from "./trip.repository.js";

export async function getCachedSearchResults(key: string): Promise<SearchTripsResult | null> {
  const cached = await redis.get(key);
  if (!cached) return null;
  // Cache holds plain JSON (from JSON.stringify), not live Mongoose documents —
  // fine here since the only consumer is an HTTP JSON response either way.
  return JSON.parse(cached) as SearchTripsResult;
}

export async function setCachedSearchResults(
  key: string,
  result: SearchTripsResult,
  ttlSeconds: number
): Promise<void> {
  await redis.set(key, JSON.stringify(result), "EX", ttlSeconds);
}
