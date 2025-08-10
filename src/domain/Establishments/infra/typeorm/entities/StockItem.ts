import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

import { Book } from "@/domain/Books/infra/typeorm/entities/Book";

import { Stock } from "./Stock";

@Entity("stock_items")
export class StockItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  stock_id: string;

  @Column("uuid")
  book_id: string;

  @Column("int")
  quantity: number;

  @ManyToOne(() => Stock, (stock) => stock.books)
  @JoinColumn({ name: "stock_id" })
  stock: Stock;

  @ManyToOne(() => Book)
  @JoinColumn({ name: "book_id" })
  book: Book;

  constructor() {
    if (!this.id) this.id = uuid();
  }
}
