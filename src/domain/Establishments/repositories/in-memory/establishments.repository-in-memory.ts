import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";
import { AppError } from "@/infra/errors/app-error";

import { ICreateEstablishmentDTO } from "../../dto/Icreate-establishment.dto";
import { IUpdateEstablishmentDTO } from "../../dto/Iupdate-establishment.dto";
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

  async findById(id: string): Promise<Establishment | undefined> {
    return this.establishments.find((establishment) => establishment.id === id);
  }

  async listWithPagination(
    page: number,
    search?: string
  ): Promise<IPaginationData> {
    let establishments = this.establishments;

    if (search) {
      establishments = this.establishments.filter(
        (establishment) =>
          establishment.name.toLowerCase().includes(search.toLowerCase()) ||
          establishment.cnpj.toLowerCase().includes(search.toLowerCase())
      );
    }

    establishments = this.establishments.slice((page - 1) * 10, page * 10);

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

  async update(
    { id }: Establishment,
    data: IUpdateEstablishmentDTO
  ): Promise<void> {
    const establishment = this.establishments.find(
      (establishment) => establishment.id === id
    );

    if (!establishment) {
      throw new AppError("Estabelecimento não encontrado", 404);
    }

    Object.assign(establishment, data);
  }

  async delete(id: string): Promise<void> {
    const establishment = this.establishments.find(
      (establishment) => establishment.id === id
    );

    if (!establishment) {
      throw new AppError("Estabelecimento não encontrado", 404);
    }

    this.establishments = this.establishments.filter(
      (establishment) => establishment.id !== id
    );
  }
}
