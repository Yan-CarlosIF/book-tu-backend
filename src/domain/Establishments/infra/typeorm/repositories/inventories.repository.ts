import { getRepository, Repository } from "typeorm";

import { ICreateInventoryDTO } from "@/domain/Establishments/dto/Icreate-inventory.dto";
import { IInventoriesRepository } from "@/domain/Establishments/repositories/Iinventories.repository";

import { Inventory, Status } from "../entities/Inventory";

export class InventoriesRepository implements IInventoriesRepository {
  private repository: Repository<Inventory>;

  constructor() {
    this.repository = getRepository(Inventory);
  }

  async create({
    establishment_id,
    inventoryBooks,
    total_quantity,
  }: ICreateInventoryDTO): Promise<void> {
    const inventory = this.repository.create({
      books: inventoryBooks,
      establishment_id,
      total_quantity,
      status: Status.UNPROCESSED,
    });

    await this.repository.save(inventory);
  }

  async findInventoryById(id: string): Promise<Inventory | undefined> {
    return await this.repository.findOne({ id });
  }
}
