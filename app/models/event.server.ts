import { Event, User } from '@prisma/client';
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
 * @returns The Event record including the list of Hosts and Guests.
 */
export async function getEvent(id: Event['id']) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      hosts: true,
      guests: true,
    },
  });
}

/**
 * Updates any of an Event's info and settings.
 * @requires `id` (`eventId`), `data`
 * > `data: { propName: value, ... }`
 * @returns The updated Event record
 */
export async function updateEvent(id: Event['id'], data: Omit<Event, 'id' | 'createdAt'>) {
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
