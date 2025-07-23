import express from "express";
import cors from "cors";
import rateLimiter from "./middlewares/redis-rate-limiter.middleware.ts";
import { errorHandler } from "infra/errors/error-handler.ts";

export const app = express();
app.use(cors());
app.use(express.json());

app.use(rateLimiter);

app.use(errorHandler);

app.get("/health", (request, response) => response.sendStatus(200));
