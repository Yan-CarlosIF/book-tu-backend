import { inject, injectable } from "tsyringe";

import { Establishment } from "../../infra/typeorm/entities/Establishment";
import { IEstablishmentsRepository } from "../../repositories/Iestablishments.repository";

@injectable()
export class ListEstablishmentsWithPaginationUseCase {
  constructor(
    @inject("EstablishmentsRepository")
    private establishmentsRepository: IEstablishmentsRepository
  ) {}

  async execute(page: number = 1) {
    if (!page || page < 1) {
      page = 1;
    }

    const establishments =
      await this.establishmentsRepository.listWithPagination(page);

    return {
      establishments: establishments.data as Establishment[],
      page: establishments.page,
      lastPage: establishments.lastPage,
      total: establishments.total,
    };
  }
}
