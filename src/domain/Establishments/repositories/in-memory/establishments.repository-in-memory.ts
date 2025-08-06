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
}
