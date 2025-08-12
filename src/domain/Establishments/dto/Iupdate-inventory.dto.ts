export interface IUpdateInventoryDTO {
  id: string;
  inventoryBooks: { book_id: string; quantity: number }[];
}
