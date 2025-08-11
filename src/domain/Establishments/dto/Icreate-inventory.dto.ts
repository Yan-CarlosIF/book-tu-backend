import { InventoryBooks } from "../infra/typeorm/entities/InventoryBooks";

export interface ICreateInventoryDTO {
  inventoryBooks: Pick<InventoryBooks, "book_id" | "quantity">[];
  establishment_id: string;
  total_quantity: number;
}
