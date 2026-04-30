import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  try {
    await client.execute("ALTER TABLE User ADD COLUMN currentInstitution TEXT;");
    console.log("Added currentInstitution");
  } catch(e: any) { console.log(e.message) }
  
  try {
    await client.execute("ALTER TABLE User ADD COLUMN gradeOrClass TEXT;");
    console.log("Added gradeOrClass");
  } catch(e: any) { console.log(e.message) }

  try {
    await client.execute("ALTER TABLE User DROP COLUMN education;");
    console.log("Dropped education");
  } catch(e: any) { console.log(e.message) }
}
main();
