import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const libsql = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const r = await prisma.result.findMany({ take: 1 });
    console.log("Success reading from Result table:", r);
  } catch(e) {
    console.error("Prisma error:", e);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
