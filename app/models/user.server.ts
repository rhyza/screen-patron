import type { User } from '@prisma/client';
import { prisma } from '~/db.server';
import { removeHost } from './host.server';

export type { User } from '@prisma/client';

export async function createUser(email: User['email']) {
  return prisma.user.create({
    data: {
      email,
    },
  });
}

export async function getUser(id: User['id'], includeEvents = false) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      hosting: includeEvents,
      events: includeEvents,
    },
  });
}

export async function getUserByEmail(email: User['email'], includeEvents = false) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      hosting: includeEvents,
      events: includeEvents,
    },
  });
}

export async function getUserSnippet(id: User['id']) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, photo: true },
  });
}

export async function getEvents(id: User['id']) {
  return prisma.user.findUnique({
    where: { id },
    select: { hosting: true, events: true },
  });
}

export async function updateUser(id: User['id'], data: Omit<User, 'id' | 'createdAt'>) {
  return prisma.user.update({
    where: { id },
    data: { ...data },
  });
}

/**
 * Deletes a User and cascade deletes all RSVPs. If a User is the only Host of an Event,
 * an error is thrown, unless `deleteSoloHostedEvents` is set to `true` in which case that
 * Event will also be deleted.
 * @param deleteSoloHostedEvents Default value is `false`
 */
export async function deleteUser(id: User['id'], deleteSoloHostedEvents = false) {
  const hosting = await prisma.user.findUnique({
    where: { id },
    select: { hosting: true },
  });

  if (hosting && hosting.hosting.length > 0) {
    hosting.hosting.map(({ eventId, userId }) =>
      removeHost(eventId, userId, deleteSoloHostedEvents),
    );
  }

  return prisma.user.delete({
    where: { id },
  });
}
