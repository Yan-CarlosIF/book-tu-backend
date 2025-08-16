import type { NextFunction, Request, Response } from "express";

import { UsersRepository } from "@/domain/Users/infra/typeorm/repositories/users.repository";
import { AppError } from "@/infra/errors/app-error";

export async function ensureUserAdmin(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  if (!request.user) {
    throw new AppError("Usuário não encontrado", 401);
  }

  const usersRepository = new UsersRepository();

  const user = await usersRepository.findById(request.user.id);

  if (!user) {
    throw new AppError("Usuário não encontrado", 401);
  }

  if (user.permission === "admin") {
    return next();
  }

  throw new AppError("Usuário não tem permissão de admin", 403);
}
