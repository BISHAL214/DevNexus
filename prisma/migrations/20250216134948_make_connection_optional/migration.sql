-- DropForeignKey
ALTER TABLE "connections" DROP CONSTRAINT "connections_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "connections" DROP CONSTRAINT "connections_senderId_fkey";

-- AlterTable
ALTER TABLE "connections" ALTER COLUMN "senderId" DROP NOT NULL,
ALTER COLUMN "receiverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
