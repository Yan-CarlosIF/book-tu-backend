import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";

import { ICreateEstablishmentDTO } from "../dto/Icreate-establishment.dto";
import { Establishment } from "../infra/typeorm/entities/Establishment";

export interface IEstablishmentsRepository {
  create(data: ICreateEstablishmentDTO): Promise<void>;
  findByCnpj(cnpj: string): Promise<Establishment | undefined>;
  listWithPagination(page: number): Promise<IPaginationData>;
  list(): Promise<Establishment[]>;
}
