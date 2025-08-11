import { ICreateInventoryDTO } from "../dto/Icreate-inventory.dto";
import { Inventory } from "../infra/typeorm/entities/Inventory";

export interface IInventoriesRepository {
  create(data: ICreateInventoryDTO): Promise<void>;
  findInventoryById(id: string): Promise<Inventory | undefined>;
}
