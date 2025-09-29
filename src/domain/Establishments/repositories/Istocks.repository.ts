import { IStockItemsPaginationDTO } from "../dto/Istock-items-pagination.dto";
import { Stock } from "../infra/typeorm/entities/Stock";

export interface IStocksRepository {
  listStocksItems(
    page: number,
    id?: string,
    search?: string
  ): Promise<IStockItemsPaginationDTO>;
  findStockByEstablishmentId(id: string): Promise<Stock | undefined>;
}
