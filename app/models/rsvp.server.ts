import type { Event, Rsvp, Status } from '@prisma/client';
import { prisma } from '~/db.server';

export type { Host, Rsvp } from '@prisma/client';

/**
 * Adds a User to an Event's guest list. Must include the RSVP response.
 * @requires `eventId`, `userId`
 * @param status The User's RSVP response (GOING, MAYBE, NOT_GOING)
 * @param name (optional) The display name for Guest
 * @returns [ the RSVP record created, the updated Event record, the updated User record ]
 */
export async function addGuest(
  eventId: Rsvp['eventId'],
  userId: Rsvp['userId'],
  status: Status,
  name?: Rsvp['name'],
) {
  // Create new RSVP record
  const createGuest = prisma.rsvp.create({
    data: { eventId, userId, status, name },
  });

  // Connect RSVP record to its associated Event and User
  const connectEvent = prisma.event.update({
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

  const connectUser = prisma.user.update({
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

  return prisma.$transaction([createGuest, connectEvent, connectUser]);
}

/**
 * @requires `eventId`, `userId`
 * @returns The RSVP record for an Event guest along with User's profile name and photo.
 */
export async function getGuest(eventId: Rsvp['eventId'], userId: Rsvp['userId']) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      name: true,
      photo: true,
      events: {
        where: {
          eventId,
        },
      },
    },
  });

  return { profileName: user?.name, profilePhoto: user?.photo, ...user?.events[0] };
}

/**
 * @requires `eventId`
 * @returns The guest list for an Event with the Users' profile name, profile photo, and
 * RSVP record.
 */
export async function getGuests(eventId: Rsvp['eventId']) {
  let guests;
  const users = await prisma.user.findMany({
    where: {
      events: {
        some: {
          eventId,
        },
      },
    },
    select: {
      name: true,
      photo: true,
      events: {
        where: {
          eventId,
        },
      },
    },
  });

  return users.map((user) => ({
    profileName: user.name,
    profilePhoto: user.photo,
    ...user.events[0],
  }));
}

/**
 * Updates any of a User's RSVP info for an Event.
 * @requires `eventId`, `userId`, `data`
 * > `data: { propName: value, ... }`
 * @returns The updated RSVP record
 */
export async function updateGuest(
  eventId: Rsvp['eventId'],
  userId: Rsvp['userId'],
  data: Partial<Omit<Event, 'eventId' | 'userId'>>,
) {
  return prisma.rsvp.update({
    where: {
      id: { eventId, userId },
    },
    data: { ...data },
  });
}

/**
 * Batch updates RSVP info for all guests of an Event.
 * @requires `eventId`, `userId`, `data`
 * > `data: { propName: value, ... }`
 * @param filter (optional) Specifies conditions for which RSVP records to modify
 * @returns The updated RSVP record
 */
export async function updateGuests(
  eventId: Rsvp['eventId'],
  data: Partial<Omit<Event, 'eventId' | 'userId'>>,
  filter?: object,
) {
  return prisma.rsvp.updateMany({
    where: {
      eventId,
      ...filter,
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

/**
 * Batch remove all Users from an Event's guest list.
 * @requires `eventId`, `userId`, `data`
 * > `data: { propName: value, ... }`
 * @param filter (optional) Specifies conditions for which guests' RSVP records to delete
 * @returns The list of deleted RSVP records
 */
export async function removeGuests(eventId: Rsvp['eventId'], filter?: object) {
  return prisma.rsvp.deleteMany({
    where: {
      eventId,
      ...filter,
    },
  });
}
