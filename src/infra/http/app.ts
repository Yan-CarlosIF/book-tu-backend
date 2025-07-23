import "reflect-metadata";
import "express-async-errors";
import "@/infra/container";

import cors from "cors";
import express from "express";

import { errorHandler } from "@/infra/errors/error-handler.ts";

import rateLimiter from "./middlewares/redis-rate-limiter.middleware.ts";

export const app = express();
app.use(cors());
app.use(express.json());

app.use(rateLimiter);

app.get("/health", (request, response) => response.sendStatus(200));

app.use(errorHandler);
