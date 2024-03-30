import { Event, Rsvp, Status, User } from '@prisma/client';
import { prisma } from '~/db.server';
import { isHost } from './host.server';
import { invariant, retypeNull } from '~/utils/validate';

export { Status } from '@prisma/client';
export type { Host, Rsvp } from '@prisma/client';

export type RsvpInfo = {
  eventId: string;
  userId: string;
  status: Status;
  name: string | null;
  partySize: number | null;
  user: {
    name: string | null;
    photo: string | null;
  };
};

export type GuestCount = {
  GOING: number;
  MAYBE: number;
  NOT_GOING: number;
  TOTAL_GUESTS: number;
  TOTAL_RESPONSES: number;
};

/**
 * Adds a User to an Event's guest list. Must include the RSVP response.
 * @param eventId
 * @param userId
 * @param status The User's RSVP response (GOING, MAYBE, NOT_GOING)
 * @param name (optional) The display name for Guest
 * @returns `{ data, error }` with data containing
 * [ the RSVP record created, the updated Event record, the updated User record ]
 */
export async function addGuest(
  data: Partial<Rsvp>,
): Promise<{ data: [Rsvp, Event, User] | null; error: string | null }> {
  const { eventId, userId, status, ...rest } = data;
  invariant(eventId && userId && status);

  // Check if user is a host
  if (await isHost(eventId, userId)) {
    return { data: null, error: 'A host cannot RSVP as a guest.' };
  }

  // Create new or update existing RSVP record
  const createGuest = prisma.rsvp.upsert({
    where: {
      id: { eventId, userId },
    },
    update: {
      status,
      ...rest,
    },
    create: {
      eventId,
      userId,
      status,
      ...rest,
    },
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

  return {
    data: await prisma.$transaction([createGuest, connectEvent, connectUser]),
    error: null,
  };
}

/**
 * Retrieves a User's RSVP info for an Event.
 * @param eventId
 * @param userId
 * @returns The RSVP record for an Event guest along with User's profile name and photo.
 */
export async function getGuest(
  eventId: Rsvp['eventId'],
  userId: Rsvp['userId'],
): Promise<RsvpInfo | null> {
  return prisma.rsvp.findUnique({
    where: {
      id: { eventId, userId },
    },
    include: {
      user: {
        select: {
          name: true,
          photo: true,
        },
      },
    },
  });
}

/**
 * Retrieves basic information of all guests for an Event.
 * @param eventId
 * @returns An array of guests for an Event with each Users' profile name, profile photo, and
 * RSVP record.
 */
export async function getGuests(eventId: Rsvp['eventId']): Promise<RsvpInfo[]> {
  return prisma.rsvp.findMany({
    where: {
      eventId,
    },
    include: {
      user: {
        select: {
          name: true,
          photo: true,
        },
      },
    },
  });
}

/**
 * Counts the number of each RSVP response for an Event
 * @param eventId The Event to count the number of guests for
 * @returns The number of guests for each RSVP status
 */
export async function getGuestCount(eventId: Event['id']) {
  const guestList = await prisma.rsvp.findMany({
    where: {
      eventId,
    },
  });

  return countGuests(guestList);
}

/**
 * Counts the number of each RSVP response in a list of RSVPs.
 * @param guests The list of guests (RSVP records) to count
 * @returns The number of guests for each RSVP status (going, maybe, not going) and sums up
 * the total number of responses and the total number of going and maybe responses
 */
export function countGuests(guests: Rsvp[] | RsvpInfo[]) {
  const guestCount = {
    GOING: 0,
    MAYBE: 0,
    NOT_GOING: 0,
    TOTAL_GUESTS: 0,
    TOTAL_RESPONSES: 0,
  };

  guests?.map((rsvp) => (guestCount[rsvp.status] += retypeNull(rsvp.partySize, 1)));
  guestCount.TOTAL_GUESTS = guestCount.GOING + guestCount.MAYBE;
  guestCount.TOTAL_RESPONSES = guestCount.TOTAL_GUESTS + guestCount.NOT_GOING;

  return guestCount;
}

/**
 * Updates any of a User's RSVP info for an Event.
 * @param eventId
 * @param userId
 * @param data An object containing the updated RSVP data: `{ propName: value, ... }`
 * @returns The updated RSVP record
 */
export async function updateGuest(
  eventId: Rsvp['eventId'],
  userId: Rsvp['userId'],
  data: Partial<Omit<Event, 'eventId' | 'userId'>>,
): Promise<Rsvp> {
  return prisma.rsvp.update({
    where: {
      id: { eventId, userId },
    },
    data: { ...data },
  });
}

/**
 * Batch updates RSVP info for all guests of an Event.
 * @param eventId
 * @param data An object containing the updated Host data: `{ propName: value, ... }`
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
 * @param eventId
 * @param userId
 * @returns The deleted RSVP record
 */
export async function removeGuest(
  eventId: Rsvp['eventId'],
  userId: Rsvp['userId'],
): Promise<Rsvp> {
  return prisma.rsvp.delete({
    where: {
      id: { eventId, userId },
    },
  });
}

/**
 * Batch removes all Users from an Event's guest list.
 * @param eventId
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
