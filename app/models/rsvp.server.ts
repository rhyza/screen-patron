import type { Event, Rsvp, Status } from '@prisma/client';
import { prisma } from '~/db.server';

export type { Host, Rsvp } from '@prisma/client';

/**
 * Adds a User to an Event's guest list. Must include the RSVP response.
 * @requires `eventId`, `userId`
 * @param status The User's RSVP response (GOING, MAYBE, NOT_GOING)
 * @param name (optional) The display name for Guest
 * @returns The User's RSVP record
 */
export async function addGuest(
  eventId: Rsvp['eventId'],
  userId: Rsvp['userId'],
  status: Status,
  name?: Rsvp['name'],
) {
  // Create new RSVP record
  const guest = prisma.rsvp.create({
    data: { eventId, userId, status, name },
  });

  // Connect RSVP record to its associated Event and User
  prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      guests: {
        connect: {
          id: { eventId, userId },
        },
      },
    },
  });
  prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      events: {
        connect: {
          id: { eventId, userId },
        },
      },
    },
  });

  return guest;
}

/**
 * @requires `eventId`, `userId`
 * @returns The RSVP record along with User's profile name and photo.
 */
export async function getGuest(eventId: Rsvp['eventId'], userId: Rsvp['userId']) {
  return prisma.user.findFirst({
    select: {
      name: true,
      photo: true,
      events: {
        where: {
          eventId,
          userId,
        },
      },
    },
  });
}

/**
 * Updates any of a User's RSVP info.
 * @requires `eventId`, `userId`, `data`
 * > `data: { propName: value, ... }`
 * @returns The updated RSVP record
 */
export async function updateGuest(
  eventId: Rsvp['eventId'],
  userId: Rsvp['userId'],
  data: Omit<Event, 'eventId' | 'userId'>,
) {
  return prisma.rsvp.update({
    where: {
      id: { eventId, userId },
    },
    data: { ...data },
  });
}

/**
 * Removes a User from an Event's guest list.
 * @requires `eventId`, `userId`
 * @returns The deleted RSVP record
 */
export async function removeGuest(eventId: Rsvp['eventId'], userId: Rsvp['userId']) {
  return prisma.rsvp.delete({
    where: {
      id: { eventId, userId },
    },
  });
}
