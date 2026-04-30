import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({ 
  url: process.env.TURSO_DATABASE_URL!.trim(),
  authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
});

async function migrate() {
  console.log("Migrating Turso database...");
  
  const queries = [
    "ALTER TABLE User ADD COLUMN emailVerified DATETIME;",
    "ALTER TABLE User ADD COLUMN otp TEXT;",
    "ALTER TABLE User ADD COLUMN otpExpiry DATETIME;",
    "ALTER TABLE User ADD COLUMN resetToken TEXT;",
    "ALTER TABLE User ADD COLUMN resetTokenExpiry DATETIME;"
  ];

  for (const query of queries) {
    try {
      console.log(`Executing: ${query}`);
      await client.execute(query);
      console.log("Success!");
    } catch (error: any) {
      if (error.message.includes("duplicate column name")) {
        console.log("Column already exists, skipping...");
      } else {
        console.error("Error:", error.message);
      }
    }
  }
  
  process.exit(0);
}

migrate();
