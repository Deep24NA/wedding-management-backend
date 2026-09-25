import rateLimit, { type Options } from 'express-rate-limit';
import { globalRateLimitConfig } from '../config/rate-limit.js';

/**
 * Global rate limiter middleware applying baseline traffic restrictions across API endpoints.
 */
export const globalRateLimiter = rateLimit(globalRateLimitConfig);

/**
 * Factory for route-specific rate limiters (e.g., auth, password resets, OTP).
 */
export const createRateLimiter = (options?: Partial<Options>) => {
  return rateLimit({
    ...globalRateLimitConfig,
    ...options,
  });
};
