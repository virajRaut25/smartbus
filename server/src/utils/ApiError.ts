export class ApiError extends Error {
  statusCode: number;
  errors?: unknown;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }

  static badRequest(message = "Bad request", errors?: unknown): ApiError {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized", errors?: unknown): ApiError {
    return new ApiError(401, message, errors);
  }

  static forbidden(message = "Forbidden", errors?: unknown): ApiError {
    return new ApiError(403, message, errors);
  }

  static notFound(message = "Not found", errors?: unknown): ApiError {
    return new ApiError(404, message, errors);
  }

  static conflict(message = "Conflict", errors?: unknown): ApiError {
    return new ApiError(409, message, errors);
  }

  static internal(message = "Internal server error", errors?: unknown): ApiError {
    return new ApiError(500, message, errors);
  }
}
