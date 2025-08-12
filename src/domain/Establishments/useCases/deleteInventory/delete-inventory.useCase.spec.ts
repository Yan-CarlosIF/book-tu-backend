import { AppError } from "@/infra/errors/app-error";

import { InventoriesRepositoryInMemory } from "../../repositories/in-memory/inventories.repository-in-memory";
import { DeleteInventoryUseCase } from "./delete-inventory.useCase";

describe("[DELETE] /inventories/:id", () => {
  let inventoriesRepository: InventoriesRepositoryInMemory;
  let deleteInventoryUseCase: DeleteInventoryUseCase;

  beforeEach(() => {
    inventoriesRepository = new InventoriesRepositoryInMemory();
    deleteInventoryUseCase = new DeleteInventoryUseCase(inventoriesRepository);
  });

  it("should be able to delete a inventory", async () => {
    await inventoriesRepository.create({
      establishment_id: "establishment_id",
      inventoryBooks: [],
      total_quantity: 0,
    });

    const [inventory] = inventoriesRepository.inventories;

    await deleteInventoryUseCase.execute(inventory.id);

    expect(inventoriesRepository.inventories).toHaveLength(0);
  });

  it("should not be able to delete a inventory if inventory does not exist", async () => {
    await expect(deleteInventoryUseCase.execute("id")).rejects.toEqual(
      new AppError("Inventário não encontrado")
    );
  });
});
