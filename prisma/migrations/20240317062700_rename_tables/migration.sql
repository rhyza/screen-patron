/*
  Warnings:

  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupRsvp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Host` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rsvp` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GroupRsvp" DROP CONSTRAINT "GroupRsvp_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Host" DROP CONSTRAINT "Host_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Host" DROP CONSTRAINT "Host_userId_fkey";

-- DropForeignKey
ALTER TABLE "Rsvp" DROP CONSTRAINT "Rsvp_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Rsvp" DROP CONSTRAINT "Rsvp_groupRsvpId_fkey";

-- DropForeignKey
ALTER TABLE "Rsvp" DROP CONSTRAINT "Rsvp_userId_fkey";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "GroupRsvp";

-- DropTable
DROP TABLE "Host";

-- DropTable
DROP TABLE "Rsvp";

-- CreateTable
CREATE TABLE "events" (
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

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hosts" (
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "hosts_pkey" PRIMARY KEY ("eventId","userId")
);

-- CreateTable
CREATE TABLE "rsvps" (
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "name" TEXT,
    "partySize" INTEGER NOT NULL DEFAULT 1,
    "groupRsvpId" TEXT,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("eventId","userId")
);

-- CreateTable
CREATE TABLE "group_rsvps" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "names" TEXT[],
    "emails" TEXT[],

    CONSTRAINT "group_rsvps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_groupRsvpId_fkey" FOREIGN KEY ("groupRsvpId") REFERENCES "group_rsvps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_rsvps" ADD CONSTRAINT "group_rsvps_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
