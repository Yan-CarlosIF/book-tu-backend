import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";

import { ICreateEstablishmentDTO } from "../dto/Icreate-establishment.dto";
import { IUpdateEstablishmentDTO } from "../dto/Iupdate-establishment.dto";
import { Establishment } from "../infra/typeorm/entities/Establishment";

export interface IEstablishmentsRepository {
  create(data: ICreateEstablishmentDTO): Promise<void>;
  findByCnpj(cnpj: string): Promise<Establishment | undefined>;
  findById(id: string): Promise<Establishment | undefined>;
  listWithPagination(page: number, sort?: string): Promise<IPaginationData>;
  list(): Promise<Establishment[]>;
  update(
    establishment: Establishment,
    data: IUpdateEstablishmentDTO
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
