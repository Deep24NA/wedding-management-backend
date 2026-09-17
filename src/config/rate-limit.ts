import type { Options } from 'express-rate-limit';
import { env } from './env.js';
import { HttpStatus } from '../constants/http.constants.js';

export const globalRateLimitConfig: Partial<Options> = {
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true, // draft-6 / draft-7 RateLimit-* headers
  legacyHeaders: false, // disable X-RateLimit-* headers
  skip: (req) => {
    // Treat health check endpoints appropriately: skip global rate limiter
    return req.path === '/health' || req.path === '/api/v1/health';
  },
  handler: (req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    });
  },
};

