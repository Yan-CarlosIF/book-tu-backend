import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { Book } from "./Book";

@Entity("categories")
export class Category {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar")
  name: string;

  @ManyToMany(() => Book, (book) => book.categories)
  @JoinTable({
    name: "book_categories",
    joinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "book_id",
      referencedColumnName: "id",
    },
  })
  books: Book[];

  constructor() {
    if (!this.id) this.id = uuid();
  }
}
