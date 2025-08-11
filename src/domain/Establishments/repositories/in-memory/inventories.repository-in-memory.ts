import { ICreateInventoryDTO } from "../../dto/Icreate-inventory.dto";
import { Inventory } from "../../infra/typeorm/entities/Inventory";
import { IInventoriesRepository } from "../Iinventories.repository";

export class InventoriesRepositoryInMemory implements IInventoriesRepository {
  inventories: Inventory[] = [];

  async create(data: ICreateInventoryDTO): Promise<void> {
    const inventory = new Inventory();
    Object.assign(inventory, data);
    this.inventories.push(inventory);
  }

  async findInventoryById(id: string): Promise<Inventory | undefined> {
    return this.inventories.find((inventory) => inventory.id === id);
  }
}
