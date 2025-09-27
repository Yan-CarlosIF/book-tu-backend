export interface IUpdateInventoryDTO {
  id: string;
  establishment_id: string;
  inventoryBooks: { book_id: string; quantity: number }[];
}
