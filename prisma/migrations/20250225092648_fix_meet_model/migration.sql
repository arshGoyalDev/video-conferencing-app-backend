/*
  Warnings:

  - Added the required column `meetAdminId` to the `meets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meets" ADD COLUMN     "meetAdminId" INTEGER NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "allowVideo" SET DEFAULT true,
ALTER COLUMN "allowMic" SET DEFAULT true,
ALTER COLUMN "anyoneCanJoin" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "meets" ADD CONSTRAINT "meets_meetAdminId_fkey" FOREIGN KEY ("meetAdminId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
