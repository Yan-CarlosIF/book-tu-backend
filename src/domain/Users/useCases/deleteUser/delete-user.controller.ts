import type { Request, Response } from "express";
import { container } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { DeleteUserUseCase } from "./delete-user.useCase";

export class DeleteUserController {
  async handle(request: Request<{ id: string }>, response: Response) {
    const { id } = request.user;
    
    const { id: userId } = request.params;

    if (id === userId) {
      throw new AppError("You cannot delete yourself", 400);
    }

    const deleteUserUseCase = container.resolve(DeleteUserUseCase);

    await deleteUserUseCase.execute(userId);

    return response.status(204).send();
  }
}
