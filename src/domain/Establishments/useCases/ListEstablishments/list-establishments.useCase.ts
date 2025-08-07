import { inject, injectable } from "tsyringe";

import { IEstablishmentsRepository } from "../../repositories/Iestablishments.repository";

@injectable()
export class ListEstablishmentsUseCase {
  constructor(
    @inject("EstablishmentsRepository")
    private establishmentsRepository: IEstablishmentsRepository
  ) {}

  async execute() {
    return await this.establishmentsRepository.list();
  }
}
