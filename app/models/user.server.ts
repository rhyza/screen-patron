import type { User } from '@prisma/client';
import { prisma } from '~/db.server';
import { removeHostAllEvents } from './host.server';

export type { User } from '@prisma/client';

/**
 * Creates a new User. A unique email is required.
 * @requires `email`
 * @returns The newly created User record
 */
export async function createUser(email: User['email']) {
  return prisma.user.create({
    data: {
      email,
    },
  });
}

/**
 * @requires `id` (`userId`)
 * @param includeEvents (optional) Specifies whether returned User record should include
 * the list of Events the User is Hosting or has RSVP'd, defaults to `false`
 * @param selection (optional) The specific User fields to return, defaults to full
 * User record without Events unless specified otherwise by `includeEvents`
 * @returns The User record
 */
export async function getUser(
  id: User['id'],
  includeEvents = false,
  selection?: { [key: string]: boolean },
) {
  const filter: object = selection
    ? {
        select: {
          ...selection,
          hosting: includeEvents,
          events: includeEvents,
        },
      }
    : {
        include: {
          hosting: includeEvents,
          events: includeEvents,
        },
      };

  return prisma.user.findUnique({
    where: { id },
    ...filter,
  });
}

/**
 * @requires `email`
 * @param includeEvents (optional) Specifies whether returned User record should include
 * the list of Events the User is Hosting or has RSVP'd, defaults to `false`
 * @returns The User record
 */
export async function getUserByEmail(email: User['email'], includeEvents = false) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      hosting: includeEvents,
      events: includeEvents,
    },
  });
}

/**
 * @requires `id` (`userId`)
 * @returns The User's list of Host and RSVP records.
 * > `{ hosting[], events[] }`
 */
export async function getEvents(id: User['id']) {
  return prisma.user.findUnique({
    where: { id },
    select: { hosting: true, events: true },
  });
}

/**
 * @requires `id` (`userId`)
 * @returns The User's list of Event records for Events the User is hosting.
 */
export async function getEventsHosting(id: User['id']) {
  return prisma.event.findMany({
    where: {
      hosts: {
        some: {
          userId: id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      photo: true,
      dateStart: true,
      dateEnd: true,
      location: true,
      cost: true,
    },
  });
}

/**
 * @requires `id` (`userId`)
 * @param filter (optional) Specifies conditions for which Events to return
 * @param excludeRejected (optional) Specifies whether to include Events for which the User has
 * responded "not going", defaults to `true`
 * @returns The User's list of Event records for Events the User is attending plus
 * their RSVP response.
 */
export async function getEventsResponded(
  id: User['id'],
  filter?: object,
  excludeRejected = true,
) {
  const events = await prisma.event.findMany({
    where: {
      guests: {
        some: {
          userId: id,
        },
      },
      ...filter,
    },
    select: {
      id: true,
      name: true,
      photo: true,
      dateStart: true,
      dateEnd: true,
      location: true,
      cost: true,
      guests: {
        where: {
          userId: id,
        },
      },
    },
  });

  return events.map((event) => {
    const { guests, ...rest } = event;

    // Filter out all NOT_GOING responses if excludeRejected is true
    if (!(excludeRejected && guests[0].status === 'NOT_GOING')) {
      return {
        status: guests[0].status,
        ...rest,
      };
    }
  });
}

/**
 * Updates a User's email or any profile info.
 * @requires `id` (`userId`), `data`
 * > `data: { propName: value, ... }`
 * @param includeEvents (optional) Specifies whether returned User record should include
 * the list of Events the User is Hosting or has RSVP'd, defaults to `false`
 * @returns The updated User record
 */
export async function updateUser(
  id: User['id'],
  data: Partial<Omit<User, 'id' | 'createdAt'>>,
  includeEvents = false,
) {
  return prisma.user.update({
    where: { id },
    data: { ...data },
    include: {
      hosting: includeEvents,
      events: includeEvents,
    },
  });
}

/**
 * Deletes a User and cascade deletes all related RSVPs. The User is removed as a Host from
 * all Events for which there are other Hosts and those Event records will remain.
 * > If the Host is the only Host for an Event and `deleteSoloHostedEvent` is `false`,
 * then an error is thrown, otherwise those Events are deleted as well.
 * @requires `id` (`userId`)
 * @param deleteSoloHostedEvents (optional) Specifies whether to delete any Event records
 * the User is the sole host for, defaults to `false`
 * @returns The deleted User record
 */
export async function deleteUser(id: User['id'], deleteSoloHostedEvents = false) {
  removeHostAllEvents(id, deleteSoloHostedEvents);

  return prisma.user.delete({
    where: { id },
  });
}
