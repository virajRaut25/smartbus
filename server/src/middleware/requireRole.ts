import type { Request, Response, NextFunction } from "express";
import type { Role } from "../types/enums.js";
import { ApiError } from "../utils/ApiError.js";

export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(ApiError.unauthorized());
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(ApiError.forbidden());
      return;
    }

    next();
  };
}
