import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { HttpStatus, type HttpStatusCode } from '../constants/http.constants.js';
import { AppError } from '../utils/errors.js';

/**
 * Global centralized error-handling middleware.
 * Ensures consistent response schemas, protects sensitive internal details in production,
 * and handles operational, validation, parsing, and payload errors gracefully.
 */
export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let errors: unknown = undefined;

  // 1. Handle malformed JSON body payloads
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    (err as { status: number }).status === 400 &&
    'body' in err
  ) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Malformed JSON payload in request body';
  }
  // 2. Handle request body payload limits exceeded
  else if (
    (typeof err === 'object' &&
      err !== null &&
      'type' in err &&
      (err as { type: string }).type === 'entity.too.large') ||
    (typeof err === 'object' &&
      err !== null &&
      'status' in err &&
      (err as { status: number }).status === 413)
  ) {
    statusCode = HttpStatus.PAYLOAD_TOO_LARGE;
    message = `Payload too large. Maximum allowed size is ${env.BODY_SIZE_LIMIT}`;
  }
  // 3. Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = 'Validation error';
    errors = err.issues;
  }
  // 4. Handle custom operational application errors
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // 5. Handle generic unexpected errors
  else if (err instanceof Error) {
    if (env.NODE_ENV !== 'production') {
      message = err.message;
    }
  }

  const responsePayload: {
    success: boolean;
    message: string;
    errors?: unknown;
    stack?: string;
  } = {
    success: false,
    message,
  };

  if (errors !== undefined) {
    responsePayload.errors = errors;
  }

  // Protect sensitive information: never expose stack traces in production
  if (env.NODE_ENV !== 'production' && err instanceof Error && err.stack) {
    responsePayload.stack = err.stack;
  }

  // Log unhandled server errors on the backend
  if (statusCode >= 500) {
    console.error('💥 [Server Error]:', err);
  }

  res.status(statusCode).json(responsePayload);
};
