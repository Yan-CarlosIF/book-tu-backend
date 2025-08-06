import { ICreateEstablishmentDTO } from "../dto/Icreate-establishment.dto";
import { Establishment } from "../infra/typeorm/entities/Establishment";

export interface IEstablishmentsRepository {
  create(data: ICreateEstablishmentDTO): Promise<void>;
  findByCnpj(cnpj: string): Promise<Establishment | undefined>;
}
