import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const TIME_MS = {
  ONE_SECOND: 1000,
  THIRTY_SECONDS: 30 * 1000,
  ONE_MINUTE: 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
} as const;

const SIZE = {
  DEFAULT_POOL_SIZE: 10,
  DEFAULT_BODY_LIMIT: "10mb",
} as const;

export const NodeEnv = {
  Development: "development",
  Production: "production",
  Test: "test",
} as const;

const envSchema = z.object({
  NODE_ENV: z
    .enum([NodeEnv.Development, NodeEnv.Production, NodeEnv.Test])
    .default(NodeEnv.Development),
  PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default("8080"),
  DB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32),
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform(Number)
    .default(String(TIME_MS.FIFTEEN_MINUTES)),
  RATE_LIMIT_MAX: z.string().transform(Number).default("100"),
  SERVICE_NAME: z.string().default("backend-service"),
  BODY_LIMIT: z.string().default(SIZE.DEFAULT_BODY_LIMIT),
  MONGODB_POOL_SIZE: z
    .string()
    .transform(Number)
    .default(String(SIZE.DEFAULT_POOL_SIZE)),
  MONGODB_MAX_IDLE_TIME_MS: z
    .string()
    .transform(Number)
    .default(String(TIME_MS.ONE_MINUTE)),
  REQUEST_TIMEOUT_MS: z
    .string()
    .transform(Number)
    .default(String(TIME_MS.THIRTY_SECONDS)),
});

const env = envSchema.parse(process.env);

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  serviceName: env.SERVICE_NAME,
  dbUri: env.DB_URI,
  mongodb: {
    poolSize: env.MONGODB_POOL_SIZE,
    maxIdleTimeMS: env.MONGODB_MAX_IDLE_TIME_MS,
  },
  jwtSecret: env.JWT_SECRET,
  cors: {
    origin: env.CORS_ORIGIN,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  },
  http: {
    bodyLimit: env.BODY_LIMIT,
    timeout: env.REQUEST_TIMEOUT_MS,
  },
} as const;
