import { PrismaClient } from "@prisma/client";

console.log(">>> PRISMA LIB LOADED <<<");
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({ 
  url: process.env.TURSO_DATABASE_URL!.trim(),
  authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
});
const adapter = new PrismaLibSQL(libsql as any);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  new PrismaClient({
    adapter,
    log: ["query"],
  });

// Disable global cache to force fresh client on every HMR in dev
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
