import { Brackets, getRepository, Repository } from "typeorm";

import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";
import { ICreateEstablishmentDTO } from "@/domain/Establishments/dto/Icreate-establishment.dto";
import { IUpdateEstablishmentDTO } from "@/domain/Establishments/dto/Iupdate-establishment.dto";
import { IEstablishmentsRepository } from "@/domain/Establishments/repositories/Iestablishments.repository";
import { pagination } from "@/utils/pagination";

import { Establishment } from "../entities/Establishment";
import { Stock } from "../entities/Stock";

export class EstablishmentsRepository implements IEstablishmentsRepository {
  private repository: Repository<Establishment>;
  private stockRepository: Repository<Stock>;

  constructor() {
    this.repository = getRepository(Establishment);
    this.stockRepository = getRepository(Stock);
  }

  async create(data: ICreateEstablishmentDTO): Promise<void> {
    const establishment = this.repository.create(data);

    await this.repository.save(establishment);

    const stock = this.stockRepository.create({
      establishment_id: establishment.id,
    });

    await this.stockRepository.save(stock);
  }

  async findByCnpj(cnpj: string): Promise<Establishment | undefined> {
    return await this.repository.findOne({ cnpj });
  }

  async findById(id: string): Promise<Establishment | undefined> {
    return await this.repository.findOne({ id });
  }

  async listWithPagination(
    page: number,
    search?: string
  ): Promise<IPaginationData> {
    const establishmentsQueryBuilder =
      this.repository.createQueryBuilder("establishments");

    if (search) {
      const likeSearch = `%${search}%`;

      establishmentsQueryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where("establishments.name ILIKE :search", {
            search: likeSearch,
          }).orWhere("establishments.cnpj ILIKE :search", {
            search: likeSearch,
          });
        })
      );
    }

    return await pagination<Establishment>(
      establishmentsQueryBuilder,
      page,
      10
    );
  }

  async list(): Promise<Establishment[]> {
    return await this.repository.find();
  }

  async update(
    establishment: Establishment,
    data: IUpdateEstablishmentDTO
  ): Promise<void> {
    await this.repository.update(establishment.id, {
      name: data.name ?? establishment.name,
      cnpj: data.cnpj ?? establishment.cnpj,
      state: data.state ?? establishment.state,
      city: data.city ?? establishment.city,
      district: data.district ?? establishment.district,
      cep: data.cep ?? establishment.cep,
      description: data.description ?? establishment.description,
    });
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
