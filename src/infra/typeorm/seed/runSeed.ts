import { seed } from "./index";

async function run() {
  try {
    const connection = await seed();
    await connection.close();
    console.log("Seed finished");
  } catch (err) {
    console.error(err);
    console.error("Error during seed");
  }
}

run();
