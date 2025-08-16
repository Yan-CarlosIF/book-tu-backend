import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { Category } from "./Category";

@Entity("books")
export class Book {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { unique: true })
  identifier: string;

  @Column("varchar")
  title: string;

  @Column("varchar")
  author: string;

  @Column("integer")
  release_year: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @Column("text", { nullable: true, default: null })
  description: string;

  @ManyToMany(() => Category, (category) => category.books)
  @JoinTable({
    name: "book_categories",
    joinColumn: {
      name: "book_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
  })
  categories: Category[];

  constructor() {
    if (!this.id) this.id = uuid();
  }
}
