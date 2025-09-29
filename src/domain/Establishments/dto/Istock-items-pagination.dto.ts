import { StockItem } from "../infra/typeorm/entities/StockItem";

export interface IStockItemsPaginationDTO {
  data: StockItem[];
  page: number;
  total: number;
  totalUnits: number;
  lastPage: number;
}
