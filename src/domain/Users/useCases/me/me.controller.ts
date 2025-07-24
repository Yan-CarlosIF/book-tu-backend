import { Request, Response } from "express";
import { container } from "tsyringe";

import { userMapper } from "../../mapper/user.mapper";
import { MeUseCase } from "./me.useCase";

export class MeController {
  async handle(request: Request, response: Response) {
    const { id } = request.user;

    const meUseCase = container.resolve(MeUseCase);

    const user = await meUseCase.execute(id);

    return response.status(200).json(userMapper.toMe(user));
  }
}
