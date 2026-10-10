import { redis } from "../redis/client.js";
import { seatLockKey } from "../redis/keys.js";

const RELEASE_IF_OWNER_SCRIPT = `
  if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
  else
    return 0
  end
`;

export async function acquireSeatLock(
  tripId: string,
  seatNumber: string,
  lockOwnerId: string,
  ttlSeconds: number
): Promise<boolean> {
  const result = await redis.set(
    seatLockKey(tripId, seatNumber),
    lockOwnerId,
    "EX",
    ttlSeconds,
    "NX"
  );
  return result === "OK";
}

export async function releaseSeatLock(
  tripId: string,
  seatNumber: string,
  lockOwnerId: string
): Promise<boolean> {
  const result = await redis.eval(
    RELEASE_IF_OWNER_SCRIPT,
    1,
    seatLockKey(tripId, seatNumber),
    lockOwnerId
  );
  return result === 1;
}

export function getSeatLockOwner(tripId: string, seatNumber: string): Promise<string | null> {
  return redis.get(seatLockKey(tripId, seatNumber));
}

export function getSeatLockTtlSeconds(tripId: string, seatNumber: string): Promise<number> {
  return redis.ttl(seatLockKey(tripId, seatNumber));
}

export function getSeatLockOwners(
  tripId: string,
  seatNumbers: string[]
): Promise<(string | null)[]> {
  if (seatNumbers.length === 0) return Promise.resolve([]);

  const pipeline = redis.pipeline();
  seatNumbers.forEach((seatNumber) => pipeline.get(seatLockKey(tripId, seatNumber)));

  return pipeline.exec().then((results) => {
    if (!results) return seatNumbers.map(() => null);
    return results.map(([, value]) => value as string | null);
  });
}
