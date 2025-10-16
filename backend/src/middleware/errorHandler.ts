import { Request, Response, NextFunction } from "express";

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error response interface
 */
interface ErrorResponse {
  error: string;
  details?: string | string[];
  timestamp: string;
  path: string;
  method: string;
}

/**
 * Global error handling middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const timestamp = new Date().toISOString();
  const path = req.path;
  const method = req.method;

  // Log error
  console.error(`[${timestamp}] ${method} ${path} - Error:`, {
    message: err.message,
    stack: err.stack,
    statusCode: err instanceof AppError ? err.statusCode : 500,
  });

  // Determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // Prepare error response
  const errorResponse: ErrorResponse = {
    error: err.message || "Internal server error",
    timestamp,
    path,
    method,
  };

  // Add details in development mode
  if (process.env.NODE_ENV === "development") {
    errorResponse.details = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  const errorResponse: ErrorResponse = {
    error: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  res.status(404).json(errorResponse);
}

/**
 * Async error wrapper
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
