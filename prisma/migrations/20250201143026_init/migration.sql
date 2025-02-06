/*
  Warnings:

  - A unique constraint covering the columns `[firebase_uid]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebase_uid` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "firebase_uid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");
