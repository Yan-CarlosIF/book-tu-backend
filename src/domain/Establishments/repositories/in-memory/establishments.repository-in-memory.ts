import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";

import { ICreateEstablishmentDTO } from "../../dto/Icreate-establishment.dto";
import { Establishment } from "../../infra/typeorm/entities/Establishment";
import { IEstablishmentsRepository } from "../Iestablishments.repository";

export class EstablishmentsRepositoryInMemory
  implements IEstablishmentsRepository
{
  public establishments: Establishment[] = [];

  async create(data: ICreateEstablishmentDTO): Promise<void> {
    const establishment = new Establishment();

    Object.assign(establishment, data);

    this.establishments.push(establishment);
  }

  async findByCnpj(cnpj: string): Promise<Establishment | undefined> {
    return this.establishments.find(
      (establishment) => establishment.cnpj === cnpj
    );
  }

  async listWithPagination(page: number): Promise<IPaginationData> {
    const establishments = this.establishments.slice(
      (page - 1) * 10,
      page * 10
    );

    return {
      data: establishments,
      page,
      total: this.establishments.length,
      lastPage: Math.ceil(this.establishments.length / 10),
    };
  }

  async list(): Promise<Establishment[]> {
    return this.establishments;
  }
}
