import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { Inventory } from "./Inventory";
import { Stock } from "./Stock";

@Entity("establishments")
export class Establishment {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar")
  name: string;

  @Column("varchar")
  cnpj: string;

  @Column("varchar")
  state: string;

  @Column("varchar")
  city: string;

  @Column("varchar")
  district: string;

  @Column("varchar")
  cep: string;

  @Column("text", { nullable: true, default: null })
  description?: string;

  @OneToOne(() => Stock, (stock) => stock.establishment)
  stock: Stock;

  @OneToMany(() => Inventory, (inventory) => inventory.establishment)
  inventories: Inventory[];

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
