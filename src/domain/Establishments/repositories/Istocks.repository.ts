import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";

import { Stock } from "../infra/typeorm/entities/Stock";

export interface IStocksRepository {
  listStocksItems(page: number, id?: string): Promise<IPaginationData>;
  findStockByEstablishmentId(id: string): Promise<Stock | undefined>;
}
