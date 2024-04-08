import type { Event, User } from '@prisma/client';
import { prisma } from '~/db.server';
import { addTimeZone } from '~/utils/format';
import { isValidDate, retypeAsNum, retypeFalsy } from '~/utils/validate';

export type { Event, Status } from '@prisma/client';

export type EventCardInfo = {
  id: string;
  name: string | null;
  photo: string | null;
  dateStart: Date | string | null;
  timeZone?: string | null;
  city: string | null;
  location: string | null;
  cost: number | null;
};

export type EventFormValues = {
  name?: string;
  photo?: string;
  dateStart?: Date;
  dateEnd?: Date;
  timeZone?: string;
  location?: string;
  cost?: number;
  capacity?: number;
  trailer?: string;
  description?: string;
};

export type JsonifiedEvent = {
  id?: string;
  name?: string | null;
  photo?: string | null;
  dateStart?: string | null;
  dateEnd?: string | null;
  timeZone?: string | null;
  location?: string | null;
  cost?: number | null;
  capacity?: number | null;
  trailer?: string | null;
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
  data: Partial<Omit<Event, 'id' | 'createdAt'>>,
  name?: string,
): Promise<Event> {
  return prisma.event.create({
    data: {
      hosts: {
        create: [{ userId, name }],
      },
      ...retypeEventInput(data),
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
    timeZone: true,
    location: true,
    cost: true,
    capacity: true,
    trailer: true,
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
export async function getEvents(query?: object): Promise<EventCardInfo[]> {
  return prisma.event.findMany({
    where: { ...query },
    select: {
      id: true,
      name: true,
      photo: true,
      dateStart: true,
      timeZone: true,
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
  return prisma.event.update({
    where: { id },
    data: { ...retypeEventInput(data) },
  });
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

/* ---------------------------------- HELPER FUNCTIONS ---------------------------------- */

/**
 * Returns `value` type as a Date. If date isn't valid, then returns null instead of
 * "Invalid Date".
 */
export function retypeAsDate(value: string, timeZone?: string) {
  try {
    const date = new Date(addTimeZone(value, timeZone));
    return isValidDate(date) ? date : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Changes the type of each property of an object to match the types required by the Event
 * database.
 * @param data Object containing Event data of potentially incorrect type
 * @returns Object containing type safe event data
 */
function retypeEventInput(input: { [x: string]: unknown }) {
  const data = retypeFalsy(input, null);

  data.timeZone = data?.timeZone.replaceAll(' ', '_') || undefined;
  data.dateStart = data?.dateStart && retypeAsDate(data.dateStart, data.timeZone);
  data.dateEnd = data?.dateEnd && retypeAsDate(data.dateEnd, data.timeZone);
  data.capacity = retypeAsNum(data.capacity);
  data.cost = data?.cost && retypeAsNum(data.cost);
  data.plusOneLimit = data?.plusOneLimit && retypeAsNum(data.plusOneLimit);
  data.published = data?.published && data.published === 'true';

  return data;
}
