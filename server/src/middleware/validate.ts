import type { Request, Response, NextFunction } from "express";
import { flattenError, type ZodType } from "zod";
import { ApiError } from "../utils/ApiError.js";

type ValidationTarget = "body" | "query" | "params";

export function validate(schema: ZodType, target: ValidationTarget = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      next(ApiError.badRequest("Validation failed", flattenError(result.error)));
      return;
    }

    if (target === "query") {
      // req.query is a getter-only accessor in Express 5 (no setter defined),
      // so a plain assignment throws under strict mode (ESM). It is still
      // `configurable`, so redefine it as a normal writable data property.
      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      req[target] = result.data;
    }

    next();
  };
}
