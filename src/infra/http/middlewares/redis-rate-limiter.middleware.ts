import { env } from "config/env.ts";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "infra/errors/app-error";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redis from "redis";

const redisClient = redis.createClient({
  url: env.REDIS_URL,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rateLimiter",
  points: 10,
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
  } catch {
    throw new AppError("Too many requests", 429);
  }
}
