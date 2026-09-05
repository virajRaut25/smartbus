import type { Request, Response, NextFunction } from "express";
import { flattenError, type ZodType } from "zod";
import { ApiError } from "../utils/ApiError.js";

export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(ApiError.badRequest("Validation failed", flattenError(result.error)));
      return;
    }

    req.body = result.data;
    next();
  };
}
