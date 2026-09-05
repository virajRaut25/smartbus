import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { parseDurationToSeconds } from "../utils/duration.js";
import type { Role } from "../types/enums.js";

const ACCESS_TOKEN_TTL_SECONDS = parseDurationToSeconds(env.jwtAccessExpiresIn);
export const REFRESH_TOKEN_TTL_SECONDS = parseDurationToSeconds(env.jwtRefreshExpiresIn);

export interface AccessTokenPayload {
  sub: string;
  role: Role;
  operatorId?: string;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}

export interface SignedRefreshToken {
  token: string;
  jti: string;
  expiresAt: Date;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    algorithm: "HS256",
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtAccessSecret, {
    algorithms: ["HS256"],
  }) as AccessTokenPayload;
}

export function signRefreshToken(userId: string): SignedRefreshToken {
  const jti = crypto.randomUUID();
  const payload: RefreshTokenPayload = { sub: userId, jti };

  const token = jwt.sign(payload, env.jwtRefreshSecret, {
    algorithm: "HS256",
    expiresIn: REFRESH_TOKEN_TTL_SECONDS,
  });

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000);

  return { token, jti, expiresAt };
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.jwtRefreshSecret, {
    algorithms: ["HS256"],
  }) as RefreshTokenPayload;
}
