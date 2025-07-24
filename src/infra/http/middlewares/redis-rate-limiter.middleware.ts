import type { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "redis";

import { env } from "@/config/env.ts";
import { AppError } from "@/infra/errors/app-error";

const redisClient = redis.createClient({
  url: env.NODE_ENV === "test" ? env.REDIS_TEST_URL : env.REDIS_URL,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rateLimiter",
  points: 50,
  duration: 2,
});

export default async function rateLimiter(
  request: Request,
  _: Response,
  next: NextFunction
) {
  try {
    if (!request.ip) {
      throw new AppError("IP not found", 404);
    }

    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    if (err instanceof Error && err.name === "RateLimiterRes") {
      throw new AppError("Too many requests", 429);
    }

    throw new AppError("Internal Server Error", 500);
  }
}
