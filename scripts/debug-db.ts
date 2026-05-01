import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!.trim(),
  authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
});

async function sync() {
  try {
    const res = await client.execute("PRAGMA table_info(User);");
    const passwordHashCol = res.rows.find(row => row.name === "passwordHash");
    console.log("passwordHash column info:", passwordHashCol);
  } catch (e) {
    console.error("Failed:", e);
  }
}

sync();
