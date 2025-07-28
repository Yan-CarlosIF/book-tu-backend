import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  SECRET_TOKEN: z.string(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_URL: z.string().default("http://localhost:3333"),
  REDIS_URL: z.string().default("redis://redis:6379"),
  REDIS_TEST_URL: z.string().default("redis://localhost:6379"),
});

export const env = envSchema.parse(process.env);
