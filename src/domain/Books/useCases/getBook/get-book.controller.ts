import type { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { GetBookUseCase } from "./get-book.useCase";

const getBookParamsSchema = z.object({
  id: z.string().uuid(),
});

type IParams = z.infer<typeof getBookParamsSchema>;

export class GetBookController {
  async handle(request: Request<IParams>, response: Response) {
    const { id } = getBookParamsSchema.parse(request.params);

    const getBookUseCase = container.resolve(GetBookUseCase);

    const book = await getBookUseCase.execute(id);

    return response.status(200).json(book);
  }
}
