import { createUser, findByEmailWithPassword, findById } from "../repositories/user.repository.js";
import {
  storeRefreshToken,
  pruneStaleSessions,
  isRefreshTokenValid,
  revokeRefreshToken,
  revokeAllRefreshTokens,
} from "../repositories/refreshToken.repository.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_TOKEN_TTL_SECONDS,
  type RefreshTokenPayload,
} from "./token.service.js";
import { ApiError } from "../utils/ApiError.js";
import type { IUser } from "../models/user.model.js";
import type { Role } from "../types/enums.js";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: Role;
  operatorId?: string;
}

export interface LoginResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export function register(input: RegisterInput): Promise<IUser> {
  return createUser(input);
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const user = await findByEmailWithPassword(email);
  if (!user) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const userId = user._id.toString();

  const accessToken = signAccessToken({
    sub: userId,
    role: user.role,
    operatorId: user.operatorId?.toString(),
  });

  const { token: refreshToken, jti, expiresAt } = signRefreshToken(userId);
  await storeRefreshToken(userId, jti, REFRESH_TOKEN_TTL_SECONDS);
  await pruneStaleSessions(userId);

  return { user, accessToken, refreshToken, refreshTokenExpiresAt: expiresAt };
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export async function refresh(refreshTokenValue: string): Promise<RefreshResult> {
  let payload: RefreshTokenPayload;
  try {
    payload = verifyRefreshToken(refreshTokenValue);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const { sub: userId, jti } = payload;

  const isValid = await isRefreshTokenValid(userId, jti);
  if (!isValid) {
    await revokeAllRefreshTokens(userId);
    throw ApiError.unauthorized("Refresh token reuse detected; all sessions revoked");
  }

  await revokeRefreshToken(userId, jti);

  const user = await findById(userId);
  if (!user) {
    throw ApiError.unauthorized("Invalid session");
  }

  const accessToken = signAccessToken({
    sub: userId,
    role: user.role,
    operatorId: user.operatorId?.toString(),
  });

  const { token: newRefreshToken, jti: newJti, expiresAt } = signRefreshToken(userId);
  await storeRefreshToken(userId, newJti, REFRESH_TOKEN_TTL_SECONDS);
  await pruneStaleSessions(userId);

  return { accessToken, refreshToken: newRefreshToken, refreshTokenExpiresAt: expiresAt };
}

export async function logout(refreshTokenValue: string | undefined): Promise<void> {
  if (!refreshTokenValue) return;

  let payload: RefreshTokenPayload;
  try {
    payload = verifyRefreshToken(refreshTokenValue);
  } catch {
    return;
  }

  await revokeRefreshToken(payload.sub, payload.jti);
}

export function logoutAll(userId: string): Promise<void> {
  return revokeAllRefreshTokens(userId);
}

export async function getCurrentUser(userId: string): Promise<IUser> {
  const user = await findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }
  return user;
}
