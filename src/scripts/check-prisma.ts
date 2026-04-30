import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config();

const libsql = createClient({ 
  url: process.env.TURSO_DATABASE_URL!.trim(),
  authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
});
const adapter = new PrismaLibSQL(libsql as any);
const prisma = new PrismaClient({ adapter });

async function check() {
  try {
    console.log("Checking User model fields...");
    // @ts-ignore - checking if the client has these fields
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        otp: true,
      }
    });
    console.log("Success! The client recognizes the 'otp' field.");
  } catch (error: any) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
