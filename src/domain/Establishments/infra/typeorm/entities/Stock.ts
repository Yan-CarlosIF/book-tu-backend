import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

import { Establishment } from "./Establishment";
import { StockItem } from "./StockItem";

@Entity("stocks")
export class Stock {
  @PrimaryColumn("uuid")
  id: string;

  @Column("uuid", { unique: true })
  establishment_id: string;

  @OneToOne(() => Establishment, (establishment) => establishment.stock)
  @JoinColumn({ name: "establishment_id" })
  establishment: Establishment;

  @OneToMany(() => StockItem, (stockItem) => stockItem.stock)
  books: StockItem[];

  constructor() {
    if (!this.id) this.id = uuid();
  }
}
