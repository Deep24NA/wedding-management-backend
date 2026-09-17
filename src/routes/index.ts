import { Router, type Request, type Response } from 'express';
import { sendSuccess } from '../utils/api-response.js';

const router = Router();

/**
 * Health check endpoint for container orchestrators, load balancers, and monitoring.
 */
router.get('/health', (_req: Request, res: Response) => {
  sendSuccess(
    res,
    {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    'Wedding Management Backend service is healthy.'
  );
});

export default router;

