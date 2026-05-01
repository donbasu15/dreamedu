import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!.trim(),
  authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
});

async function run() {
  console.log("Starting table migration...");
  try {
    // Check if passwordHash is already nullable
    const info = await client.execute("PRAGMA table_info(User);");
    const passwordHash = info.rows.find(r => r.name === "passwordHash");
    
    if (passwordHash && passwordHash.notnull === 0) {
      console.log("passwordHash is already nullable. No migration needed.");
      return;
    }

    console.log("passwordHash is NOT NULL. Performing migration...");

    // 1. Rename existing table
    await client.execute("ALTER TABLE User RENAME TO User_old;");

    // 2. Create new table (correct schema)
    // I'll use the schema from prisma/schema.prisma
    await client.execute(`
      CREATE TABLE User (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        passwordHash TEXT,
        role TEXT DEFAULT 'STUDENT' NOT NULL,
        currentInstitution TEXT,
        gradeOrClass TEXT,
        phone TEXT,
        address TEXT,
        emailVerified DATETIME,
        otp TEXT,
        otpExpiry DATETIME,
        resetToken TEXT,
        resetTokenExpiry DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updatedAt DATETIME NOT NULL
      );
    `);

    // 3. Copy data
    await client.execute(`
      INSERT INTO User (id, name, email, passwordHash, role, currentInstitution, gradeOrClass, phone, address, emailVerified, otp, otpExpiry, resetToken, resetTokenExpiry, createdAt, updatedAt)
      SELECT id, name, email, passwordHash, role, currentInstitution, gradeOrClass, phone, address, emailVerified, otp, otpExpiry, resetToken, resetTokenExpiry, createdAt, updatedAt 
      FROM User_old;
    `);

    // 4. Drop old table
    await client.execute("DROP TABLE User_old;");

    console.log("Migration successful!");
  } catch (e) {
    console.error("Migration failed:", e);
    // Try to recover if possible
    try {
        await client.execute("ALTER TABLE User_old RENAME TO User;").catch(() => {});
    } catch (err) {}
  }
}

run();
