import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ZodError, flattenError } from "zod";
import { ApiError } from "../utils/ApiError.js";
import { sendError } from "../utils/ApiResponse.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    sendError(res, err.statusCode, err.message, err.errors);
    return;
  }

  if (err instanceof ZodError) {
    sendError(res, 400, "Validation failed", flattenError(err));
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const fieldErrors = Object.fromEntries(
      Object.entries(err.errors).map(([path, validatorError]) => [path, validatorError.message])
    );
    sendError(res, 400, "Validation failed", fieldErrors);
    return;
  }

  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
    sendError(res, 409, "Duplicate value violates a unique constraint", {
      keyValue: err.keyValue,
    });
    return;
  }

  console.error(err);
  sendError(res, 500, "Internal server error");
}
