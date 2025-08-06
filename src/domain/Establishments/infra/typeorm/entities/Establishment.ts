import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuidv4 } from "uuid";

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

  constructor() {
    if (!this.id) this.id = uuidv4();
  }
}
