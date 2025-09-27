import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";

import { ICreateInventoryDTO } from "../dto/Icreate-inventory.dto";
import { Inventory } from "../infra/typeorm/entities/Inventory";
import { Stock } from "../infra/typeorm/entities/Stock";

export interface IInventoriesRepository {
  create(data: ICreateInventoryDTO): Promise<void>;
  findInventoryById(
    id: string,
    withBooks?: boolean
  ): Promise<Inventory | undefined>;
  list(
    page: number,
    establishmentId?: string,
    search?: string
  ): Promise<IPaginationData>;
  update(
    id: string,
    establishment_id: string,
    data: { book_id: string; quantity: number }[]
  ): Promise<void>;
  delete(id: string): Promise<void>;
  process(inventory: Inventory, stock: Stock): Promise<void>;
  getInventoryBooks(
    page: number,
    id: string
  ): Promise<IPaginationData>;
}
