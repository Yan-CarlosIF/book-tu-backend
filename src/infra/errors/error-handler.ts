import type { NextFunction, Request, Response } from "express";

import { AppError } from "./app-error.ts";

export async function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message,
    });
  }

  return response.status(500).json({
    message: "Internal Server Error",
  });
}
