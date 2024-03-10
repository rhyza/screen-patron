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
 * @returns The User record
 */
export async function getUser(id: User['id'], includeEvents = false) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      hosting: includeEvents,
      events: includeEvents,
    },
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
 * @returns The User's ID, name, and profile photo.
 */
export async function getUserSnippet(id: User['id']) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, photo: true },
  });
}

/**
 * @requires `id` (`userId`)
 * @returns The list of Events the User is Hosting or has RSVP'd.
 * > `{ hosting[], events[] }`
 */
export async function getEvents(id: User['id']) {
  return prisma.user.findUnique({
    where: { id },
    select: { hosting: true, events: true },
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
