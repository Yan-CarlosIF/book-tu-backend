import { getRepository, Repository } from "typeorm";

import { IPaginationData } from "@/domain/Books/dto/Ipagination-data.dto";
import { ICreateInventoryDTO } from "@/domain/Establishments/dto/Icreate-inventory.dto";
import { IInventoriesRepository } from "@/domain/Establishments/repositories/Iinventories.repository";
import { pagination } from "@/utils/pagination";

import { Inventory, Status } from "../entities/Inventory";
import { InventoryBooks } from "../entities/InventoryBooks";

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
      establishment_id,
      total_quantity,
      status: Status.UNPROCESSED,
      books: inventoryBooks.map((book) => {
        return this.repository.manager.create(InventoryBooks, {
          book_id: book.book_id,
          quantity: book.quantity,
        });
      }),
    });

    await this.repository.save(inventory);
  }

  async findInventoryById(id: string): Promise<Inventory | undefined> {
    return await this.repository.findOne({ id });
  }

  async list(page: number, establishmentId?: string): Promise<IPaginationData> {
    const queryBuilder = this.repository.createQueryBuilder("inventories");

    queryBuilder
      .leftJoinAndSelect("inventories.establishment", "establishment")
      .leftJoinAndSelect("inventories.books", "books")
      .leftJoinAndSelect("books.book", "book");

    if (establishmentId) {
      queryBuilder.where("establishment.id = :id", { id: establishmentId });
    }

    return await pagination<Inventory>(queryBuilder, page, 10);
  }

  async update(
    id: string,
    data: { book_id: string; quantity: number }[]
  ): Promise<void> {
    const inventory = await this.repository.findOne(id, {
      relations: ["books"],
    });

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    await this.repository.manager.delete(InventoryBooks, {
      inventory_id: inventory.id,
    });

    inventory.books = data.map((book) => {
      return this.repository.manager.create(InventoryBooks, {
        inventory,
        book_id: book.book_id,
        quantity: book.quantity,
      });
    });

    await this.repository.save(inventory);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
