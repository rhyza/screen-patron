import { Event, Rsvp, Status, User } from '@prisma/client';
import { prisma } from '~/db.server';

export type { Event } from '@prisma/client';

/**
 * Creates a new event. Must include User to set as Host.
 * @param userId The User to add as a Host of the Event
 * @param name (optional) The display name for Host
 * @returns The newly created Event record
 */
export async function createEvent(userId: User['id'], name?: string) {
  return prisma.event.create({
    data: {
      hosts: {
        create: [{ userId, name }],
      },
    },
  });
}

/**
 * @requires `id` (`eventId`)
 * @param includeGuests (optional) Specifies whether returned Event record should include
 * the list of Guests the Event has, defaults to `true`
 * @returns The Event record including the list of Hosts and Guests.
 */
export async function getEvent(id: Event['id'], includeGuests = true) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      hosts: true,
      guests: includeGuests,
    },
  });
}

/**
 * @param eventId The Event to count the number of guests for
 * @returns The number of guests for each RSVP status
 */
export async function getGuestCount(eventId: Event['id']) {
  const result = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      guests: true,
    },
  });
  const guestList = result?.guests;

  return countGuests(guestList);
}

/**
 * @param guests The list of guests (RSVP records) to count
 * @returns The number of guests for each RSVP status
 */
export function countGuests(
  guests: (Rsvp & { name?: string | null; photo?: string | null })[] | undefined,
) {
  let guestCount = {
    GOING: 0,
    MAYBE: 0,
    NOT_GOING: 0,
    TOTAL_GUESTS: 0,
    TOTAL_RESPONSES: 0,
  };

  guests?.map((rsvp) => (guestCount[rsvp.status] += 1 + rsvp.numPlusOnes));
  guestCount.TOTAL_GUESTS = guestCount.GOING + guestCount.MAYBE;
  guestCount.TOTAL_RESPONSES = guestCount.TOTAL_GUESTS + guestCount.NOT_GOING;

  return guestCount;
}

/**
 * Updates any of an Event's info and settings.
 * @requires `id` (`eventId`), `data`
 * > `data: { propName: value, ... }`
 * @returns The updated Event record
 */
export async function updateEvent(
  id: Event['id'],
  data: Partial<Omit<Event, 'id' | 'createdAt'>>,
) {
  return prisma.event.update({
    where: { id },
    data: { ...data },
  });
}

/**
 * Deletes an Events and cascade deletes all related Hosts and RSVPs.
 * @requires `id` (`eventId`)
 * @returns The deleted Event
 */
export async function deleteEvent(id: Event['id']) {
  return prisma.event.delete({
    where: { id },
    include: {
      hosts: true,
      guests: true,
    },
  });
}
