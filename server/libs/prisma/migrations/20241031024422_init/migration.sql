/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `RevokedToken` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RevokedToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_RevokedToken" ("createdAt", "id", "token", "tokenType") SELECT "createdAt", "id", "token", "tokenType" FROM "RevokedToken";
DROP TABLE "RevokedToken";
ALTER TABLE "new_RevokedToken" RENAME TO "RevokedToken";
CREATE UNIQUE INDEX "RevokedToken_token_key" ON "RevokedToken"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
