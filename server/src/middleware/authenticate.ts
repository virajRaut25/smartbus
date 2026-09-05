import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/token.service.js";
import { ApiError } from "../utils/ApiError.js";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(ApiError.unauthorized("Missing or invalid authorization header"));
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired access token"));
  }
}
