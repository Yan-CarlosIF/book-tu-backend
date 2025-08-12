import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";

import { Establishment } from "./Establishment";
import { InventoryBooks } from "./InventoryBooks";

export enum Status {
  PROCESSED = "processed",
  UNPROCESSED = "unprocessed",
}

@Entity("inventories")
export class Inventory {
  @PrimaryColumn("uuid")
  id: string;

  @Column({
    type: "int",
    generated: "increment",
    unique: true,
  })
  identifier: number;

  @Column("int")
  total_quantity: number;

  @Column("uuid")
  establishment_id: string;

  @ManyToOne(() => Establishment, (establishment) => establishment.inventories)
  @JoinColumn({ name: "establishment_id" })
  establishment: Establishment;

  @OneToMany(() => InventoryBooks, (books) => books.inventory, {
    cascade: true,
    eager: true,
  })
  books: InventoryBooks[];

  @Column({
    type: "enum",
    enum: Status,
  })
  status: Status;

  constructor() {
    if (!this.id) this.id = uuid();
  }
}
