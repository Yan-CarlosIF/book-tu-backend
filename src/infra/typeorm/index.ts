import { createConnection } from "typeorm";

export default async () => {
  await createConnection();

  console.log("Database connected");
};
