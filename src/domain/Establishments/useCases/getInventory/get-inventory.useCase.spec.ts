import { AppError } from "@/infra/errors/app-error";

import { InventoriesRepositoryInMemory } from "../../repositories/in-memory/inventories.repository-in-memory";
import { GetInventoryUseCase } from "./get-inventory.useCase";

describe("[GET] inventories/:id", () => {
  let InventoriesRepository: InventoriesRepositoryInMemory;
  let getInventoryUseCase: GetInventoryUseCase;

  beforeEach(() => {
    InventoriesRepository = new InventoriesRepositoryInMemory();
    getInventoryUseCase = new GetInventoryUseCase(InventoriesRepository);
  });

  it("should be able to get an inventory by id", async () => {
    await InventoriesRepository.create({
      establishment_id: "establishment_id",
      inventoryBooks: [],
      total_quantity: 0,
    });

    const [inventory] = InventoriesRepository.inventories;

    const result = await getInventoryUseCase.execute(inventory.id);

    expect(result).toEqual(inventory);
  });

  it("should not be able to get an inventory with a non-existing id", async () => {
    await expect(
      getInventoryUseCase.execute("non-existing-id")
    ).rejects.toEqual(new AppError("Inventário não encontrado"));
  });
});
