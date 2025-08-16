import { v4 } from "uuid";

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

    const paginatedInventories = filteredInventories.slice(
      startIndex,
      endIndex
    );

    return {
      data: paginatedInventories,
      page,
      total: filteredInventories.length,
      lastPage: Math.ceil(filteredInventories.length / 10),
    };
  }

  async update(
    id: string,
    data: { book_id: string; quantity: number }[]
  ): Promise<void> {
    const inventory = this.inventories.find((inventory) => inventory.id === id);

    if (!inventory) {
      throw new Error("Inventory not found");
    }

    inventory.books = data.map((book) => {
      return {
        book_id: book.book_id,
        quantity: book.quantity,
        id: v4(),
        book: {
          id: book.book_id,
          title: "",
          author: "",
          release_year: 0,
          price: 0,
          description: "",
          categories: [],
        },
        inventory_id: id,
        inventory: inventory,
      };
    });

    inventory.total_quantity = data.reduce(
      (total, book) => total + book.quantity,
      0
    );
  }

  async delete(id: string): Promise<void> {
    this.inventories = this.inventories.filter(
      (inventory) => inventory.id !== id
    );
  }

  async process(inventory: Inventory): Promise<void> {
    console.log(inventory);
  }
}
