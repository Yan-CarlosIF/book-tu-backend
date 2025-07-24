import type { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { env } from "@/config/env";
import { AppError } from "@/infra/errors/app-error";

interface ITokenPayload {
  sub: string;
}

export async function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError("Token not found", 401);
  }

  const [, token] = authorization.split(" ");

  try {
    const { sub: userId } = verify(token, env.SECRET_TOKEN) as ITokenPayload;

    request.user = { id: userId };

    return next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
}
