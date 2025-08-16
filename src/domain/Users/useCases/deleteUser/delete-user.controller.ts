import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { AppError } from "@/infra/errors/app-error";

import { DeleteUserUseCase } from "./delete-user.useCase";

const deleteUserParamsSchema = z.object({
  id: z.string().uuid(),
});

export class DeleteUserController {
  async handle(request: Request<{ id: string }>, response: Response) {
    const { id } = request.user;

    const { id: userId } = deleteUserParamsSchema.parse(request.params);

    if (id === userId) {
      throw new AppError("Você não pode deletar sua própria conta", 400);
    }

    const deleteUserUseCase = container.resolve(DeleteUserUseCase);

    await deleteUserUseCase.execute(userId);

    return response.status(204).send();
  }
}
