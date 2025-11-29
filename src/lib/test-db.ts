import { query } from "./api-integration";

async function test() {
  try {
    const users = await query("SELECT * FROM usuarios LIMIT 5");
    console.log(users);
  } catch (error) {
    console.error(error);
  }
}

test();
