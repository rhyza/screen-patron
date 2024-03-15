-- CreateEnum
CREATE TYPE "Status" AS ENUM ('GOING', 'MAYBE', 'NOT_GOING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "photo" TEXT,
    "city" TEXT,
    "bio" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "photo" TEXT,
    "description" TEXT,
    "trailer" TEXT,
    "dateStart" TIMESTAMPTZ(3),
    "dateEnd" TIMESTAMPTZ(3),
    "location" TEXT,
    "city" TEXT,
    "capacity" INTEGER,
    "cost" INTEGER DEFAULT 0,
    "plusOneLimit" INTEGER,
    "reminders" TIMESTAMPTZ(3)[],
    "survey" TEXT[],
    "acceptRsvp" BOOLEAN NOT NULL DEFAULT true,
    "requestDonations" BOOLEAN NOT NULL DEFAULT false,
    "requireApproval" BOOLEAN NOT NULL DEFAULT false,
    "requirePassword" BOOLEAN NOT NULL DEFAULT false,
    "requireSurvey" BOOLEAN NOT NULL DEFAULT false,
    "showGuestCount" BOOLEAN NOT NULL DEFAULT true,
    "showGuestList" BOOLEAN NOT NULL DEFAULT true,
    "showLocation" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Host" (
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("eventId","userId")
);

-- CreateTable
CREATE TABLE "Rsvp" (
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "name" TEXT,
    "partySize" INTEGER NOT NULL DEFAULT 1,
    "groupRsvpId" TEXT,

    CONSTRAINT "Rsvp_pkey" PRIMARY KEY ("eventId","userId")
);

-- CreateTable
CREATE TABLE "GroupRsvp" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "names" TEXT[],
    "emails" TEXT[],

    CONSTRAINT "GroupRsvp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_groupRsvpId_fkey" FOREIGN KEY ("groupRsvpId") REFERENCES "GroupRsvp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupRsvp" ADD CONSTRAINT "GroupRsvp_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
