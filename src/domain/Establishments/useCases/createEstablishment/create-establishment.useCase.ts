import { inject, injectable } from "tsyringe";

import { AppError } from "@/infra/errors/app-error";

import { ICreateEstablishmentDTO } from "../../dto/Icreate-establishment.dto";
import { IEstablishmentsRepository } from "../../repositories/Iestablishments.repository";

@injectable()
export class CreateEstablishmentUseCase {
  constructor(
    @inject("EstablishmentsRepository")
    private establishmentsRepository: IEstablishmentsRepository
  ) {}

  async execute(data: ICreateEstablishmentDTO) {
    const { cnpj } = data;

    const establishmentWithSameCnpj =
      await this.establishmentsRepository.findByCnpj(cnpj);

    if (establishmentWithSameCnpj) {
      throw new AppError("Estabelecimento já cadastrado", 400);
    }

    await this.establishmentsRepository.create(data);
  }
}
