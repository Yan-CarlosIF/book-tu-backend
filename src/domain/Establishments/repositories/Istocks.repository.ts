import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";

export interface IStocksRepository {
  listStocksItems(page: number, id?: string): Promise<IPaginationData>;
}
