export function refreshTokenKey(userId: string, jti: string): string {
  return `refresh:${userId}:${jti}`;
}

export function refreshTokenSetKey(userId: string): string {
  return `refresh:user:${userId}`;
}
