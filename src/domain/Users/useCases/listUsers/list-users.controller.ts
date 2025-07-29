import type { Request, Response } from "express";
import { container } from "tsyringe";
import z from "zod";

import { ListUsersUseCase } from "./list-users.useCase";

const queryParamsSchema = z.object({
  sort: z.enum(["asc", "desc", "operator", "admin"]).optional(),
  page: z.coerce.number().optional(),
});

type ListUsersQueryParams = z.infer<typeof queryParamsSchema>;

export class ListUsersController {
  async handle(
    request: Request<unknown, unknown, unknown, ListUsersQueryParams>,
    response: Response
  ) {
    const queryParams = request.query;

    const { page, sort } = queryParamsSchema.parse(queryParams);

    const listUsersUseCase = container.resolve(ListUsersUseCase);

    const paginatedUsers = await listUsersUseCase.execute(sort, page);

    return response.status(200).send(paginatedUsers);
  }
}
