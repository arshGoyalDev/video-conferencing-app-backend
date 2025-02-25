-- CreateTable
CREATE TABLE "meets" (
    "meetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "allowVideo" BOOLEAN NOT NULL,
    "allowMic" BOOLEAN NOT NULL,
    "anyoneCanJoin" BOOLEAN NOT NULL,

    CONSTRAINT "meets_pkey" PRIMARY KEY ("meetId")
);

-- CreateTable
CREATE TABLE "_MeetToUser" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MeetToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "meets_meetId_key" ON "meets"("meetId");

-- CreateIndex
CREATE INDEX "_MeetToUser_B_index" ON "_MeetToUser"("B");

-- AddForeignKey
ALTER TABLE "_MeetToUser" ADD CONSTRAINT "_MeetToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "meets"("meetId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetToUser" ADD CONSTRAINT "_MeetToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
