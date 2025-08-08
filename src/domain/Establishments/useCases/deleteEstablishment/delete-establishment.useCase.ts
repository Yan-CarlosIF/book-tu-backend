import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IEstablishmentsRepository } from "../../repositories/Iestablishments.repository";

@injectable()
export class DeleteEstablishmentUseCase {
  constructor(
    @inject("EstablishmentsRepository")
    private establishmentsRepository: IEstablishmentsRepository
  ) {}

  async execute(id: string) {
    const establishment = await this.establishmentsRepository.findById(id);

    if (!establishment) {
      throw new AppError("Estabelecimento não encontrado", 404);
    }

    await this.establishmentsRepository.delete(id);
  }
}
