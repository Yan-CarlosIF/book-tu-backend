import { app } from "./app.ts";

app.listen(3333, "0.0.0.0", () =>
  console.log("Server is running at http://localhost:3333")
);
