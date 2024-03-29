import type { Event, User } from '@prisma/client';
import { prisma } from '~/db.server';

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

export type EventFormValues = {
  name?: string;
  photo?: string;
  dateStart?: Date;
  dateEnd?: Date;
  location?: string;
  cost?: number;
  capacity?: number;
  description?: string;
};

export type JsonifiedEvent = {
  id?: string;
  name?: string | null;
  photo?: string | null;
  dateStart?: string | null;
  dateEnd?: string | null;
  location?: string | null;
  cost?: number | null;
  capacity?: number | null;
  description?: string | null;
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
 * Retrieves info about an Event.
 * @param `id` Event ID (`eventId`)
 * @param all (optional) Specifies whether to return the entire Event record (all fields)
 * or just the fields containing basic info, defaults to `false`
 * @param includeRelations (optional) Specifies whether returned Event record should include
 * the list of Hosts and Guests the Event has -- only electable if `all` is `true`,
 * defaults to `false`
 * @returns Either the event's basic info `{ id, name, photo, dateStart, dateEnd, location,
 * cost }` or the full Event record
 */
export async function getEvent(
  id: Event['id'],
  all = false,
  includeRelations = false,
): Promise<Partial<Event> | null> {
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

  return prisma.event.findUnique({
    where: { id },
    ...filter,
  });
}

/**
 * Retrieves basic information for events that match a query.
 * @param query (optional) The query to filter Events by
 * @returns An array of all Event records containing the basic information fields:
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
 * @param id (`eventId`) The Event to update
 * @param data An object containing the updated Event data: `{ propName: value, ... }`
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

/**
 * Changes the type of each property of an object to match the types required by the Event
 * database.
 * @param data Object containing Event data of potentially incorrect type
 * @returns Object containing type safe event data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function retypeEventData(data: { [x: string]: any }) {
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
 * @param `id` (`eventId`)
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
