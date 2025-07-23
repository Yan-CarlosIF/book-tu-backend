import { env } from "config/env.ts";
import { RateLimiterRedis } from "rate-limiter-flexible";
import type { Request, Response, NextFunction } from "express";
import { createClient } from "redis";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

await redisClient.connect();

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
      throw new Error("IP not found");
    }

    await limiter.consume(request.ip);

    return next();
  } catch {
    throw new Error("Too many requests");
  }
}
