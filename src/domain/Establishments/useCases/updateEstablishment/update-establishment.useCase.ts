import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { IUpdateEstablishmentDTO } from "../../dto/Iupdate-establishment.dto";
import { IEstablishmentsRepository } from "../../repositories/Iestablishments.repository";

@injectable()
export class UpdateEstablishmentUseCase {
  constructor(
    @inject("EstablishmentsRepository")
    private establishmentsRepository: IEstablishmentsRepository
  ) {}

  async execute(id: string, data: IUpdateEstablishmentDTO) {
    const establishment = await this.establishmentsRepository.findById(id);

    if (!establishment) {
      throw new AppError("Estabelecimento não encontrado", 404);
    }

    await this.establishmentsRepository.update(establishment, data);
  }
}
