import type { Event, User } from '@prisma/client';
import type { Rsvp, RsvpInfo } from './rsvp.server';
import { prisma } from '~/db.server';
import { retypeNull } from '~/utils';

export type { Event, Status } from '@prisma/client';
export type EventInfo = {
  id: string;
  name: string | null;
  photo: string | null;
  dateStart: Date | string | null;
  city: string | null;
  location: string | null;
  cost: number | null;
};

/**
 * Creates a new event. Must include User to set as Host.
 * @param userId The User to add as a Host of the Event
 * @param data (optional) The info to add to the Event
 * @param name (optional) The display name for Host
 * @returns The newly created Event record
 */
export async function createEvent(
  userId: User['id'],
  data?: Partial<Omit<Event, 'id' | 'createdAt'>>,
  name?: string,
): Promise<Event> {
  if (data) {
    data = retypeEventData(data);
  }
  return prisma.event.create({
    data: {
      hosts: {
        create: [{ userId, name }],
      },
      ...data,
    },
  });
}

/**
 * @requires `id` (`eventId`)
 * @param all (optional) Specifies whether to return the entire Event record (all fields)
 * or just the fields containing basic info, defaults to `false`
 * @param includeRelations (optional) Specifies whether returned Event record should include
 * the list of Hosts and Guests the Event has -- only electable if `all` is `true`,
 * defaults to `false`
 * @returns Either `{ id, name, photo, dateStart, dateEnd, location, cost }`
 * or the full Event record
 */
export async function getEvent(
  id: Event['id'],
  all = false,
  includeRelations = false,
): Promise<Partial<Event>> {
  const selection = {
    id: true,
    name: true,
    photo: true,
    dateStart: true,
    dateEnd: true,
    location: true,
    cost: true,
    capacity: true,
    description: true,
  };

  const filter: object = all
    ? { include: { hosts: includeRelations, guests: includeRelations } }
    : { select: { ...selection } };

  return prisma.event.findUniqueOrThrow({
    where: { id },
    ...filter,
  });
}

/**
 * @param query (optional) The query to filter Events by
 * @returns List of all Event records with the fields:
 * `{ id, name, photo, dateStart, city, location, cost }`
 */
export async function getEvents(query?: object): Promise<EventInfo[]> {
  return prisma.event.findMany({
    where: { ...query },
    select: {
      id: true,
      name: true,
      photo: true,
      dateStart: true,
      city: true,
      location: true,
      cost: true,
    },
  });
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
): Promise<Event | null> {
  data = retypeEventData(data);
  console.log(data);
  return prisma.event.update({
    where: { id },
    data: { ...data },
  });
}

function retypeEventData(data: { [propName: string]: any }) {
  if (typeof data.dateStart === 'string') {
    data.dateStart = data.dateStart.length ? new Date(data.dateStart) : undefined;
  }
  if (typeof data?.dateEnd === 'string') {
    data.dateStart = data.dateStart.length ? new Date(data.dateEnd) : undefined;
  }
  if (typeof data?.capacity === 'string') {
    data.capacity = data.capacity.length ? Number(data.capacity) : undefined;
  }
  if (typeof data?.cost === 'string') {
    data.cost = data.cost.length ? Number(data.cost) : undefined;
  }
  if (typeof data?.plusOneLimit === 'string') {
    data.cost = data.cost.length ? Number(data.cost) : 0;
  }
  if (typeof data?.published === 'string') {
    data.published = data.published === 'true';
  }
  return data;
}

/**
 * Deletes an Events and cascade deletes all related Hosts and RSVPs.
 * @requires `id` (`eventId`)
 * @returns The deleted Event
 */
export async function deleteEvent(id: Event['id']): Promise<Event> {
  return prisma.event.delete({
    where: { id },
    include: {
      hosts: true,
      guests: true,
    },
  });
}
