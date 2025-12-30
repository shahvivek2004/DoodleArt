/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "publicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_publicId_key" ON "Chat"("publicId");
