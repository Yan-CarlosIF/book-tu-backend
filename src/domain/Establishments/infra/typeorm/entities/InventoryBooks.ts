import "reflect-metadata";

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { Book } from "@/domain/Books/infra/typeorm/entities/Book";

import { Inventory } from "./Inventory";

@Entity("inventory_books")
export class InventoryBooks {
  @PrimaryColumn("uuid")
  id: string;

  @Column("uuid")
  inventory_id: string;

  @ManyToOne(() => Inventory, (inventory) => inventory.books)
  @JoinColumn({ name: "inventory_id" })
  inventory: Inventory;

  @Column("uuid")
  book_id: string;

  @ManyToOne(() => Book)
  @JoinColumn({ name: "book_id" })
  book: Book;

  @Column("int")
  quantity: number;

  constructor() {
    if (!this.id) this.id = uuid();
  }
}
