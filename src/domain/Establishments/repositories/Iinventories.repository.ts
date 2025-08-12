import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";

import { ICreateInventoryDTO } from "../dto/Icreate-inventory.dto";
import { Inventory } from "../infra/typeorm/entities/Inventory";

export interface IInventoriesRepository {
  create(data: ICreateInventoryDTO): Promise<void>;
  findInventoryById(id: string): Promise<Inventory | undefined>;
  list(page: number, establishmentId?: string): Promise<IPaginationData>;
  update(
    id: string,
    data: { book_id: string; quantity: number }[]
  ): Promise<void>;
  delete(id: string): Promise<void>;
}
