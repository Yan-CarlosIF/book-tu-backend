import { Column, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

export enum Permission {
  OPERATOR = "operator",
  ADMIN = "admin",
}

@Entity("users")
export class User {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar")
  name: string;

  @Column("varchar", { unique: true })
  registration: string;

  @Column("varchar", { unique: true })
  login: string;

  @Column("varchar")
  password: string;

  @Column("varchar")
  role: string;

  @Column({
    type: "enum",
    enum: Permission,
  })
  permission: Permission;

  constructor() {
    if (!this.id) this.id = uuid();
  }
}
