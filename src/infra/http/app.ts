import "reflect-metadata";
import "express-async-errors";
import "@/infra/container";

import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

import { errorHandler } from "@/infra/errors/error-handler.ts";
import connectWithDatabase from "@/infra/typeorm";

import rateLimiter from "./middlewares/redis-rate-limiter.middleware.ts";
import { router } from "./routes/_index.ts";

connectWithDatabase();

export const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use(rateLimiter);

app.get("/health", (request, response) => response.sendStatus(200));

const swaggerFile = path.join(__dirname, "../../../swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFile, "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(router);

app.use(errorHandler);
