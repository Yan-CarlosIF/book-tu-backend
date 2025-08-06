import { getRepository, Repository } from "typeorm";

import { ICreateEstablishmentDTO } from "@/domain/Establishments/dto/Icreate-establishment.dto";
import { IEstablishmentsRepository } from "@/domain/Establishments/repositories/Iestablishments.repository";

import { Establishment } from "../entities/Establishment";

export class EstablishmentsRepository implements IEstablishmentsRepository {
  private repository: Repository<Establishment>;

  constructor() {
    this.repository = getRepository(Establishment);
  }

  async create(data: ICreateEstablishmentDTO): Promise<void> {
    const establishment = this.repository.create(data);

    await this.repository.save(establishment);
  }

  async findByCnpj(cnpj: string): Promise<Establishment | undefined> {
    return await this.repository.findOne({ cnpj });
  }
}
