import type { Response } from 'express';
import { HttpStatus, type HttpStatusCode } from '../constants/http.constants.js';
import type { ApiResponse } from '../types/api.types.js';

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message = 'Operation completed successfully',
  statusCode: HttpStatusCode = HttpStatus.OK,
): Response {
  const responsePayload: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  return res.status(statusCode).json(responsePayload);
}

export function sendError(
  res: Response,
  message = 'An error occurred',
  statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  errors?: unknown,
): Response {
  const responsePayload: ApiResponse = {
    success: false,
    message,
    ...(errors !== undefined && { errors }),
  };
  return res.status(statusCode).json(responsePayload);
}
