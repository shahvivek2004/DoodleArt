-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "sharedKey" TEXT,
ADD COLUMN     "sharedType" TEXT NOT NULL DEFAULT 'private';
