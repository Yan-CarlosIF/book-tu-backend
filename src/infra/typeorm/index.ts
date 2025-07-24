import { createConnection, getConnectionOptions } from "typeorm";

import { env } from "@/config/env";

export default async (host = "database") => {
  const defaultOptions = await getConnectionOptions();

  const connection = await createConnection(
    Object.assign(defaultOptions, {
      type: "postgres",
      host: env.NODE_ENV === "test" ? "localhost" : host,
      port: 5432,
      username: "docker",
      password: "123",
      database: env.NODE_ENV === "test" ? "booktu_test" : "booktu",
    })
  );

  return connection;
};
