import express from 'express';
import cors from 'cors';
import hpp from 'hpp';
import { env, parseTrustProxy } from './config/env.js';
import { helmetConfig, getCorsOptions } from './config/security.js';
import { globalRateLimiter } from './middlewares/rate-limit.middleware.js';
import { notFoundHandler } from './middlewares/not-found.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import rootRouter from './routes/index.js';
import { HttpStatus } from './constants/http.constants.js';

const app = express();

// 1. Trust Proxy Configuration
app.set('trust proxy', parseTrustProxy(env.TRUST_PROXY));

// 2. Hide server fingerprinting
app.disable('x-powered-by');

// 3. Security HTTP headers
app.use(helmetConfig);

// 4. CORS configuration
app.use(cors(getCorsOptions()));

// 5. Block dangerous / unexpected HTTP methods (e.g. TRACE, TRACK)
app.use((req, res, next) => {
  const disallowedMethods = ['TRACE', 'TRACK'];
  if (disallowedMethods.includes(req.method)) {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
      success: false,
      message: `HTTP method ${req.method} is not allowed.`,
    });
    return;
  }
  next();
});

// 6. Request body parsing with strict size limits
app.use(express.json({ limit: env.BODY_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: env.BODY_SIZE_LIMIT }));

// 7. HTTP Parameter Pollution protection
app.use(hpp());

// 8. Global rate limiting
app.use(globalRateLimiter);

// 9. API Routes
app.use('/', rootRouter);
app.use('/api/v1', rootRouter);

// 10. 404 Catch-all handler
app.use(notFoundHandler);

// 11. Global centralized error handler
app.use(errorHandler);

export default app;