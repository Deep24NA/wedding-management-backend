import type { CorsOptions } from 'cors';
import helmet from 'helmet';
import { env } from './env.js';
import { HttpStatus } from '../constants/http.constants.js';
import { AppError } from '../utils/errors.js';

/**
 * Helmet configuration tailored for a JSON REST API backend.
 * 
 * Note on Content Security Policy (CSP):
 * This service is exclusively a headless REST API providing JSON responses rather
 * than serving browser-rendered HTML documents. Therefore, browser CSP script/style
 * evaluation directives are disabled to avoid unnecessary header overhead, while
 * strictly retaining HTTP transport, framing, MIME sniffing, and cross-origin protections.
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: env.NODE_ENV === 'production'
    ? {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      }
    : false,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

/**
 * CORS configuration supporting configurable frontend origins and credentials.
 */
export const getCorsOptions = (): CorsOptions => {
  const allowedOrigins = env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new AppError(`Origin '${origin}' is not allowed by CORS policy.`, HttpStatus.FORBIDDEN)
      );
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    maxAge: 86400, // 24 hours preflight cache
    optionsSuccessStatus: HttpStatus.NO_CONTENT,
  };
};

