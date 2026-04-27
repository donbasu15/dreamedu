/*
  Warnings:

  - You are about to drop the column `category` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Test` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "categoryName" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "creatorName" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Note" ("content", "createdAt", "creatorName", "id", "isPremium", "title", "updatedAt") SELECT "content", "createdAt", "creatorName", "id", "isPremium", "title", "updatedAt" FROM "Note";
DROP TABLE "Note";
ALTER TABLE "new_Note" RENAME TO "Note";
CREATE TABLE "new_Test" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "categoryName" TEXT,
    "creatorName" TEXT,
    "categoryId" TEXT,
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "type" TEXT NOT NULL DEFAULT 'Quiz',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Test_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Test" ("categoryId", "createdAt", "creatorName", "durationMinutes", "id", "isPremium", "title", "type", "updatedAt") SELECT "categoryId", "createdAt", "creatorName", "durationMinutes", "id", "isPremium", "title", "type", "updatedAt" FROM "Test";
DROP TABLE "Test";
ALTER TABLE "new_Test" RENAME TO "Test";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
