import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { AppError } from "./app-error.ts";

export async function errorHandler(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    const message = error.errors.map((err) => err.message);

    return response.status(400).json({
      message: message[0],
    });
  }

  console.error(error);
  return response.status(500).json({
    message: "Internal Server Error",
  });
}
