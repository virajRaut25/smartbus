function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),

  mongoUri: requireEnv("MONGO_URI"),

  redisHost: process.env.REDIS_HOST ?? "localhost",
  redisPort: Number(process.env.REDIS_PORT ?? 6379),

  clientUrl: requireEnv("CLIENT_URL"),

  jwtAccessSecret: requireEnv("JWT_ACCESS_SECRET"),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  jwtRefreshSecret: requireEnv("JWT_REFRESH_SECRET"),
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",

  refreshCookieName: process.env.REFRESH_COOKIE_NAME ?? "sb_refresh_token",
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
};
