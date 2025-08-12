import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";

import { ICreateInventoryDTO } from "../../dto/Icreate-inventory.dto";
import { Inventory, Status } from "../../infra/typeorm/entities/Inventory";
import { IInventoriesRepository } from "../Iinventories.repository";

export class InventoriesRepositoryInMemory implements IInventoriesRepository {
  inventories: Inventory[] = [];

  async create(data: ICreateInventoryDTO): Promise<void> {
    const inventory = new Inventory();

    Object.assign(inventory, {
      establishment_id: data.establishment_id,
      books: data.inventoryBooks,
      total_quantity: data.total_quantity,
      status: Status.UNPROCESSED,
    });

    this.inventories.push(inventory);
  }

  async findInventoryById(id: string): Promise<Inventory | undefined> {
    return this.inventories.find((inventory) => inventory.id === id);
  }

  async list(page: number, establishmentId?: string): Promise<IPaginationData> {
    let filteredInventories = this.inventories;

    if (establishmentId) {
      filteredInventories = this.inventories.filter(
        (inventory) => inventory.establishment_id === establishmentId
      );
    }

    const startIndex = (page - 1) * 10;
    const endIndex = page * 10;
    filteredInventories = filteredInventories.slice(startIndex, endIndex);

    return {
      data: filteredInventories,
      page,
      total: filteredInventories.length,
      lastPage: Math.ceil(filteredInventories.length / 10),
    };
  }
}
