import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/ApiResponse.js";

export function notFound(req: Request, res: Response, _next: NextFunction): void {
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}
