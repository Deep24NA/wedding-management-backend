import type { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../constants/http.constants.js';
import { AppError } from '../utils/errors.js';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, HttpStatus.NOT_FOUND));
};

