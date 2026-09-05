import type { Request, Response } from "express";
import * as authService from "../services/auth.service.js";
import { sendSuccess } from "../utils/ApiResponse.js";
import { env } from "../config/env.js";
import type { RegisterBody, LoginBody } from "../validators/auth.validator.js";

const REFRESH_COOKIE_PATH = "/api/auth";

function setRefreshCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(env.refreshCookieName, token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    domain: env.cookieDomain,
    maxAge: Math.max(0, expiresAt.getTime() - Date.now()),
  });
}

function clearRefreshCookie(res: Response): void {
  res.clearCookie(env.refreshCookieName, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    path: REFRESH_COOKIE_PATH,
    domain: env.cookieDomain,
  });
}

export async function register(req: Request, res: Response): Promise<void> {
  const body = req.body as RegisterBody;
  const user = await authService.register(body);
  sendSuccess(res, 201, "User registered successfully", { user });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as LoginBody;
  const { user, accessToken, refreshToken, refreshTokenExpiresAt } = await authService.login(
    email,
    password
  );
  setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
  sendSuccess(res, 200, "Login successful", { accessToken, user });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const refreshTokenValue = req.cookies?.[env.refreshCookieName];
  const { accessToken, refreshToken, refreshTokenExpiresAt } = await authService.refresh(
    refreshTokenValue
  );
  setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
  sendSuccess(res, 200, "Token refreshed", { accessToken });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const refreshTokenValue = req.cookies?.[env.refreshCookieName];
  await authService.logout(refreshTokenValue);
  clearRefreshCookie(res);
  sendSuccess(res, 200, "Logged out");
}

export async function logoutAll(req: Request, res: Response): Promise<void> {
  await authService.logoutAll(req.user!.sub);
  clearRefreshCookie(res);
  sendSuccess(res, 200, "Logged out of all devices");
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await authService.getCurrentUser(req.user!.sub);
  sendSuccess(res, 200, "OK", { user });
}
