import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  TRUST_PROXY: z.string().default('false'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  BODY_SIZE_LIMIT: z.string().default('10kb'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables configuration:', parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;

/**
 * Parses the TRUST_PROXY environment string into an Express trust proxy compatible argument.
 */
export function parseTrustProxy(trustProxySetting: string): boolean | number | string {
  const normalized = trustProxySetting.trim().toLowerCase();
  if (normalized === 'true') {
    return true;
  }
  if (normalized === 'false') {
    return false;
  }
  const numericValue = Number(normalized);
  if (!Number.isNaN(numericValue) && Number.isInteger(numericValue)) {
    return numericValue;
  }
  return trustProxySetting.trim();
}

