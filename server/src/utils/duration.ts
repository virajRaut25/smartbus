const UNIT_TO_SECONDS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
};

export function parseDurationToSeconds(duration: string): number {
  const match = /^(\d+)(s|m|h|d)$/.exec(duration.trim());
  if (!match) {
    throw new Error(
      `Invalid duration format: "${duration}". Expected formats like "30s", "15m", "2h", "7d".`
    );
  }
  const [, amount, unit] = match;
  return Number(amount) * UNIT_TO_SECONDS[unit];
}
